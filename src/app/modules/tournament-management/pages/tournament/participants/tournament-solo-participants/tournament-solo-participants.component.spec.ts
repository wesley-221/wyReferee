import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSoloParticipantsComponent } from './tournament-solo-participants.component';

describe('TournamentSoloParticipantsComponent', () => {
	let component: TournamentSoloParticipantsComponent;
	let fixture: ComponentFixture<TournamentSoloParticipantsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentSoloParticipantsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentSoloParticipantsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
