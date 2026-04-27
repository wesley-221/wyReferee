import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportTournamentComponent } from './import-tournament.component';

describe('ImportTournamentComponent', () => {
	let component: ImportTournamentComponent;
	let fixture: ComponentFixture<ImportTournamentComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ImportTournamentComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ImportTournamentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
