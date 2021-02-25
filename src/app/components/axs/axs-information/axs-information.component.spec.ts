import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AxsInformationComponent } from './axs-information.component';

describe('AxsInformationComponent', () => {
	let component: AxsInformationComponent;
	let fixture: ComponentFixture<AxsInformationComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AxsInformationComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AxsInformationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
