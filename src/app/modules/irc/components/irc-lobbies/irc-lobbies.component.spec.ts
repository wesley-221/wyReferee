import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcLobbiesComponent } from './irc-lobbies.component';

describe('IrcLobbiesComponent', () => {
	let component: IrcLobbiesComponent;
	let fixture: ComponentFixture<IrcLobbiesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcLobbiesComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcLobbiesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
