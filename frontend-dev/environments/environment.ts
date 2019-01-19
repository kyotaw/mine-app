// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    APP_APISERVER_URL: 'http://localhost:6171/',
    TRADE_APISERVER_URL: 'http://127.0.0.1:8000/',
    environment: 'dev'
};
