import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModBracketDialogComponent } from './delete-mod-bracket-dialog.component';

describe('DeleteModBracketDialogComponent', () => {
	let component: DeleteModBracketDialogComponent;
	let fixture: ComponentFixture<DeleteModBracketDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeleteModBracketDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeleteModBracketDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
