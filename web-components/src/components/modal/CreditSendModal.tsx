import React from 'react';

import { CreditSendForm, CreditSendProps } from '../form/CreditSendForm';
import { RegenModalProps } from '../modal';
import { FormModalTemplate } from './FormModalTemplate';

interface CreditSendModalProps extends RegenModalProps, CreditSendProps {}

export const CREDIT_SEND_TITLE = 'Send';

const CreditSendModal: React.FC<CreditSendModalProps> = ({
  sender,
  batchDenom,
  availableTradableAmount,
  mapboxToken,
  open,
  onSubmit,
  onClose,
}) => (
  <FormModalTemplate title={CREDIT_SEND_TITLE} open={open} onClose={onClose}>
    <CreditSendForm
      sender={sender}
      batchDenom={batchDenom}
      availableTradableAmount={availableTradableAmount}
      mapboxToken={mapboxToken}
      onSubmit={onSubmit}
      onClose={onClose}
    />
  </FormModalTemplate>
);

export { CreditSendModal };
