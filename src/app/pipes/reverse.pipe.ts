import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'reverse'
})
export class ReversePipe implements PipeTransform {
	transform(value: any) {
		return value.slice().reverse();
	}
}
