import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TutorialService } from 'app/services/tutorial.service';
import { MarkdownService } from 'ngx-markdown';

@Component({
	selector: 'app-tutorial',
	templateUrl: './tutorial.component.html',
	styleUrls: ['./tutorial.component.scss']
})
export class TutorialComponent implements OnInit {
	currentStepContent: string;

	constructor(public tutorialService: TutorialService, public markdown: MarkdownService, private router: Router) { }

	ngOnInit(): void { }

	/**
	 * Minimize the tutorial
	 */
	minimizeTutorial(): void {
		this.tutorialService.isMinimized = !this.tutorialService.isMinimized;
	}

	/**
	 * Close the tutorial
	 */
	closeTutorial(): void {
		this.clearCurrentStepStyling();

		this.tutorialService.setCurrentTutorial(null);
	}

	/**
	 * Listens to when the page gets changed
	 *
	 * @param event the index of the new page
	 */
	onPageChange(event: any) {
		this.clearCurrentStepStyling();
		this.tutorialService.goToPage(event.pageIndex);
		this.addCurrentStepStyling();
	}

	/**
	 * Clears the styling from the current step
	 */
	private clearCurrentStepStyling() {
		if (this.tutorialService.currentStep.route) {
			this.router.navigate([this.tutorialService.currentStep.route]);
		}

		this.tutorialService.currentStep.targetElementIds.forEach(target => {
			const targetElement = document.getElementById(target);

			if (targetElement != null) {
				targetElement.classList.remove('tutorial-highlight');
			}
		});
	}

	/**
	 * Adds the styling of the current step with a slight delay
	 */
	private addCurrentStepStyling() {
		if (this.tutorialService.currentStep.route) {
			this.router.navigate([this.tutorialService.currentStep.route]);
		}

		setTimeout(() => {
			this.tutorialService.currentStep.targetElementIds.forEach(target => {
				const targetElement = document.getElementById(target);

				if (targetElement != null) {
					targetElement.classList.add('tutorial-highlight');
				}
			});
		}, 5);
	}
}
