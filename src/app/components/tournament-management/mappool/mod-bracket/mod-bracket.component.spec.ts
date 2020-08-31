import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModBracketComponent } from './mod-bracket.component';

describe('ModBracketComponent', () => {
	let component: ModBracketComponent;
	let fixture: ComponentFixture<ModBracketComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [ModBracketComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ModBracketComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
