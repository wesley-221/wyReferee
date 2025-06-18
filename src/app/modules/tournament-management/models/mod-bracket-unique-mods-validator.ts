import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

export function modBracketUniqueModsValidator(): ValidatorFn {
	return (form: AbstractControl): ValidationErrors | null => {
		if (!form || typeof form !== 'object' || !('controls' in form)) {
			return null;
		}

		const controls = (form as any).controls;
		const bracketMap = new Map<string, { key: string; value: string }[]>();
		const duplicateKeys: string[] = [];

		for (const key of Object.keys(controls)) {
			const match = key.match(/^(mappool-\d+-mod-bracket-\d+)-mod-\d+-value$/);

			if (match) {
				const bracketKey = match[1];
				const rawValue = controls[key].value;
				const value = rawValue !== null && rawValue !== undefined ? String(rawValue).trim() : '';

				if (!value) {
					continue;
				}

				if (!bracketMap.has(bracketKey)) {
					bracketMap.set(bracketKey, []);
				}

				bracketMap.get(bracketKey).push({ key, value });
			}
		}

		for (const [, entries] of bracketMap.entries()) {
			const valueMap = new Map<string, string[]>();

			for (const { key, value } of entries) {
				if (!valueMap.has(value)) {
					valueMap.set(value, []);
				}

				valueMap.get(value).push(key);
			}

			for (const keys of valueMap.values()) {
				if (keys.length > 1) {
					duplicateKeys.push(...keys.map(k => `${k}-not-unique`));
				}
			}
		}

		if (duplicateKeys.length > 0) {
			return {
				nonUniqueModBracketValues: duplicateKeys
			};
		}

		return null;
	};
}
