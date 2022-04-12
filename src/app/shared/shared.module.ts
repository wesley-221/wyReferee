import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'app/shared/angular-material.module';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from 'ngx-clipboard';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';
import { FilterTournamentPipe } from './pipes/filter-tournament.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { SearchModBracketPipe } from './pipes/search-mod-bracket.pipe';
import { SearchPipe } from './pipes/search.pipe';

const declerations = [
	FilterTournamentPipe,
	ReversePipe,
	SearchModBracketPipe,
	SearchPipe
];

const modules = [
	CommonModule,
	FormsModule,
	ReactiveFormsModule,
	AngularMaterialModule,
	RouterModule,
	DragDropModule,
	VirtualScrollerModule,
	ClipboardModule
];

@NgModule({
	declarations: [declerations],
	imports: [modules],
	exports: [...modules, ...declerations]
})
export class SharedModule { }
