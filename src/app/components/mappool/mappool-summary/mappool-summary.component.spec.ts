import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappoolSummaryComponent } from './mappool-summary.component';

describe('MappoolComponent', () => {
	let component: MappoolSummaryComponent;
	let fixture: ComponentFixture<MappoolSummaryComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MappoolSummaryComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MappoolSummaryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
