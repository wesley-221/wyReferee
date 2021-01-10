import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SendBeatmapResultComponent } from './send-beatmap-result.component';

describe('SendBeatmapResultComponent', () => {
	let component: SendBeatmapResultComponent;
	let fixture: ComponentFixture<SendBeatmapResultComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [SendBeatmapResultComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SendBeatmapResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
