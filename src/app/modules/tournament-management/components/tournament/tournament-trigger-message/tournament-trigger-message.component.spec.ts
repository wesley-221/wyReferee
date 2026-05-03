import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentTriggerMessageComponent } from './tournament-trigger-message.component';

describe('TournamentTriggerMessageComponent', () => {
	let component: TournamentTriggerMessageComponent;
	let fixture: ComponentFixture<TournamentTriggerMessageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TournamentTriggerMessageComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentTriggerMessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
