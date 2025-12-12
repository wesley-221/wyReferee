import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateMatchResultsDialogComponent } from './update-match-results-dialog.component';

describe('UpdateMatchResultsDialogComponent', () => {
	let component: UpdateMatchResultsDialogComponent;
	let fixture: ComponentFixture<UpdateMatchResultsDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UpdateMatchResultsDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(UpdateMatchResultsDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
