// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `index.ts`, but if you do
// `ng build --env=prod` then `index.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const AppConfig = {
  production: false,
  environment: 'DEV',
  firebase: {
		apiKey: "AIzaSyCxERc9fe8qW3TXcI01qK1L_vXYEkb6l_E",
		authDomain: "axs-calculator-2f0ab.firebaseapp.com",
		databaseURL: "https://axs-calculator-2f0ab.firebaseio.com",
		projectId: "axs-calculator-2f0ab",
		storageBucket: "axs-calculator-2f0ab.appspot.com",
		messagingSenderId: "901029224448",
		appId: "1:901029224448:web:97013193e2bdfd3c7cf8e5",
		measurementId: "G-GX2K51XHPL"
	}
};
