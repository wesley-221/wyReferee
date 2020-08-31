import { Component, OnInit, ViewChild } from '@angular/core';
import { ElectronService } from '../../../services/electron.service';

@Component({
	selector: 'app-titlebar',
	templateUrl: './titlebar.component.html',
	styleUrls: ['./titlebar.component.scss']
})

export class TitlebarComponent implements OnInit {
	isMinimized: boolean;

	constructor(private electronService: ElectronService) {
		this.isMinimized = this.electronService.remote.getCurrentWindow().isMinimized();

		this.electronService.remote.getCurrentWindow().on('move', () => {
			this.isMinimized = true;
		})
	}

	ngOnInit() { }

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
			this.isMinimized = true;
		}
		else {
			this.electronService.remote.getCurrentWindow().maximize();
			this.isMinimized = false;
		}
	}

	/**
	 * Close the app
	 */
	closeWindow(): void {
		this.electronService.remote.app.quit();
	}
}
