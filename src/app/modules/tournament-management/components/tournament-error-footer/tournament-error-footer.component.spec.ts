import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentErrorFooterComponent } from './tournament-error-footer.component';

describe('TournamentErrorFooterComponent', () => {
	let component: TournamentErrorFooterComponent;
	let fixture: ComponentFixture<TournamentErrorFooterComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TournamentErrorFooterComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(TournamentErrorFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
