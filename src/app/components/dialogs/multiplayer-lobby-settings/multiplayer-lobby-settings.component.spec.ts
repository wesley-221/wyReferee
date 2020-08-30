import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerLobbySettingsComponent } from './multiplayer-lobby-settings.component';

describe('MultiplayerLobbySettingsComponent', () => {
	let component: MultiplayerLobbySettingsComponent;
	let fixture: ComponentFixture<MultiplayerLobbySettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MultiplayerLobbySettingsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MultiplayerLobbySettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
