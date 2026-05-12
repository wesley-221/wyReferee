import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcChatContainerComponent } from './irc-chat-container.component';

describe('IrcChatContainerComponent', () => {
	let component: IrcChatContainerComponent;
	let fixture: ComponentFixture<IrcChatContainerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcChatContainerComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcChatContainerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
