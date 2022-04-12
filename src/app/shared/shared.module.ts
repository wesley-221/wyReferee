import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularMaterialModule } from 'app/angular-material-module';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ClipboardModule } from 'ngx-clipboard';
import { VirtualScrollerModule } from 'ngx-virtual-scroller';



@NgModule({
	declarations: [],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AngularMaterialModule,
		RouterModule,
		DragDropModule,
		VirtualScrollerModule,
		ClipboardModule
	],
	exports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AngularMaterialModule,
		RouterModule,
		DragDropModule,
		VirtualScrollerModule,
		ClipboardModule
	]
})
export class SharedModule { }
