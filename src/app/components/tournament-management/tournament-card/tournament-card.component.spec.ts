import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCardComponent } from './tournament-card.component';

describe('TournamentCardComponent', () => {
	let component: TournamentCardComponent;
	let fixture: ComponentFixture<TournamentCardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentCardComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentCardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
