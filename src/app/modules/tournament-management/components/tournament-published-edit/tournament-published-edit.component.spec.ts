import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentPublishedEditComponent } from './tournament-published-edit.component';

describe('TournamentPublishedEditComponent', () => {
	let component: TournamentPublishedEditComponent;
	let fixture: ComponentFixture<TournamentPublishedEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentPublishedEditComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentPublishedEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
