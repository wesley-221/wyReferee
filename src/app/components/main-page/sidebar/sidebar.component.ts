import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../../services/authenticate.service';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
	constructor(public authService: AuthenticateService, private toastService: ToastService) { }
	ngOnInit() { }
}
