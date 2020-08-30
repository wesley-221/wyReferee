import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendFinalResultComponent } from './send-final-result.component';

describe('SendFinalResultComponent', () => {
	let component: SendFinalResultComponent;
	let fixture: ComponentFixture<SendFinalResultComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SendFinalResultComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SendFinalResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
