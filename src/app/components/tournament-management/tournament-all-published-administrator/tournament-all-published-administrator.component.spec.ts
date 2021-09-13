import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentAllPublishedAdministratorComponent } from './tournament-all-published-administrator.component';

describe('TournamentAllPublishedAdministratorComponent', () => {
	let component: TournamentAllPublishedAdministratorComponent;
	let fixture: ComponentFixture<TournamentAllPublishedAdministratorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentAllPublishedAdministratorComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentAllPublishedAdministratorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
