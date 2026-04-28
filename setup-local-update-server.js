#!/usr/bin/env node
// setup-local-update-server.js
// Sets up a local update server for testing electron-updater.
// Usage: node setup-local-update-server.js [--port 8080] [--dist dist]

const fs = require("fs");
const path = require("path");
const { execSync, spawn } = require("child_process");

// Get arguments with simple parsing (e.g. --port 8080)
const args = process.argv.slice(2);
const getArg = (flag, fallback) => {
	const i = args.indexOf(flag);
	return i !== -1 && args[i + 1] ? args[i + 1] : fallback;
};

const PORT = getArg("--port", "8070");
const RELEASE_DIR = getArg("--release", "release");
const SERVER_DIR = "local-update-server";
const DEV_CONFIG = "dev-app-update.yml";

const step = (msg) => console.log(`\n>> ${msg}`);
const ok = (msg) => console.log(`   OK  ${msg}`);
const fail = (msg) => { console.error(`   ERR ${msg}`); process.exit(1); };

function bumpPatch(version) {
	const parts = version.split(".");

	if (parts.length !== 3) {
		fail(`Version '${version}' is not valid semver (x.y.z).`);
	}

	return `${parts[0]}.${parts[1]}.${parseInt(parts[2], 10) + 1}`;
}

function writeVersion(pkgPath, from, to) {
	const raw = fs.readFileSync(pkgPath, "utf8");
	const updated = raw.replace(
		`"version": "${from}"`,
		`"version": "${to}"`
	);

	if (raw === updated) {
		fail(`Could not find "version": "${from}" in package.json.`);
	}

	fs.writeFileSync(pkgPath, updated);
}

// Check whether all the required files exist
step("Checking prerequisites...");

const packagePath = path.resolve("package.json");

if (!fs.existsSync(packagePath)) {
	fail("package.json not found. Run this script from your project root.");
}

const pkg = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const currentVersion = pkg.version;

if (!currentVersion) {
	fail("Could not read version from package.json.");
}

ok(`Current app version: ${currentVersion}`);

// Update the version in package.json to trigger electron-updater's update logic
step("Bumping version for the update build...");

const newVersion = bumpPatch(currentVersion);
console.log(`   ${currentVersion}  -->  ${newVersion}`);

writeVersion(packagePath, currentVersion, newVersion);
ok(`package.json updated to ${newVersion}.`);

// Build the app with the updated package.json version
step("Building app with electron-builder (Windows)...");

try {
	execSync("npx electron-builder build --win", { stdio: "inherit" });
} catch (err) {
	writeVersion(packagePath, newVersion, currentVersion);
	fail(`Build failed. Version rolled back to ${currentVersion}.`);
}

ok("Build complete.");

// Reset package.json version back to original
step(`Rolling package.json version back to ${currentVersion}...`);
writeVersion(packagePath, newVersion, currentVersion);
ok(`package.json restored to ${currentVersion}.`);

// Copy the build artifacts to the local update server directory
step(`Copying build artifacts to ./${SERVER_DIR}...`);

if (!fs.existsSync(RELEASE_DIR)) {
	fail(`Dist directory '${RELEASE_DIR}' not found. Check your electron-builder output path.`);
}

const artifacts = fs.readdirSync(RELEASE_DIR).filter(f =>
	[".exe", ".yml", ".blockmap"].includes(path.extname(f))
);

if (artifacts.length === 0) {
	fail(`No artifacts (.exe / .yml / .blockmap) found in '${RELEASE_DIR}'.`);
}

if (!fs.existsSync(SERVER_DIR)) {
	fs.mkdirSync(SERVER_DIR);
}

for (const file of artifacts) {
	fs.copyFileSync(path.join(RELEASE_DIR, file), path.join(SERVER_DIR, file));
	ok(`Copied ${file}`);
}

if (!fs.existsSync(path.join(SERVER_DIR, "latest.yml"))) {
	fail("latest.yml was not found in the dist folder. Make sure electron-builder published it.");
}

// Update the dev-app-update.yml to point to the local server
step(`Writing ${DEV_CONFIG}...`);

fs.writeFileSync(DEV_CONFIG, `provider: generic\nurl: http://localhost:${PORT}\n`);
ok(`${DEV_CONFIG} written (pointing to http://localhost:${PORT}).`);

// Start the http server
step(`Starting local update server on port ${PORT}...`);

console.log(`\n   Serving: ./${SERVER_DIR}`);
console.log(`   URL:     http://localhost:${PORT}`);
console.log("\n   Now run your OLD app build and trigger autoUpdater.checkForUpdates().");
console.log("   Press Ctrl+C to stop the server when done.\n");

const server = spawn(
	"npx", ["http-server", SERVER_DIR, "-p", PORT, "--cors"],
	{ stdio: "inherit", shell: true }
);

server.on("error", (err) => fail(`Failed to start http-server: ${err.message}`));
