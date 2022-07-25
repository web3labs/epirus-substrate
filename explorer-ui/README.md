# Epirus Substrate UI

Epirus Substrate UI is the user interface for [Epirus squids](../squid-ink/).

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

# EOF
```

Head to [Adding custom environment variables](https://create-react-app.dev/docs/adding-custom-environment-variables/) for further details.

## Running locally
```bash
npm run start
```

## Features

TBD

## Testing
To run tests, simply run the command

```bash
npm run test
```

## Others

This project was bootstrapped using [CRA](https://create-react-app.dev/) for convinience.
We are using [CRACO](https://github.com/dilanx/craco) alpha to enable PostCSS nesting capabilities in TailwindCSS without ejecting.

