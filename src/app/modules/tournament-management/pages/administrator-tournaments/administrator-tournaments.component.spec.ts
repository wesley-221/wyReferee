import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministratorTournamentsComponent } from './administrator-tournaments.component';

describe('AdministratorTournamentsComponent', () => {
	let component: AdministratorTournamentsComponent;
	let fixture: ComponentFixture<AdministratorTournamentsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AdministratorTournamentsComponent],
			imports: []
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AdministratorTournamentsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
