import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishTournamentDialogComponent } from './publish-tournament-dialog.component';

describe('PublishTournamentDialogComponent', () => {
	let component: PublishTournamentDialogComponent;
	let fixture: ComponentFixture<PublishTournamentDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PublishTournamentDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PublishTournamentDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
