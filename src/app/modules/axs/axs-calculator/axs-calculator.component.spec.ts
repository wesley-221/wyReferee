import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AxsCalculatorComponent } from './axs-calculator.component';

describe('AxsCalculatorComponent', () => {
	let component: AxsCalculatorComponent;
	let fixture: ComponentFixture<AxsCalculatorComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AxsCalculatorComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AxsCalculatorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
