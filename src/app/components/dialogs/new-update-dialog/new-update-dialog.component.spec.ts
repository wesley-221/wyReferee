import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUpdateDialogComponent } from './new-update-dialog.component';

describe('NewUpdateDialogComponent', () => {
	let component: NewUpdateDialogComponent;
	let fixture: ComponentFixture<NewUpdateDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NewUpdateDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(NewUpdateDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
