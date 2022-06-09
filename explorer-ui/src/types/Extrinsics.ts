export interface ContractExtrinsic {
  dest: string;
  data: string;
  gasLimit: string;
  value: string;
  id: string;
  hash: string;
  signer: string;
  createdAt: string;
  method: string;
  codeHash?: string;
}
