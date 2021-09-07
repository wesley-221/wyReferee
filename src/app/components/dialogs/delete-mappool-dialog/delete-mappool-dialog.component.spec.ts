import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMappoolDialogComponent } from './delete-mappool-dialog.component';

describe('DeleteMappoolDialogComponent', () => {
	let component: DeleteMappoolDialogComponent;
	let fixture: ComponentFixture<DeleteMappoolDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeleteMappoolDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeleteMappoolDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
