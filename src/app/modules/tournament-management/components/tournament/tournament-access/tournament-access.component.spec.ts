import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentAccessComponent } from './tournament-access.component';

describe('TournamentAccessComponent', () => {
	let component: TournamentAccessComponent;
	let fixture: ComponentFixture<TournamentAccessComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentAccessComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentAccessComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
