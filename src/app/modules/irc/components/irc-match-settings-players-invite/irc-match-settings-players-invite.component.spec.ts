import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcMatchSettingsPlayersInviteComponent } from './irc-match-settings-players-invite.component';

describe('IrcMatchSettingsPlayersInviteComponent', () => {
	let component: IrcMatchSettingsPlayersInviteComponent;
	let fixture: ComponentFixture<IrcMatchSettingsPlayersInviteComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcMatchSettingsPlayersInviteComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcMatchSettingsPlayersInviteComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
