import { Tx } from '@regen-network/api/lib/generated/cosmos/tx/v1beta1/tx';

export interface TxWithHash extends Tx {
  txHash: string;
}
