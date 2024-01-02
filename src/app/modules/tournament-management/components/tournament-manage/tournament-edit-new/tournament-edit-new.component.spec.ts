import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentEditNewComponent } from './tournament-edit-new.component';

describe('TournamentEditNewComponent', () => {
	let component: TournamentEditNewComponent;
	let fixture: ComponentFixture<TournamentEditNewComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TournamentEditNewComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentEditNewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
