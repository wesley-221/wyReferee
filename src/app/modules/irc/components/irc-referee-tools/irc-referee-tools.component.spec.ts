import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcRefereeToolsComponent } from './irc-referee-tools.component';

describe('IrcRefereeToolsComponent', () => {
	let component: IrcRefereeToolsComponent;
	let fixture: ComponentFixture<IrcRefereeToolsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcRefereeToolsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcRefereeToolsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
