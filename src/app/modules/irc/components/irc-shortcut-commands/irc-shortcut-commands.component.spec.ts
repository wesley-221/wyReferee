import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcShortcutCommandsComponent } from './irc-shortcut-commands.component';

describe('IrcShortcutCommandsComponent', () => {
	let component: IrcShortcutCommandsComponent;
	let fixture: ComponentFixture<IrcShortcutCommandsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IrcShortcutCommandsComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(IrcShortcutCommandsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
