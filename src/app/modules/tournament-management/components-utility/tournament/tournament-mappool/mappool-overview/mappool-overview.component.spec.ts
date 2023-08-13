import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappoolOverviewComponent } from './mappool-overview.component';

describe('MappoolOverviewComponent', () => {
	let component: MappoolOverviewComponent;
	let fixture: ComponentFixture<MappoolOverviewComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MappoolOverviewComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MappoolOverviewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
