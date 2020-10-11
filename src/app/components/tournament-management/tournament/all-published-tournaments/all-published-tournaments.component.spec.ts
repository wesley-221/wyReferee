import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPublishedTournamentsComponent } from './all-published-tournaments.component';

describe('AllPublishedTournamentsComponent', () => {
	let component: AllPublishedTournamentsComponent;
	let fixture: ComponentFixture<AllPublishedTournamentsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AllPublishedTournamentsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AllPublishedTournamentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
