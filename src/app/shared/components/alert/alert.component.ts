import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-alert',
	templateUrl: './alert.component.html',
	styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {
	@Input() alertType: string;
	@Input() noMarginTop: boolean;
	@Input() noMarginBottom: boolean;
	@Input() noMargin: boolean;

	constructor() { }
	ngOnInit(): void { }
}
