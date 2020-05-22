import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MappoolEditComponent } from './mappool-edit.component';

describe('MappoolEditComponent', () => {
	let component: MappoolEditComponent;
	let fixture: ComponentFixture<MappoolEditComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MappoolEditComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MappoolEditComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
