import { useState, useCallback } from 'react';
import { StdFee, DeliverTxResponse } from '@cosmjs/stargate';

import { useLedger } from '../ledger';
import { Wallet } from '../lib/wallet';
import { assertIsError } from '../lib/error';

interface TxData {
  msgs: any[];
  fee?: StdFee;
  memo?: string;
}

export type SignAndBroadcastType = (
  message: TxData,
  onBroadcast?: () => void, // an optional callback that gets called between sign and broadcast
) => Promise<void>;

type MsgClientType = {
  signAndBroadcast: SignAndBroadcastType;
  setDeliverTxResponse: (txResult: DeliverTxResponse | undefined) => void;
  deliverTxResponse?: DeliverTxResponse;
  setError: (error: string | undefined) => void;
  error?: string;
  wallet?: Wallet;
};

export default function useMsgClient(
  handleTxQueued: () => void,
  handleTxDelivered: (deliverTxResponse: DeliverTxResponse) => void,
  handleError: () => void,
): MsgClientType {
  const { api, wallet } = useLedger();
  const [error, setError] = useState<string | undefined>();
  const [deliverTxResponse, setDeliverTxResponse] = useState<
    DeliverTxResponse | undefined
  >();

  const sign = useCallback(
    async (tx: TxData): Promise<Uint8Array | undefined> => {
      if (!api?.msgClient || !wallet?.address) return;
      const { msgs, fee, memo } = tx;

      const defaultFee = {
        amount: [
          {
            denom: 'uregen',
            amount: '5000', // TODO: what should fee and gas be?
          },
        ],
        gas: '200000',
      };
      console.log('msgs', msgs);

      const txBytes = await api.msgClient.sign(
        wallet.address,
        msgs,
        fee || defaultFee,
        memo || '',
      );

      console.log('txBytes', txBytes);

      return txBytes;
    },
    [api?.msgClient, wallet?.address],
  );

  const broadcast = useCallback(
    async (txBytes: Uint8Array) => {
      if (!api?.msgClient || !txBytes) return;
      handleTxQueued();
      const _deliverTxResponse = await api.msgClient.broadcast(txBytes);
      // The transaction succeeded iff code is 0.
      // TODO: this can give false positives. Some errors return code 0.
      console.log('_deliverTxResponse', _deliverTxResponse);

      if (_deliverTxResponse.code !== 0) {
        setError(_deliverTxResponse.rawLog);
        handleError();
      } else {
        setDeliverTxResponse(_deliverTxResponse);
        handleTxDelivered(_deliverTxResponse);
      }
    },
    [api?.msgClient, handleTxQueued, handleTxDelivered, handleError],
  );

  const signAndBroadcast = useCallback(
    async (tx: TxData, closeForm?: () => void) => {
      try {
        const txBytes = await sign(tx);
        if (txBytes) {
          if (closeForm) closeForm();
          await broadcast(txBytes);
        }
      } catch (err) {
        if (closeForm) closeForm();
        handleError();
        assertIsError(err);
        setError(err.message);
      }

      return;
    },
    [sign, broadcast, handleError],
  );

  return {
    signAndBroadcast,
    setDeliverTxResponse,
    deliverTxResponse,
    setError,
    error,
    wallet,
  };
}
