import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappoolCreateComponent } from './mappool-create.component';

describe('MappoolCreateComponent', () => {
	let component: MappoolCreateComponent;
	let fixture: ComponentFixture<MappoolCreateComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MappoolCreateComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MappoolCreateComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
