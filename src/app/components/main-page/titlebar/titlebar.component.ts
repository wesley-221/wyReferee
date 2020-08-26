import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../../../services/electron.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSquare, faClone } from '@fortawesome/free-regular-svg-icons';

@Component({
	selector: 'app-titlebar',
	templateUrl: './titlebar.component.html',
	styleUrls: ['./titlebar.component.scss']
})

export class TitlebarComponent implements OnInit {
	@ViewChild('maximizeButton') maximizeButton: FaIconComponent;

	constructor(private electronService: ElectronService) { }

	ngOnInit() {
		this.electronService.remote.getCurrentWindow().on('maximize', () => {
			this.maximizeButton.icon = faClone;
			this.maximizeButton.render();
		});

		this.electronService.remote.getCurrentWindow().on('unmaximize', () => {
			this.maximizeButton.icon = faSquare;
			this.maximizeButton.render();
		});
	}

	/**
	 * Minimize the window
	 */
	minimizeWindow(): void {
		this.electronService.remote.getCurrentWindow().minimize();
	}

	/**
	 * (Un)maximize the window
	 */
	maximizeWindow(): void {
		if (this.electronService.remote.getCurrentWindow().isMaximized()) {
			this.electronService.remote.getCurrentWindow().unmaximize();
		}
		else {
			this.electronService.remote.getCurrentWindow().maximize();
		}
	}

	/**
	 * Close the app
	 */
	closeWindow(): void {
		this.electronService.remote.app.quit();
	}
}
