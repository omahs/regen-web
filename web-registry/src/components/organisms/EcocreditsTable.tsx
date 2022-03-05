import React from 'react';
import dayjs from 'dayjs';
import { Box, styled } from '@mui/material';

import {
  ActionsTable,
  RenderActionButtonsFunc,
} from 'web-components/lib/components/table/ActionsTable';

import { truncate } from '../../lib/wallet';
import { getAccountUrl } from '../../lib/block-explorer';
import { NoCredits } from '../molecules';
import type { TableCredits } from '../../types/ledger/ecocredit';

const GreyText = styled('span')(({ theme }) => ({
  color: theme.palette.info.main,
}));

const Amount = styled('div')({
  whiteSpace: 'normal',
  wordWrap: 'break-word',
});

export const EcocreditsTable: React.FC<{
  credits: TableCredits[];
  renderActionButtons?: RenderActionButtonsFunc;
}> = ({ credits, renderActionButtons }) => {
  if (!credits?.length) {
    return <NoCredits title="No ecocredits to display" />;
  }

  return (
    <ActionsTable
      tableLabel="ecocredits table"
      renderActionButtons={renderActionButtons}
      headerRows={[
        <Box
          sx={{
            minWidth: {
              xs: 'auto',
              sm: '11rem',
              lg: '13rem',
            },
          }}
        >
          Batch Denom
        </Box>,
        'Issuer',
        'Credit Class',
        <Amount>Amount Tradable</Amount>,
        <Amount>Amount Retired</Amount>,
        'Batch Start Date',
        'Batch End Date',
        'Project Location',
      ]}
      rows={credits.map((row, i) => {
        return [
          row.batch_denom,
          <a
            href={getAccountUrl(row.issuer as string)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {truncate(row.issuer as string)}
          </a>,
          row.class_id,
          formatNumber(row.tradable_amount),
          formatNumber(row.retired_amount),
          <GreyText>{formatDate(row.start_date)}</GreyText>,
          <GreyText>{formatDate(row.end_date)}</GreyText>,
          row.project_location,
        ];
      })}
    />
  );
};

const formatDate = (date: string | number | Date): string =>
  dayjs(date).format('MMMM D, YYYY');

const formatNumber = (num: string | number | Date): string => {
  return +num > 0 ? Math.floor(+num).toLocaleString() : '-';
};
