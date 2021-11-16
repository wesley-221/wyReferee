import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcPickMapSameModBracketComponent } from './irc-pick-map-same-mod-bracket.component';

describe('IrcPickMapSameModBracketComponent', () => {
	let component: IrcPickMapSameModBracketComponent;
	let fixture: ComponentFixture<IrcPickMapSameModBracketComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [IrcPickMapSameModBracketComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(IrcPickMapSameModBracketComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
