import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcChatControlsComponent } from './irc-chat-controls.component';

describe('IrcChatControlsComponent', () => {
	let component: IrcChatControlsComponent;
	let fixture: ComponentFixture<IrcChatControlsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcChatControlsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcChatControlsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
