import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BanBeatmapComponent } from './ban-beatmap.component';

describe('BanBeatmapComponent', () => {
	let component: BanBeatmapComponent;
	let fixture: ComponentFixture<BanBeatmapComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BanBeatmapComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(BanBeatmapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
