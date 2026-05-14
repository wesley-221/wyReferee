import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcLayoutLibraryComponent } from './irc-layout-library.component';

describe('IrcLayoutLibraryComponent', () => {
	let component: IrcLayoutLibraryComponent;
	let fixture: ComponentFixture<IrcLayoutLibraryComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcLayoutLibraryComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcLayoutLibraryComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
