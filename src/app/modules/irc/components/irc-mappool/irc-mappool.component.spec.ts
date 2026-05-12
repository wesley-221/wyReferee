import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcMappoolComponent } from './irc-mappool.component';

describe('IrcMappoolComponent', () => {
	let component: IrcMappoolComponent;
	let fixture: ComponentFixture<IrcMappoolComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcMappoolComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcMappoolComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
