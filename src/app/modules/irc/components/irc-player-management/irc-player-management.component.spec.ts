import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcPlayerManagementComponent } from './irc-player-management.component';

describe('IrcPlayerManagementComponent', () => {
	let component: IrcPlayerManagementComponent;
	let fixture: ComponentFixture<IrcPlayerManagementComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [IrcPlayerManagementComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(IrcPlayerManagementComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
