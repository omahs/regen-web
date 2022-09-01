import React from 'react';
import { Box, SxProps } from '@mui/material';

import {
  RenderActionButtonsFunc,
  TablePaginationParams,
} from 'web-components/lib/components/table/ActionsTable';
import { Label } from 'web-components/lib/components/typography';

import type { BatchInfoWithBalance } from 'types/ledger/ecocredit';
import { UseStateSetter } from 'types/react/use-state';

import { BasketTokens } from 'hooks/useBasketTokens';

import { BasketsTable, EcocreditsTable } from './';

export interface PortfolioProps {
  credits?: BatchInfoWithBalance[];
  basketTokens: BasketTokens[];
  renderCreditActionButtons?: RenderActionButtonsFunc;
  renderBasketActionButtons?: RenderActionButtonsFunc;
  onTableChange?: UseStateSetter<TablePaginationParams>;
}

const sxs = {
  title: {
    color: 'info.dark',
    mb: { xs: 4.25, sm: 8.5 },
  } as SxProps,
};

export const Portfolio: React.FC<PortfolioProps> = ({
  credits,
  basketTokens,
  renderCreditActionButtons,
  renderBasketActionButtons,
  onTableChange,
}) => {
  return (
    <Box sx={{ pb: { xs: 21.25, sm: 28.28 } }}>
      <Box sx={{ pt: 12.75 }}>
        <Label sx={sxs.title}>ecocredits</Label>
        <EcocreditsTable
          credits={credits}
          renderActionButtons={renderCreditActionButtons}
          onTableChange={onTableChange}
        />
      </Box>
      <Box sx={{ pt: { xs: 9.25, sm: 8.5 } }}>
        <Label sx={sxs.title}>basket tokens</Label>
        <BasketsTable
          basketTokens={basketTokens}
          renderActionButtons={renderBasketActionButtons}
        />
      </Box>
    </Box>
  );
};
