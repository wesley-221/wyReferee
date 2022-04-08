const fs = require('fs');

// Change bancho.js setMap > gamemode type so it doesn't throw an error anymore (hacky solution for now)
// ERROR in node_modules/bancho.js/index.d.ts:367:55 - error TS2694: Namespace '"nodesu"' has no exported member 'Mode'.
const banchoJs = 'node_modules/bancho.js/index.d.ts';
fs.readFile(banchoJs, 'utf8', function (err, data) {
	if (err) {
		return console.log(err);
	}

	const result = data.replace('setMap(map: number|nodesu.Beatmap, gamemode: nodesu.Mode)', 'setMap(map: number|nodesu.Beatmap, gamemode: any)');

	fs.writeFile(banchoJs, result, 'utf8', function (err) {
		if (err)
			return console.log(err);
	});
});
