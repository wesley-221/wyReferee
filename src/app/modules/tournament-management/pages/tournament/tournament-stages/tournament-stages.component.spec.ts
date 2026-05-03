import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentStagesComponent } from './tournament-stages.component';

describe('TournamentStagesComponent', () => {
	let component: TournamentStagesComponent;
	let fixture: ComponentFixture<TournamentStagesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentStagesComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentStagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
