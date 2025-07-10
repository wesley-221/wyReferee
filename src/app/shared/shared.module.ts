import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'app/shared/angular-material.module';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from 'ngx-clipboard';
import { FilterTournamentPipe } from './pipes/filter-tournament.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { SearchModBracketPipe } from './pipes/search-mod-bracket.pipe';
import { SearchPipe } from './pipes/search.pipe';
import { DebugComponent } from './components/debug/debug.component';
import { AlertComponent } from './components/alert/alert.component';
import { NgVarDirective } from './directives/ng-var.directive';
import { FilterTeamPipe } from './pipes/filter-team.pipe';
import { ClickableLinksDirective } from 'app/core/directive/clickable-links.directive';
import { ToastComponent } from './components/toast/toast.component';
import { TutorialComponent } from './components/tutorial/tutorial.component';
import { MarkdownModule } from 'ngx-markdown';

const declerations = [
	FilterTournamentPipe,
	ReversePipe,
	SearchModBracketPipe,
	SearchPipe,
	DebugComponent,
	DebugComponent,
	AlertComponent,
	NgVarDirective,
	FilterTeamPipe,
	ClickableLinksDirective,
	ToastComponent,
	TutorialComponent
];

const modules = [
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	AngularMaterialModule,
	RouterModule,
	DragDropModule,
	ClipboardModule,
	MarkdownModule
];

@NgModule({
	declarations: [declerations],
	imports: [...modules],
	exports: [...modules, ...declerations]
})
export class SharedModule { }
