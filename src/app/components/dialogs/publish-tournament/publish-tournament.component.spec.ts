import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishTournamentComponent } from './publish-tournament.component';

describe('PublishTournamentComponent', () => {
	let component: PublishTournamentComponent;
	let fixture: ComponentFixture<PublishTournamentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PublishTournamentComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PublishTournamentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
