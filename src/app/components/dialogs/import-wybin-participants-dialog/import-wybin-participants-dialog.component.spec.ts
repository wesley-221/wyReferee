import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportWybinParticipantsDialogComponent } from './import-wybin-participants-dialog.component';

describe('ImportWybinParticipantsDialogComponent', () => {
	let component: ImportWybinParticipantsDialogComponent;
	let fixture: ComponentFixture<ImportWybinParticipantsDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ImportWybinParticipantsDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ImportWybinParticipantsDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
