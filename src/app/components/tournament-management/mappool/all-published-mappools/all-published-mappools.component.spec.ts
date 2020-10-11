import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPublishedMappoolsComponent } from './all-published-mappools.component';

describe('AllPublishedMappoolsComponent', () => {
	let component: AllPublishedMappoolsComponent;
	let fixture: ComponentFixture<AllPublishedMappoolsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AllPublishedMappoolsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AllPublishedMappoolsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
