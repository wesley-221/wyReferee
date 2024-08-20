import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinLobbyComponent } from './join-lobby.component';

describe('JoinLobbyComponent', () => {
	let component: JoinLobbyComponent;
	let fixture: ComponentFixture<JoinLobbyComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [JoinLobbyComponent]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(JoinLobbyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
