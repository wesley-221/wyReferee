import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IrcSidebarLayoutEditorComponent } from './irc-sidebar-layout-editor.component';

describe('IrcSidebarLayoutEditorComponent', () => {
	let component: IrcSidebarLayoutEditorComponent;
	let fixture: ComponentFixture<IrcSidebarLayoutEditorComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [IrcSidebarLayoutEditorComponent]
		})
			.compileComponents();

		fixture = TestBed.createComponent(IrcSidebarLayoutEditorComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
