import {
  BatchBalanceInfo,
  BatchInfo,
} from '@regen-network/api/lib/generated/regen/ecocredit/v1/query';

import { ClassProjectInfo } from 'types/ledger/ecocredit';

export const EMPTY_CREDIT_CLASS: ClassProjectInfo = {
  className: '',
  classId: '',
  projectName: '',
  projectLocation: '',
};

export const EMPTY_BATCH_INFO: BatchInfo = {
  $type: BatchInfo.$type,
  denom: '',
  issuer: '',
  projectId: '',
  metadata: '',
  open: false,
};

export const EMPTY_BALANCE_INFO: BatchBalanceInfo = {
  $type: BatchBalanceInfo.$type,
  address: '',
  batchDenom: '',
  escrowedAmount: '',
  retiredAmount: '',
  tradableAmount: '',
};
