import { promises as fs } from 'fs';
import * as path from 'path';
import { app } from 'electron';

export class ConditionalToTriggerService {
	async migrate(): Promise<void> {
		const tournamentsPath = path.join(app.getPath('userData'), 'data', 'tournaments');

		let files: string[];

		try {
			files = await fs.readdir(tournamentsPath);
		} catch (err) {
			console.error('Error reading tournaments directory:', err);
			return;
		}

		for (const file of files) {
			if (!file.endsWith('.json')) {
				continue;
			}

			const filePath = path.join(tournamentsPath, file);

			try {
				const data = await fs.readFile(filePath, 'utf-8');
				const tournament = JSON.parse(data);

				if (tournament.triggerMessages) {
					continue;
				}

				tournament.triggerMessages = tournament.conditionalMessages ?? [];
				delete tournament.conditionalMessages;

				await fs.writeFile(filePath, JSON.stringify(tournament, null, 2), 'utf-8');

				console.log(`Migrated: ${filePath}`);
			} catch (err) {
				console.error(`Error processing file ${filePath}:`, err);
			}
		}
	}
}
