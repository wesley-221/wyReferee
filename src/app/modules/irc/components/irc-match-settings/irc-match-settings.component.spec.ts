import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcMatchSettingsComponent } from './irc-match-settings.component';

describe('IrcMatchSettingsComponent', () => {
	let component: IrcMatchSettingsComponent;
	let fixture: ComponentFixture<IrcMatchSettingsComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcMatchSettingsComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcMatchSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
