import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentAllPublishedComponent } from './tournament-all-published.component';

describe('TournamentAllPublishedComponent', () => {
	let component: TournamentAllPublishedComponent;
	let fixture: ComponentFixture<TournamentAllPublishedComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentAllPublishedComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentAllPublishedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
