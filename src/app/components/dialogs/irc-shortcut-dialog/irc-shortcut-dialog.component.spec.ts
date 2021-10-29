import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcShortcutDialogComponent } from './irc-shortcut-dialog.component';

describe('IrcShortcutDialogComponent', () => {
	let component: IrcShortcutDialogComponent;
	let fixture: ComponentFixture<IrcShortcutDialogComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IrcShortcutDialogComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IrcShortcutDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
