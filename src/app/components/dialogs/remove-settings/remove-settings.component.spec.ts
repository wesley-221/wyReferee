import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSettingsComponent } from './remove-settings.component';

describe('RemoveSettingsComponent', () => {
	let component: RemoveSettingsComponent;
	let fixture: ComponentFixture<RemoveSettingsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [RemoveSettingsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RemoveSettingsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
