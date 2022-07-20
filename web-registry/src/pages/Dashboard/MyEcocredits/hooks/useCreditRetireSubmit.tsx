import { MsgRetire } from '@regen-network/api/lib/generated/regen/ecocredit/v1alpha1/tx';
import { useCallback } from 'react';
import type { RetireFormValues as CreditRetireFormValues } from 'web-components/lib/components/form/CreditRetireForm';
import type { Item } from 'web-components/lib/components/modal/TxModal';
import type { SignAndBroadcastType } from 'hooks/useMsgClient';
import type { BatchInfoWithBalance } from 'types/ledger/ecocredit';
import type { UseStateSetter } from 'types/react/use-state';

type Props = {
  accountAddress?: string;
  credits: BatchInfoWithBalance[];
  creditRetireOpen: number;
  creditRetireTitle: string;
  signAndBroadcast: SignAndBroadcastType;
  setCreditRetireOpen: UseStateSetter<number>;
  setCardItems: UseStateSetter<Item[] | undefined>;
  setTxModalTitle: UseStateSetter<string | undefined>;
};

type ReturnType = (values: CreditRetireFormValues) => Promise<void>;

const useCreditRetireSubmit = ({
  accountAddress,
  credits,
  creditRetireOpen,
  creditRetireTitle,
  signAndBroadcast,
  setCreditRetireOpen,
  setCardItems,
  setTxModalTitle,
}: Props): ReturnType => {
  const creditRetireSubmit = useCallback(
    async (values: CreditRetireFormValues): Promise<void> => {
      if (!accountAddress) return Promise.reject();
      const batchDenom = credits[creditRetireOpen].batch_denom;
      const amount = values.retiredAmount.toString();
      const msg = MsgRetire.fromPartial({
        holder: accountAddress,
        location: values.retirementLocation,
        credits: [
          {
            batchDenom,
            amount,
          },
        ],
      });

      const tx = {
        msgs: [msg],
        fee: undefined,
        memo: values?.note,
      };

      await signAndBroadcast(tx, () => setCreditRetireOpen(-1));
      if (batchDenom && amount) {
        setCardItems([
          {
            label: 'batch denom',
            value: { name: batchDenom, url: `/credit-batches/${batchDenom}` },
          },
          {
            label: 'number of credits',
            value: { name: amount },
          },
        ]);
        setTxModalTitle(creditRetireTitle);
      }
    },
    [
      accountAddress,
      creditRetireOpen,
      creditRetireTitle,
      credits,
      setCardItems,
      setCreditRetireOpen,
      setTxModalTitle,
      signAndBroadcast,
    ],
  );

  return creditRetireSubmit;
};

export default useCreditRetireSubmit;