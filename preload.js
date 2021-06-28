const customTitlebar = require('custom-electron-titlebar');

window.addEventListener('DOMContentLoaded', () => {
	new customTitlebar.Titlebar({
		backgroundColor: customTitlebar.Color.fromHex('#fb9678'),
		menu: false,
		titleHorizontalAlignment: 'left',
		icon: 'assets/images/icon.png'
	});
})
