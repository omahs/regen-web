import React from 'react';
import { CardMedia } from '@mui/material';
import { makeStyles } from 'tss-react/mui';

import { BlockContent } from 'web-components/lib/components/block-content';
import Card from 'web-components/lib/components/cards/Card';
import { Image } from 'web-components/lib/components/image';
import ImageGrid from 'web-components/lib/components/image-grid';

import { ImageGridSection as ImageGridSectionProps } from '../../generated/sanity-graphql';

const useStyles = makeStyles()(theme => ({
  card: {
    borderRadius: 0,
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(70.75),
    },
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(158.5),
    },
  },
  cardMedia: {
    height: '100%',
    width: '100%',
  },
}));

interface Props {
  content: ImageGridSectionProps;
}

const ImageGridSection: React.FC<React.PropsWithChildren<Props>> = ({
  content,
}) => {
  const { classes: styles } = useStyles();
  const backgroundImage = content.backgroundImage?.image?.asset?.url;

  return (
    <div>
      {content?.items?.map((item, index: number) => (
        <Image
          backgroundImage
          src={backgroundImage || ''}
          key={item?.header || index}
        >
          <ImageGrid
            img={
              <Card className={styles.card}>
                <CardMedia
                  className={styles.cardMedia}
                  image={item?.image?.image?.asset?.url || ''}
                />
              </Card>
            }
            title={item?.header || ''}
            description={<BlockContent content={item?.descriptionRaw} />}
            even={index % 2 === 0}
          />
        </Image>
      ))}
    </div>
  );
};

export { ImageGridSection };
