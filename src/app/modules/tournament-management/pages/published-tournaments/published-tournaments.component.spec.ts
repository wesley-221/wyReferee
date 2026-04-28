import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedTournamentsComponent } from './published-tournaments.component';

describe('PublishedTournamentsComponent', () => {
	let component: PublishedTournamentsComponent;
	let fixture: ComponentFixture<PublishedTournamentsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [PublishedTournamentsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(PublishedTournamentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
