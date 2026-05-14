import { Component, Input } from '@angular/core';
import { IrcLayoutService } from '../../../../services/irc-layout.service';
import { map } from 'rxjs';
import { IrcLayoutSection } from '../../../../models/irc-layout-section';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
	selector: 'app-irc-sidebar-layout-editor',
	templateUrl: './irc-sidebar-layout-editor.component.html',
	styleUrl: './irc-sidebar-layout-editor.component.scss'
})
export class IrcSidebarLayoutEditorComponent {
	@Input() sidebar: 'left' | 'right';

	sidebarSections = this.ircLayoutService.sidebarSections$
		.pipe(
			map(sections => sections.filter(section => section.sidebar === this.sidebar)),
			map(sections => sections.sort((a, b) => a.order - b.order))
		);

	constructor(
		private ircLayoutService: IrcLayoutService
	) { }

	drop(event: CdkDragDrop<IrcLayoutSection[]>) {
		this.ircLayoutService.createSection(this.ircLayoutService.availableId++, 10, this.sidebar, event.item.data.type);
	}

	reorderSidebar(event: CdkDragDrop<IrcLayoutSection[]>) {
		this.ircLayoutService.reorderSections(this.sidebar, event.previousIndex, event.currentIndex);
	}

	getLayoutBySection(section: IrcLayoutSection) {
		return this.ircLayoutService.getLayoutByView(section.view);
	}

	deleteSection(section: IrcLayoutSection) {
		this.ircLayoutService.deleteSection(section.id);
	}
}
