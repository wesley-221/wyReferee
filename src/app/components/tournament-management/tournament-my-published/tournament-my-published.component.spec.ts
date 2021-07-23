import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentMyPublishedComponent } from './tournament-my-published.component';

describe('TournamentMyPublishedComponent', () => {
	let component: TournamentMyPublishedComponent;
	let fixture: ComponentFixture<TournamentMyPublishedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentMyPublishedComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentMyPublishedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
