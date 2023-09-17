import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TutorialCategory } from 'app/models/tutorial/tutorial-category';
import { ElectronService } from 'app/services/electron.service';
import { TutorialService } from 'app/services/tutorial.service';

@Component({
	selector: 'app-tutorial-overview',
	templateUrl: './tutorial-overview.component.html',
	styleUrls: ['./tutorial-overview.component.scss']
})
export class TutorialOverviewComponent implements OnInit {
	constructor(public tutorialService: TutorialService, public electronService: ElectronService, private router: Router) { }
	ngOnInit(): void { }

	/**
	 * Start a tutorial
	 *
	 * @param tutorial the selected tutorial
	 */
	selectTutorial(tutorial: TutorialCategory) {
		this.tutorialService.setCurrentTutorial(tutorial);

		if (this.tutorialService.currentStep && this.tutorialService.currentStep.route) {
			this.router.navigate([this.tutorialService.currentStep.route]);
		}
	}
}
