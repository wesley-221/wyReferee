import { BrowserContext, ElectronApplication, Page, _electron as electron } from 'playwright';
import { test, expect } from '@playwright/test';
const PATH = require('path');

test.describe('Check Home Page', async () => {
	let app: ElectronApplication;
	let firstWindow: Page;
	let context: BrowserContext;

	test.beforeAll(async () => {
		app = await electron.launch({ args: [PATH.join(__dirname, '../main.js'), PATH.join(__dirname, '../package.json')] });
		context = app.context();
		await context.tracing.start({ screenshots: true, snapshots: true });
		firstWindow = await app.firstWindow();
		await firstWindow.waitForLoadState('domcontentloaded');
	});

	test('Launch electron app', async () => {

		const windowState: { isVisible: boolean; isDevToolsOpened: boolean; isCrashed: boolean } = await app.evaluate(async (process) => {
			const mainWindow = process.BrowserWindow.getAllWindows()[0];

			const getState = () => ({
				isVisible: mainWindow.isVisible(),
				isDevToolsOpened: mainWindow.webContents.isDevToolsOpened(),
				isCrashed: mainWindow.webContents.isCrashed(),
			});

			return new Promise((resolve) => {
				if (mainWindow.isVisible()) {
					resolve(getState());
				} else {
					mainWindow.once('ready-to-show', () => setTimeout(() => resolve(getState()), 0));
				}
			});
		});

		expect(windowState.isVisible).toBeTruthy();
		expect(windowState.isDevToolsOpened).toBeFalsy();
		expect(windowState.isCrashed).toBeFalsy();
	});

	test.afterAll(async () => {
		await context.tracing.stop({ path: 'e2e/tracing/trace.zip' });
		await app.close();
	});
});
