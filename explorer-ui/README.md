# Epirus Substrate UI

Epirus Substrate UI is the user interface for [Epirus squids](../squid-ink/).

To enable contract source code verification capabilities you will need a running instance of
the [Ink! Verifier Server](https://github.com/web3labs/ink-verifier-server).

## Configuration

To configure the UI just create a `.env` file with the configuration variables.

Example

```bash
# =================================
# Substrate UI config.
# =================================

# Port of the development server
PORT=3300

# Epirus Squid Ink query service endpoint
REACT_APP_SQUID_ENDPOINT=http://localhost:4350/graphql
# Epirus Squid Archive query service endpoint
REACT_APP_SQUID_ARCHIVE_ENDPOINT=http://localhost:4445/graphql
# Source code verification
REACT_APP_SOURCE_CODE_ENABLED=false
REACT_APP_VERIFIER_ENDPOINT=http://127.0.0.1:3001
REACT_APP_VERIFIER_WS_ENDPOINT=ws://127.0.0.1:3001

# EOF
```

See [.env.example](https://github.com/web3labs/epirus-substrate/blob/main/explorer-ui/.env.example) for reference.

Head to [Adding custom environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/) for further details.

## Running locally

After installing the project dependencies, only for the first time, using

```bash
npm i
```

you can start a development server

```bash
npm start
```

## Testing

To run the unit tests, use the command

```bash
npm test
```

To generate a test coverage report, execute

```bash
npm run test:coverage
```

## Linting

To apply the code linter and automatically fix issues

```bash
npm run lint:fix
```

## Analysis

To generate a source code map analysis

```
npm run analysis
```

Will generate an HTML report in `.analysis/source-map.html`

Quite useful to tackle down the cause of big sizes in production build artifacts.

## Container Image

```bash
docker build -t epirus-substrate-ui:develop .
```

The build process copies the `.env.example` environment configuration as required by Runtime ENV CRA.
Note that `NODE_ENV=development` does not resolve `process.env` variables. 
See [Runtime ENV CRA](https://github.com/kHRISl33t/runtime-env-cra) project for details.

## Others

This project was bootstrapped using [CRA](https://create-react-app.dev/) for convinience.
We are using [CRACO](https://github.com/dilanx/craco) to enable PostCSS nesting capabilities in TailwindCSS without ejecting.

