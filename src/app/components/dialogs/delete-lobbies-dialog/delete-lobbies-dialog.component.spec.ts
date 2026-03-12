import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLobbiesDialogComponent } from './delete-lobbies-dialog.component';

describe('DeleteLobbiesDialogComponent', () => {
	let component: DeleteLobbiesDialogComponent;
	let fixture: ComponentFixture<DeleteLobbiesDialogComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DeleteLobbiesDialogComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(DeleteLobbiesDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
