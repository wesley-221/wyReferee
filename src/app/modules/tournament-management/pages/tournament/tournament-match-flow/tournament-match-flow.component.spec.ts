import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentMatchFlowComponent } from './tournament-match-flow.component';

describe('TournamentMatchFlowComponent', () => {
	let component: TournamentMatchFlowComponent;
	let fixture: ComponentFixture<TournamentMatchFlowComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [TournamentMatchFlowComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(TournamentMatchFlowComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
