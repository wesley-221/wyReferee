import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentWybinComponent } from './tournament-wybin.component';

describe('TournamentWybinComponent', () => {
	let component: TournamentWybinComponent;
	let fixture: ComponentFixture<TournamentWybinComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TournamentWybinComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TournamentWybinComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
