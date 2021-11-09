import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamenStagesComponent } from './tournament-stages.component';

describe('TournamenStagesComponent', () => {
	let component: TournamenStagesComponent;
	let fixture: ComponentFixture<TournamenStagesComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamenStagesComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamenStagesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
