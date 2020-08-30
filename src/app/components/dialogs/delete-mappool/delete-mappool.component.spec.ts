import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMappoolComponent } from './delete-mappool.component';

describe('DeleteMappoolComponent', () => {
	let component: DeleteMappoolComponent;
	let fixture: ComponentFixture<DeleteMappoolComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeleteMappoolComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeleteMappoolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
