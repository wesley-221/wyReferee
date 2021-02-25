import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AxsFormulaComponent } from './axs-formula.component';

describe('AxsFormulaComponent', () => {
	let component: AxsFormulaComponent;
	let fixture: ComponentFixture<AxsFormulaComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AxsFormulaComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AxsFormulaComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
