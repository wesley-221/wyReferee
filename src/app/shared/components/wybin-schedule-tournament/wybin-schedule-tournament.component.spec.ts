import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WybinScheduleTournamentComponent } from './wybin-schedule-tournament.component';

describe('WybinScheduleTournamentComponent', () => {
	let component: WybinScheduleTournamentComponent;
	let fixture: ComponentFixture<WybinScheduleTournamentComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WybinScheduleTournamentComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(WybinScheduleTournamentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
