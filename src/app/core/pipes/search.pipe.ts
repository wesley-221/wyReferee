import { Pipe, PipeTransform } from '@angular/core';
import { User } from 'app/models/authentication/user';

@Pipe({
	name: 'search'
})

export class SearchPipe implements PipeTransform {
	transform(allUsers: User[], username: string): any {
		if (username == '' || username == undefined) {
			return allUsers;
		}

		let returnUsers: User[] = [];

		returnUsers = allUsers.filter(user => {
			return user.username.toLowerCase().indexOf(username.toLowerCase()) > -1;
		});

		return returnUsers;
	}
}
