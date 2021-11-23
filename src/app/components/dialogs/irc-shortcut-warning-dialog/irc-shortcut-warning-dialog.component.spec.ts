import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcShortcutWarningDialogComponent } from './irc-shortcut-warning-dialog.component';

describe('IrcShortcutWarningDialogComponent', () => {
	let component: IrcShortcutWarningDialogComponent;
	let fixture: ComponentFixture<IrcShortcutWarningDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IrcShortcutWarningDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IrcShortcutWarningDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
