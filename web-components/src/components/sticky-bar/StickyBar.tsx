import { Box, SxProps } from '@mui/material';

import { Theme } from '../../theme/muiTheme';

export interface Props {
  sx?: SxProps<Theme>;
  children: JSX.Element;
}

const StickyBar = ({ sx = [], children }: Props): JSX.Element => {
  return (
    <Box
      sx={[
        {
          position: 'fixed',
          bottom: 0,
          width: '100%',
          py: [3.5, 7.5],
          px: [7, 38.5],
          boxShadow: 7,
          backgroundColor: 'primary.main',
          zIndex: 1,
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {children}
    </Box>
  );
};

export { StickyBar };
