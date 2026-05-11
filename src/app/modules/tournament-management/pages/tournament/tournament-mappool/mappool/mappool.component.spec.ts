import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappoolComponent } from './mappool.component';

describe('MappoolComponent', () => {
	let component: MappoolComponent;
	let fixture: ComponentFixture<MappoolComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MappoolComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MappoolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
