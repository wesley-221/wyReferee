import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPublishedMappoolsComponent } from './my-published-mappools.component';

describe('MyPublishedMappoolsComponent', () => {
	let component: MyPublishedMappoolsComponent;
	let fixture: ComponentFixture<MyPublishedMappoolsComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [MyPublishedMappoolsComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MyPublishedMappoolsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
