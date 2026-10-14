import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveIrcChannelDialogComponent } from './archive-irc-channel-dialog.component';

describe('ArchiveIrcChannelDialogComponent', () => {
	let component: ArchiveIrcChannelDialogComponent;
	let fixture: ComponentFixture<ArchiveIrcChannelDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ArchiveIrcChannelDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ArchiveIrcChannelDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
