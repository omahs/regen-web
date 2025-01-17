import { Box, Card, CardContent, CardMedia, SxProps } from '@mui/material';

import { Theme } from '../../../theme/muiTheme';
import { parseText } from '../../../utils/textParser';
import { OptimizeImageProps } from '../../image';
import { Body, Subtitle, Title } from '../../typography';
import { useCreditClassCardStyles } from './CreditClassCard.styles';

export interface Props extends OptimizeImageProps {
  title: string | JSX.Element;
  description: string | JSX.Element;
  imgSrc: string;
  sx?: SxProps<Theme>;
}

const CreditClassCard = ({
  title,
  description,
  imgSrc,
  apiServerUrl,
  imageStorageBaseUrl,
  sx = [],
}: Props): JSX.Element => {
  const { classes } = useCreditClassCardStyles();

  return (
    <Box
      sx={[
        { display: 'block', width: '100%', maxWidth: 658 },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <Card
        elevation={1}
        sx={{
          display: 'flex',
          flexDirection: ['column', 'row'],
          border: '1px solid',
          borderColor: 'grey.100',
          borderRadius: '10px',
        }}
      >
        <CardMedia image={imgSrc || ''} className={classes.image} />
        <CardContent>
          <Subtitle
            size="xs"
            color="info.main"
            sx={{ fontWeight: 800, mb: 3, letterSpacing: '1px', mt: [0, 2.5] }}
          >
            {'CREDIT CLASS'}
          </Subtitle>
          <Title variant="h5" mobileVariant="h6" as="div" sx={{ mb: 2 }}>
            {parseText(title)}
          </Title>
          <Body size="sm" mobileSize="xs">
            {parseText(description)}
          </Body>
        </CardContent>
      </Card>
    </Box>
  );
};

export { CreditClassCard };
