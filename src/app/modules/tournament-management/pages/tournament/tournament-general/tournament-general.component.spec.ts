import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentGeneralComponent } from './tournament-general.component';

describe('TournamentGeneralComponent', () => {
	let component: TournamentGeneralComponent;
	let fixture: ComponentFixture<TournamentGeneralComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentGeneralComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentGeneralComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
