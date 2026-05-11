import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentWebhookComponent } from './tournament-webhook.component';

describe('TournamentWebhookComponent', () => {
	let component: TournamentWebhookComponent;
	let fixture: ComponentFixture<TournamentWebhookComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TournamentWebhookComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentWebhookComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
