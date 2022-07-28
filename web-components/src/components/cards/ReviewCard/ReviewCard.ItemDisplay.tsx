import { ReactNode } from 'react';
import { SxProps } from '@mui/material';

import { FlexCol } from '../../box';
import { Body, Subtitle } from '../../typography';

import type { Theme } from '~/theme/muiTheme';

export const ItemDisplay = (props: {
  name?: string;
  children: ReactNode;
  sx?: SxProps<Theme>;
}): JSX.Element => {
  const { name, children, sx = [] } = props;
  return (
    <FlexCol
      sx={[
        {
          mt: 9,
          mb: 2,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {name && <Subtitle size="lg">{name}</Subtitle>}
      <Body size="lg">{children}</Body>
    </FlexCol>
  );
};
