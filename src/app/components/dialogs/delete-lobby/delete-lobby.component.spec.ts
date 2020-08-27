import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLobbyComponent } from './delete-lobby.component';

describe('DeleteLobbyComponent', () => {
	let component: DeleteLobbyComponent;
	let fixture: ComponentFixture<DeleteLobbyComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeleteLobbyComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeleteLobbyComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
