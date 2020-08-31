import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinIrcChannelComponent } from './join-irc-channel.component';

describe('JoinIrcChannelComponent', () => {
	let component: JoinIrcChannelComponent;
	let fixture: ComponentFixture<JoinIrcChannelComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [JoinIrcChannelComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(JoinIrcChannelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
