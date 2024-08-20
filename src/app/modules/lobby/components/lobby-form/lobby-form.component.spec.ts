import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LobbyFormComponent } from './lobby-form.component';

describe('LobbyFormComponent', () => {
	let component: LobbyFormComponent;
	let fixture: ComponentFixture<LobbyFormComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [LobbyFormComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(LobbyFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
