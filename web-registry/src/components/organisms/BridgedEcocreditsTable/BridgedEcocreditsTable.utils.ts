import { TxBody } from '@regen-network/api/lib/generated/cosmos/tx/v1beta1/tx';
import { Any } from '@regen-network/api/lib/generated/google/protobuf/any';

export const hasTxBody = (txBody: TxBody): txBody is TxBody => {
  return !!txBody;
};

export const hasMessages = (messages?: Any[]): messages is Any[] => {
  return !!messages;
};
