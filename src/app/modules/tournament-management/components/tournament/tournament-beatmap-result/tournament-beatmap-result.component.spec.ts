import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentBeatmapResultComponent } from './tournament-beatmap-result.component';

describe('TournamentBeatmapResultComponent', () => {
	let component: TournamentBeatmapResultComponent;
	let fixture: ComponentFixture<TournamentBeatmapResultComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TournamentBeatmapResultComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentBeatmapResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
