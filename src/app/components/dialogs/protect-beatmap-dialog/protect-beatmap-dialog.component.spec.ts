import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProtectBeatmapDialogComponent } from './protect-beatmap-dialog.component';

describe('ProtectBeatmapDialogComponent', () => {
	let component: ProtectBeatmapDialogComponent;
	let fixture: ComponentFixture<ProtectBeatmapDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ProtectBeatmapDialogComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(ProtectBeatmapDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
