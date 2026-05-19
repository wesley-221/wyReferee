import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcMatchResultComponent } from './irc-match-result.component';

describe('IrcMatchResultComponent', () => {
	let component: IrcMatchResultComponent;
	let fixture: ComponentFixture<IrcMatchResultComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcMatchResultComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcMatchResultComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
