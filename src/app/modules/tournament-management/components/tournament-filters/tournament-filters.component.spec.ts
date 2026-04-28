import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentFiltersComponent } from './tournament-filters.component';

describe('TournamentFiltersComponent', () => {
	let component: TournamentFiltersComponent;
	let fixture: ComponentFixture<TournamentFiltersComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TournamentFiltersComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(TournamentFiltersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
