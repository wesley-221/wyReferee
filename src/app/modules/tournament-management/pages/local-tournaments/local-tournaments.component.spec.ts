import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalTournamentsComponent } from './local-tournaments.component';

describe('LocalTournamentsComponent', () => {
	let component: LocalTournamentsComponent;
	let fixture: ComponentFixture<LocalTournamentsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [LocalTournamentsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(LocalTournamentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
