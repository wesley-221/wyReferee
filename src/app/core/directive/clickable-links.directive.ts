import { Directive, HostListener } from '@angular/core';
import { ElectronService } from 'app/services/electron.service';

@Directive({
	selector: '[clickableLinks]'
})
export class ClickableLinksDirective {
	constructor(private electronService: ElectronService) { }

	@HostListener('click', ['$event'])
	onClick($event: MouseEvent) {
		const target = $event.target as any;

		switch ($event.target.constructor) {
			case HTMLAnchorElement:
				$event.preventDefault();
				this.electronService.openLink((target as HTMLAnchorElement).href);
				break;
		}
	}
}
