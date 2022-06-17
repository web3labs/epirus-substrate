import * as moduleAlias from "module-alias";

moduleAlias.addAlias(
  "@chain",
  `${__dirname}/chains/${process.env.NAME || "local"}`
);
