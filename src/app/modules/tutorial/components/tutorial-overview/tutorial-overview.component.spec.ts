import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialOverviewComponent } from './tutorial-overview.component';

describe('TutorialOverviewComponent', () => {
	let component: TutorialOverviewComponent;
	let fixture: ComponentFixture<TutorialOverviewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TutorialOverviewComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TutorialOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
