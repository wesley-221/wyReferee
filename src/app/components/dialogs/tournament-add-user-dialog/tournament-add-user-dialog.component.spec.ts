import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentAddUserDialogComponent } from './tournament-add-user-dialog.component';

describe('TournamentAddUserDialogComponent', () => {
	let component: TournamentAddUserDialogComponent;
	let fixture: ComponentFixture<TournamentAddUserDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentAddUserDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentAddUserDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
