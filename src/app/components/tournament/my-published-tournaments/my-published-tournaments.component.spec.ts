import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPublishedTournamentsComponent } from './my-published-tournaments.component';

describe('MyPublishedTournamentsComponent', () => {
	let component: MyPublishedTournamentsComponent;
	let fixture: ComponentFixture<MyPublishedTournamentsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MyPublishedTournamentsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MyPublishedTournamentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
