import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentTeamParticipantsComponent } from './tournament-team-participants.component';

describe('TournamentTeamParticipantsComponent', () => {
	let component: TournamentTeamParticipantsComponent;
	let fixture: ComponentFixture<TournamentTeamParticipantsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentTeamParticipantsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentTeamParticipantsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
