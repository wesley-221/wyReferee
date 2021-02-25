import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AxsRouterComponent } from './axs-router.component';

describe('AxsRouterComponent', () => {
	let component: AxsRouterComponent;
	let fixture: ComponentFixture<AxsRouterComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AxsRouterComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AxsRouterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
