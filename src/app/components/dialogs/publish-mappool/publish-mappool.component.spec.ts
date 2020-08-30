import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishMappoolComponent } from './publish-mappool.component';

describe('PublishMappoolComponent', () => {
	let component: PublishMappoolComponent;
	let fixture: ComponentFixture<PublishMappoolComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PublishMappoolComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PublishMappoolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
