import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcMatchSettingsMultiplayerLobbySettingsComponent } from './irc-match-settings-multiplayer-lobby-settings.component';

describe('IrcMatchSettingsMultiplayerLobbySettingsComponent', () => {
	let component: IrcMatchSettingsMultiplayerLobbySettingsComponent;
	let fixture: ComponentFixture<IrcMatchSettingsMultiplayerLobbySettingsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcMatchSettingsMultiplayerLobbySettingsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcMatchSettingsMultiplayerLobbySettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
