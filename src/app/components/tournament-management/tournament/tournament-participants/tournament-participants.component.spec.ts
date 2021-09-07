import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentParticipantsComponent } from './tournament-participants.component';

describe('TournamentParticipantsComponent', () => {
	let component: TournamentParticipantsComponent;
	let fixture: ComponentFixture<TournamentParticipantsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentParticipantsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentParticipantsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
