import { toHex } from "@subsquid/util-internal-hex";

export function dataToString(data: unknown): string {
  if (typeof data === "string") {
    return data;
  }
  if (typeof data === "bigint" || typeof data === "boolean") {
    return data.toString();
  }
  if (Buffer.isBuffer(data)) {
    return toHex(data);
  }
  if (data === undefined) {
    return "";
  }
  throw new Error(
    `Conversion of arg type [${typeof data}] to string is not supported`
  );
}
