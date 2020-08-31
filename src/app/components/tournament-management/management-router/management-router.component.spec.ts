import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementRouterComponent } from './management-router.component';

describe('ManagementRouterComponent', () => {
	let component: ManagementRouterComponent;
	let fixture: ComponentFixture<ManagementRouterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ManagementRouterComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ManagementRouterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
