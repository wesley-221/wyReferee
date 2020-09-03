import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiplayerLobbyMovePlayerComponent } from './multiplayer-lobby-move-player.component';

describe('MultiplayerLobbyMovePlayerComponent', () => {
	let component: MultiplayerLobbyMovePlayerComponent;
	let fixture: ComponentFixture<MultiplayerLobbyMovePlayerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MultiplayerLobbyMovePlayerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MultiplayerLobbyMovePlayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
