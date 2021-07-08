import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteTournamentDialogComponent } from './delete-tournament-dialog.component';

describe('DeleteTournamentDialogComponent', () => {
	let component: DeleteTournamentDialogComponent;
	let fixture: ComponentFixture<DeleteTournamentDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeleteTournamentDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeleteTournamentDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
