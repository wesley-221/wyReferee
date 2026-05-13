import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcMatchSettingsGeneralComponent } from './irc-match-settings-general.component';

describe('IrcMatchSettingsGeneralComponent', () => {
	let component: IrcMatchSettingsGeneralComponent;
	let fixture: ComponentFixture<IrcMatchSettingsGeneralComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcMatchSettingsGeneralComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcMatchSettingsGeneralComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
