import * as moduleAlias from "module-alias";

/**
 * Loads dynamically the chain types modules
 * specified by CHAIN env var.
 */
moduleAlias.addAlias(
  "@chain",
  `${__dirname}/chains/${process.env.CHAIN || "local"}`
);
