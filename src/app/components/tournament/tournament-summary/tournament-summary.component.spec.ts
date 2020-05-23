import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentSummaryComponent } from './tournament-summary.component';

describe('TournamentSummaryComponent', () => {
	let component: TournamentSummaryComponent;
	let fixture: ComponentFixture<TournamentSummaryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentSummaryComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
