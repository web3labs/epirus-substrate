/* eslint-disable no-unused-vars */
export {}

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      REACT_APP_SQUID_ENDPOINT: string;
      REACT_APP_SQUID_ARCHIVE_ENDPOINT: string;
      REACT_APP_VERIFIER_WS_ENDPOINT: string;
      REACT_APP_VERIFIER_ENDPOINT: string;
      REACT_APP_VERIFIER_RSC_ENDPOINT: string;
      REACT_APP_SOURCE_CODE_ENABLED: string;
    };
  }
}
