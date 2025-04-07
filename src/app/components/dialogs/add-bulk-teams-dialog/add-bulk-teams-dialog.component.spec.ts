import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBulkTeamsDialogComponent } from './add-bulk-teams-dialog.component';

describe('AddBulkTeamsDialogComponent', () => {
	let component: AddBulkTeamsDialogComponent;
	let fixture: ComponentFixture<AddBulkTeamsDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [AddBulkTeamsDialogComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(AddBulkTeamsDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
