import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentOverviewComponent } from './tournament-overview.component';

describe('TournamentOverviewComponent', () => {
	let component: TournamentOverviewComponent;
	let fixture: ComponentFixture<TournamentOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentOverviewComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
