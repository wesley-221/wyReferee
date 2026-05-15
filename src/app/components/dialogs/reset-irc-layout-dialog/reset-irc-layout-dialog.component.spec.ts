import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetIrcLayoutDialogComponent } from './reset-irc-layout-dialog.component';

describe('ResetIrcLayoutDialogComponent', () => {
	let component: ResetIrcLayoutDialogComponent;
	let fixture: ComponentFixture<ResetIrcLayoutDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ResetIrcLayoutDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ResetIrcLayoutDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
