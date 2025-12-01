import { NgModule } from '@angular/core';

import { LayoutModule } from '@angular/cdk/layout';

import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DomSanitizer } from '@angular/platform-browser';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';

const modules: any[] = [
	LayoutModule,
	MatIconModule,
	MatToolbarModule,
	MatButtonModule,
	MatMenuModule,
	MatFormFieldModule,
	MatInputModule,
	MatGridListModule,
	MatDividerModule,
	MatSelectModule,
	MatChipsModule,
	MatTabsModule,
	MatDialogModule,
	MatSliderModule,
	MatProgressSpinnerModule,
	MatTooltipModule,
	MatExpansionModule,
	MatSidenavModule,
	MatListModule,
	MatSlideToggleModule,
	MatStepperModule,
	MatButtonToggleModule,
	MatProgressBarModule,
	MatAutocompleteModule,
	MatPaginatorModule,
	ScrollingModule,
	MatCheckboxModule,
	MatRadioModule
];

@NgModule({
	imports: [...modules],
	exports: [...modules]
})
export class AngularMaterialModule {
	constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
		this.matIconRegistry
			.addSvgIcon('trophy', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/trophy.svg'))
			.addSvgIcon('hammer', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/hammer.svg'))
			.addSvgIcon('info-circle', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/info-circle.svg'))
			.addSvgIcon('exclamation-circle', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/exclamation-circle.svg'))
			.addSvgIcon('exclamation-triangle', this.domSanitizer.bypassSecurityTrustResourceUrl('assets/icons/exclamation-triangle.svg'));
	}
}
