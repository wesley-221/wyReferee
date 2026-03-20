import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WybinScheduleComponent } from './wybin-schedule.component';

describe('WybinScheduleComponent', () => {
	let component: WybinScheduleComponent;
	let fixture: ComponentFixture<WybinScheduleComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [WybinScheduleComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(WybinScheduleComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
