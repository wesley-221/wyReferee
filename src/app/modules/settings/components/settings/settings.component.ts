import { Component, OnInit } from '@angular/core';
import { ElectronService } from '../../../../services/electron.service';
import { ToastService } from '../../../../services/toast.service';
import { ToastType } from '../../../../models/toast';
import { MatDialog } from '@angular/material/dialog';
import { RemoveSettingsComponent } from '../../../../components/dialogs/remove-settings/remove-settings.component';
import { AuthenticateService } from 'app/services/authenticate.service';
import { IrcService } from 'app/services/irc.service';
import { GenericService } from 'app/services/generic.service';
import { OptionsMenu } from '../../models/options-menu';
import { CacheStoreService } from 'app/services/storage/cache-store.service';
import { WebhookService } from '../../../../services/webhook.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {
	dialogMessage: string;

	axsMenuStatus: boolean;
	showIncorrectSlotStatus: boolean;
	splitBanchoBotMessages: boolean;
	chatContainerSwitched: boolean;
	showAllShortcutsStatus: boolean;

	generalOptions: OptionsMenu[] = [
		{ header: 'Show AxS menu item', description: 'Toggle visibility of the AxS menu item in the sidebar', action: () => this.toggleAxSMenu(), slideToggle: true, slideToggleValue: this.genericService.getAxSMenuStatus() }
	];

	ircOptions: OptionsMenu[] = [
		{ header: 'Show incorrect slot warning', description: 'Toggle whether to show a warning when a player is in an incorrect slot. This is shown when <code>!mp settings</code> is used', action: () => this.toggleShowIncorrectSlot(), slideToggle: true, slideToggleValue: this.genericService.getShowIncorrectSlotStatus() },
		{ header: 'Split BanchoBot messages', description: 'Toggle whether to split BanchoBot messages into its own chat container', action: () => this.toggleSplitBanchoBotMessages(), slideToggle: true, slideToggleValue: this.genericService.getSplitBanchoBotMessagesStatus() },
		{ header: 'Switch chat containers', description: 'Toggle whether to switch the chat containers, default is BanchoBot container on top, normal chat container on the bottom. When enabled, the normal chat container will be on top and the BanchoBot container will be on the bottom.', action: () => this.toggleChatContainerSwitch(), slideToggle: true, slideToggleValue: this.genericService.getChatContainerSwitchStatus() },
		{ header: 'Display all shortcut commands without scrollbar', description: 'Toggle whether to display all shortcut commands in the shortcuts menu without a scrollbar. These are the buttons above the send message input on the IRC page', action: () => this.toggleShowAllShortcuts(), slideToggle: true, slideToggleValue: this.genericService.getShowAllShortcutsStatus() }
	];

	configurationOptions: OptionsMenu[] = [
		{ header: 'Export data', description: 'Download all your data as a single ZIP file. Sensitive information, such as API keys and other credentials, are not included.', buttonText: 'Export', action: () => this.exportConfigFile() },
		{ header: 'Clear cache', description: 'Wipes all locally cached data.', buttonText: 'Clear cache', action: () => this.openDialog(0) },
		{ header: 'Remove API key', description: 'Removes your API key from the application.', buttonText: 'Remove', action: () => this.openDialog(1) }
	];

	webhookAuthorImage: string;
	webhookAuthorName: string;
	webhookBottomImage: string;
	webhookFooterIconUrl: string;
	webhookFooterText: string;

	constructor(
		public electronService: ElectronService,
		private toastService: ToastService,
		private dialog: MatDialog,
		public authService: AuthenticateService,
		public ircService: IrcService,
		private genericService: GenericService,
		private cacheStoreService: CacheStoreService,
		private webhookService: WebhookService
	) { }

	ngOnInit() {
		this.genericService.getAxSMenuStatus().subscribe(status => {
			this.axsMenuStatus = status;
		});

		this.genericService.getShowIncorrectSlotStatus().subscribe(status => {
			this.showIncorrectSlotStatus = status;
		});

		this.genericService.getSplitBanchoBotMessagesStatus().subscribe(status => {
			this.splitBanchoBotMessages = status;
		});

		this.genericService.getChatContainerSwitchStatus().subscribe(status => {
			this.chatContainerSwitched = status;
		});

		this.genericService.getShowAllShortcutsStatus().subscribe(status => {
			this.showAllShortcutsStatus = status;
		});

		this.webhookAuthorImage = this.webhookService.authorImage;
		this.webhookAuthorName = this.webhookService.authorName;
		this.webhookBottomImage = this.webhookService.bottomImage;
		this.webhookFooterIconUrl = this.webhookService.footerIconUrl;
		this.webhookFooterText = this.webhookService.footerText;
	}

	/**
	 * Clear the cache
	 */
	clearCache() {
		this.cacheStoreService.resetCache('beatmaps');
		this.cacheStoreService.resetCache('users');

		this.toastService.addToast('Successfully cleared the cache.');
	}

	/**
	 * Remove the API key
	 */
	removeApiKey() {
		window.electronApi.osuAuthentication.clearApiKey();
		this.toastService.addToast('Successfully removed your API key.');
	}

	/**
	 * Export the config file
	 */
	exportConfigFile() {
		let fileName = 'wyReferee-settings.zip';

		if (this.authService.loggedIn) {
			const username = this.authService.loggedInUser.username.replace(/[^a-z0-9]/gi, '_').toLowerCase();
			fileName = `wyReferee-settings-${username}.zip`;
		}

		window.electronApi.dialog.showSaveDialog({
			title: 'Export wyReferee settings',
			defaultPath: fileName
		}).then(file => {
			if (file.canceled) {
				return;
			}

			window.electronApi.dialog.saveSettingsZip(file.filePath).then(() => {
				this.toastService.addToast(`Successfully saved the config files to "${file.filePath}".`);
			}).catch((err: Error) => {
				this.toastService.addToast(`Something went wrong while trying to export the config files: ${err.message}.`, ToastType.Error);
			});
		});
	}

	openDialog(dialogAction: number) {
		let dialogMessage: string = null;

		if (dialogAction == 0) {
			dialogMessage = 'Are you sure you want to clear your cache?';
		}
		else if (dialogAction == 1) {
			dialogMessage = 'Are you sure you want to remove your API key?';
		}

		const dialogRef = this.dialog.open(RemoveSettingsComponent, {
			data: {
				message: dialogMessage
			}
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res == true) {
				if (dialogAction == 0) {
					this.clearCache();
				}
				else if (dialogAction == 1) {
					this.removeApiKey();
				}
			}
		});
	}

	toggleAxSMenu(): void {
		this.axsMenuStatus = !this.axsMenuStatus;
		this.genericService.setAxSMenu(this.axsMenuStatus);
	}

	toggleShowIncorrectSlot(): void {
		this.showIncorrectSlotStatus = !this.showIncorrectSlotStatus;
		this.genericService.setShowIncorrectSlot(this.showIncorrectSlotStatus);
	}

	toggleSplitBanchoBotMessages(): void {
		this.splitBanchoBotMessages = !this.splitBanchoBotMessages;
		this.genericService.setSplitBanchoBotMessages(this.splitBanchoBotMessages);
	}

	toggleChatContainerSwitch(): void {
		this.chatContainerSwitched = !this.chatContainerSwitched;
		this.genericService.toggleChatContainerSwitch(this.chatContainerSwitched);
	}

	updateWebhookCustomization(): void {
		this.webhookService.updateWebhookCustomization(this.webhookAuthorImage, this.webhookAuthorName, this.webhookBottomImage, this.webhookFooterIconUrl, this.webhookFooterText);
		this.toastService.addToast(`Successfully updated your personal webhook customizations.`);
	}

	toggleShowAllShortcuts(): void {
		this.showAllShortcutsStatus = !this.showAllShortcutsStatus;
		this.genericService.setShowAllShortcuts(this.showAllShortcutsStatus);
	}
}
