import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataMigrationDialogComponent } from './data-migration-dialog.component';

describe('DataMigrationDialogComponent', () => {
	let component: DataMigrationDialogComponent;
	let fixture: ComponentFixture<DataMigrationDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [DataMigrationDialogComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(DataMigrationDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
