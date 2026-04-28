import { UpdateAvailableInfo } from "../../shared/electron-api";

export interface INewUpdateDialogData {
	info: UpdateAvailableInfo;
	currentVersion: string;
}
