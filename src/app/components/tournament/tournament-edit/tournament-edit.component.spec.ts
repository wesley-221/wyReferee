import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentEditComponent } from './tournament-edit.component';

describe('TournamentEditComponent', () => {
	let component: TournamentEditComponent;
	let fixture: ComponentFixture<TournamentEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentEditComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
