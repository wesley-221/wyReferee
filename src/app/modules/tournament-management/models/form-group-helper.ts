import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { WyModCategory } from "../../../models/wytournament/mappool/wy-mod-category";
import { WyMod } from "../../../models/wytournament/mappool/wy-mod";
import { WyModBracketMap } from "../../../models/wytournament/mappool/wy-mod-bracket-map";
import { WyModBracket } from "../../../models/wytournament/mappool/wy-mod-bracket";
import { WyMappool, MappoolType } from "../../../models/wytournament/mappool/wy-mappool";

export class FormGroupHelper {
	static createModCategoryFormGroup(category?: WyModCategory): FormGroup {
		return new FormGroup({
			id: new FormControl(category?.id ?? null),
			name: new FormControl(category?.name ?? '', Validators.required)
		});
	}

	static createModFormGroup(mod?: WyMod): FormGroup {
		const value = mod?.name == 'Freemod' ? mod?.value : Number(mod?.value);

		return new FormGroup({
			id: new FormControl(mod?.id ?? null),
			value: new FormControl(value ?? null, Validators.required)
		});
	}

	static createBeatmapFormGroup(beatmap?: WyModBracketMap): FormGroup {
		return new FormGroup({
			id: new FormControl(beatmap?.id ?? null),
			invalid: new FormControl(beatmap?.invalid ?? false),
			beatmapId: new FormControl(beatmap?.beatmapId ?? null, Validators.required),
			beatmapsetId: new FormControl(beatmap?.beatmapsetId ?? null, Validators.required),
			beatmapName: new FormControl(beatmap?.beatmapName ?? null, Validators.required),
			beatmapUrl: new FormControl(beatmap?.beatmapUrl ?? null, Validators.required),
			modifier: new FormControl(beatmap?.modifier ?? null),
			damageAmount: new FormControl(beatmap?.damageAmount ?? null),
			modCategory: new FormControl(beatmap?.modCategory ?? null),
			gamemodeId: new FormControl(beatmap?.gamemodeId ?? null),
			reverseScore: new FormControl(beatmap?.reverseScore ?? false),
			picked: new FormControl(beatmap?.picked ?? false),
			isSynchronizing: new FormControl(beatmap?.isSynchronizing ?? false)
		});
	}

	static createModBracketFormGroup(modBracket?: WyModBracket): FormGroup {
		const modsFormArray = new FormArray(
			(modBracket?.mods ?? []).map(mod => FormGroupHelper.createModFormGroup(mod))
		);

		const beatmapsFormArray = new FormArray(
			(modBracket?.beatmaps ?? []).map(beatmap => FormGroupHelper.createBeatmapFormGroup(beatmap))
		);

		return new FormGroup({
			id: new FormControl(modBracket?.id ?? null),
			name: new FormControl(modBracket?.name ?? '', Validators.required),
			acronym: new FormControl(modBracket?.acronym ?? '', Validators.required),
			mods: modsFormArray,
			beatmaps: beatmapsFormArray
		});
	}

	static createMappoolFormGroup(mappool?: WyMappool): FormGroup {
		const modBracketsFormArray = new FormArray(
			(mappool?.modBrackets ?? []).map(modBracket => FormGroupHelper.createModBracketFormGroup(modBracket))
		);

		const modCategoriesFormArray = new FormArray(
			(mappool?.modCategories ?? []).map(modCategory => FormGroupHelper.createModCategoryFormGroup(modCategory))
		);

		return new FormGroup({
			id: new FormControl(mappool?.id ?? null),
			name: new FormControl(mappool?.name ?? '', Validators.required),
			type: new FormControl(mappool?.type ?? MappoolType.Normal, Validators.required),
			gamemodeId: new FormControl(mappool?.gamemodeId ?? null),
			modBrackets: modBracketsFormArray,
			modCategories: modCategoriesFormArray
		});
	}
}
