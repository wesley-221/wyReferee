import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentCreationComponent } from './tournament-creation.component';

describe('TournamentCreationComponent', () => {
	let component: TournamentCreationComponent;
	let fixture: ComponentFixture<TournamentCreationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentCreationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentCreationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
