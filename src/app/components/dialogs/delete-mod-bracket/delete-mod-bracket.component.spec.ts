import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteModBracketComponent } from './delete-mod-bracket.component';

describe('DeleteModBracketComponent', () => {
	let component: DeleteModBracketComponent;
	let fixture: ComponentFixture<DeleteModBracketComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DeleteModBracketComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DeleteModBracketComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
