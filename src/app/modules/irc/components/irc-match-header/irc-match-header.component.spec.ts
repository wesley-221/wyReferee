import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcMatchHeaderComponent } from './irc-match-header.component';

describe('IrcMatchHeaderComponent', () => {
	let component: IrcMatchHeaderComponent;
	let fixture: ComponentFixture<IrcMatchHeaderComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcMatchHeaderComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcMatchHeaderComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
