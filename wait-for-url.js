const url = process.argv[2] || 'http://localhost:4200';
const interval = 1000;

async function waitForServer() {
	console.log(`Waiting for ${url} to be ready`);

	while (true) {
		try {
			await fetch(url);
			console.log(`${url} is ready`);
			process.exit(0);
		}
		catch {
			await new Promise(r => setTimeout(r, interval));
		}
	}
}

waitForServer();
