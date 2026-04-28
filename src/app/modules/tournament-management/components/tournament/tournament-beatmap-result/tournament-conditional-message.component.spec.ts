import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentConditionalMessageComponent } from './tournament-conditional-message.component';

describe('TournamentConditionalMessageComponent', () => {
	let component: TournamentConditionalMessageComponent;
	let fixture: ComponentFixture<TournamentConditionalMessageComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TournamentConditionalMessageComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentConditionalMessageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
