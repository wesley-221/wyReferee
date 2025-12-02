import { app, BrowserWindow, ipcMain } from "electron";
import { IPC_CHANNELS } from "../ipc-channels";

import * as path from "path";
import * as fs from "fs";

interface MigrationOptions {
	webhookCustomization: boolean;
	tournaments: boolean;
	lobbies: boolean;
	ircChannels: boolean;
	ircShortcutCommands: boolean;
	keepDataBackup: boolean;
}

export function registerDataMigrationHandler(window: BrowserWindow) {
	const configFile = path.join(app.getPath('userData'), 'config.json');

	/**
	 * Check for migrations and notify renderer process
	 */
	ipcMain.handle(IPC_CHANNELS.CHECK_FOR_MIGRATIONS_AND_NOTIFY, async () => {
		if (fs.existsSync(configFile)) {
			window.webContents.send(IPC_CHANNELS.MIGRATION_NEEDED, true);
		}
	});

	/**
	 * Restart app after migration
	 */
	ipcMain.handle(IPC_CHANNELS.RESTART_APP_AFTER_MIGRATION, () => {
		app.relaunch();
		app.exit(0);
	});

	/**
	 * Start data migration process
	 */
	ipcMain.handle(IPC_CHANNELS.START_DATA_MIGRATION, async (event, migrationOptions: MigrationOptions) => {
		const updatedMigrations: { status: string; message: string }[] = [];

		if (fs.existsSync(configFile)) {
			const configData = fs.readFileSync(configFile, 'utf-8');
			const config = JSON.parse(configData);

			/**
			 * Migrate webhook customization settings
			 */
			if (migrationOptions.webhookCustomization) {
				const webhookCustomizationData = config.webhook;

				if (!webhookCustomizationData) {
					updatedMigrations.push({ 'status': 'error', message: 'No webhook customization data found to migrate' });
				}
				else {
					try {
						const newData = {
							authorImage: webhookCustomizationData.authorImage,
							authorName: webhookCustomizationData.authorName,
							bottomImage: webhookCustomizationData.bottomImage,
							footerIconUrl: webhookCustomizationData.footerIconUrl,
							footerText: webhookCustomizationData.footerText
						}

						const webhookSettingsPath = path.join(app.getPath('userData'), 'data', 'webhook-settings.json');
						fs.writeFileSync(webhookSettingsPath, JSON.stringify(newData), 'utf-8');

						updatedMigrations.push({ 'status': 'success', message: 'Migrated webhook customization settings' });
					}
					catch (error) {
						updatedMigrations.push({ 'status': 'error', message: `Couldnt migrate webhook customization settings: ${error}` });
					}
				}
			}

			/**
			 * Migrate tournaments
			 */
			if (migrationOptions.tournaments) {
				const cache = config.cache;

				if (!cache) {
					updatedMigrations.push({ 'status': 'error', message: 'No tournaments data found to migrate' });
				}
				else {
					const tournaments = cache.tournaments;

					if (!tournaments) {
						updatedMigrations.push({ 'status': 'error', message: 'No tournaments data found to migrate' });
					}
					else {
						const tournamentsFolderPath = path.join(app.getPath('userData'), 'data', 'tournaments');

						for (const tournamentId in tournaments) {
							const tournament = tournaments[tournamentId];

							try {
								const tournamentFilePath = path.join(tournamentsFolderPath, `${tournament.id}-${tournament.acronym.toLowerCase()}.json`);
								fs.writeFileSync(tournamentFilePath, JSON.stringify(tournament), 'utf-8');

								updatedMigrations.push({ 'status': 'success', message: `Migrated tournament ${tournament.name}` });
							}
							catch (error) {
								updatedMigrations.push({ 'status': 'error', message: `Couldnt migrate tournament ${tournamentId}: ${error}` });
							}
						}
					}
				}
			}

			/**
			 * Migrate lobbies
			 */
			if (migrationOptions.lobbies) {
				const lobbies = config.lobby;

				if (!lobbies) {
					updatedMigrations.push({ 'status': 'error', message: 'No lobbies data found to migrate' });
				}
				else {
					const lobbiesFolderPath = path.join(app.getPath('userData'), 'data', 'lobbies');

					for (const lobbyId in lobbies) {
						try {
							const lobby = lobbies[lobbyId];
							const lobbyPrefix = lobby.tournament ? `${lobby.lobbyId}-${lobby.tournament.acronym.toLowerCase()}` : lobby.lobbyId;
							const lobbyDescription = lobby.description.replace(/\s/g, '-').replace(/[^\w\-]+/g, '').toLowerCase();
							const lobbyFilePath = path.join(lobbiesFolderPath, `${lobbyPrefix}-${lobbyDescription}.json`);

							fs.writeFileSync(lobbyFilePath, JSON.stringify(lobby), 'utf-8');

							updatedMigrations.push({ 'status': 'success', message: `Migrated lobby ${lobby.description}` });
						}
						catch (error) {
							updatedMigrations.push({ 'status': 'error', message: `Couldnt migrate lobby ${lobbyId}: ${error}` });
						}
					}
				}
			}

			/**
			 * Migrate IRC channels
			 */
			if (migrationOptions.ircChannels) {
				const ircConfig = config.irc;

				if (!ircConfig) {
					updatedMigrations.push({ 'status': 'error', message: 'No IRC channels data found to migrate' });
				}
				else {
					const ircChannels = ircConfig.channels;

					if (!ircChannels) {
						updatedMigrations.push({ 'status': 'error', message: 'No IRC channels data found to migrate' });
					}
					else {
						const ircChannelsFolderPath = path.join(app.getPath('userData'), 'data', 'irc');

						for (const channelName in ircChannels) {
							const channel = ircChannels[channelName];
							const finalChannelName = channel.label ?? channelName;

							try {
								const channelFilePath = path.join(ircChannelsFolderPath, `${channelName.toLowerCase()}.json`);
								const channelMessagesFilePath = path.join(ircChannelsFolderPath, `${channelName.toLowerCase()}.messages.ndjson`);

								const channelMessages = [];

								for (const message of channel.messages) {
									channelMessages.push({ type: 'message', content: message });
								}

								for (const message of channel.plainMessageHistory) {
									channelMessages.push({ type: 'plain', content: message });
								}

								const newChannel = JSON.parse(JSON.stringify(channel));

								newChannel.messages = [];
								newChannel.plainMessageHistory = [];

								fs.writeFileSync(channelFilePath, JSON.stringify(newChannel), 'utf-8');
								fs.writeFileSync(channelMessagesFilePath, channelMessages.map(m => JSON.stringify(m)).join('\n'), 'utf-8');

								updatedMigrations.push({ 'status': 'success', message: `Migrated IRC channel ${finalChannelName}` });
							}
							catch (error) {
								updatedMigrations.push({ 'status': 'error', message: `Couldnt migrate IRC channel ${finalChannelName}: ${error}` });
							}
						}
					}
				}
			}

			/**
			 * Migrate IRC shortcut commands
			 */
			if (migrationOptions.ircShortcutCommands) {
				const ircShortcutCommands = config['irc-shortcut-commands'];

				if (!ircShortcutCommands) {
					updatedMigrations.push({ 'status': 'error', message: 'No IRC shortcut commands data found to migrate' });
				}
				else {
					try {
						let id = 0;
						let newIrcShortcutCommands: any = {};

						for (const ircCommand in ircShortcutCommands) {
							const commandData = ircShortcutCommands[ircCommand];

							const newCommandData = {
								id: id++,
								label: commandData.label,
								command: commandData.command,
								warning: commandData.warning || false
							};

							newIrcShortcutCommands[newCommandData.id] = newCommandData;
						}

						const ircShortcutCommandsPath = path.join(app.getPath('userData'), 'data', 'irc-shortcut-commands.json');
						fs.writeFileSync(ircShortcutCommandsPath, JSON.stringify(newIrcShortcutCommands), 'utf-8');

						updatedMigrations.push({ 'status': 'success', message: 'Migrated IRC shortcut commands' });
					}
					catch (error) {
						updatedMigrations.push({ 'status': 'error', message: `Couldnt migrate IRC shortcut commands: ${error}` });
					}
				}
			}

			if (migrationOptions.keepDataBackup) {
				const keysToRemove = ['api-key', 'irc.username', 'irc.password', 'auth', 'oauth', 'osu-oauth'];

				keysToRemove.forEach(key => {
					const parts = key.split(".");
					const last = parts.pop()!;
					let current = config;

					for (const part of parts) {
						if (current[part] == null) return; // stop if missing
						current = current[part];
					}

					delete current[last];
				});

				fs.writeFileSync(configFile, JSON.stringify(config, null, '\t'), 'utf-8');

				const backupFile = path.join(app.getPath('userData'), `config-backup-${Date.now()}.json`);
				fs.renameSync(configFile, backupFile);

				updatedMigrations.push({ 'status': 'success', message: `Backup of original config created at ${backupFile}` });
			}
			else {
				fs.unlinkSync(configFile);

				updatedMigrations.push({ 'status': 'success', message: 'Original config file deleted' });
			}
		}

		return updatedMigrations;
	});
}
