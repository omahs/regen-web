import React from 'react';
import { makeStyles, useTheme } from '@mui/styles';
import { useStaticQuery, graphql } from 'gatsby';
import BackgroundImage from 'gatsby-background-image';

import { Theme } from 'web-components/lib/theme/muiTheme';
import Section from 'web-components/src/components/section';
import ProjectCardsSlider from 'web-components/lib/components/sliders/ProjectCardsSlider';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      paddingBottom: theme.spacing(14),
    },
    [theme.breakpoints.up('sm')]: {
      paddingBottom: theme.spacing(19.75),
    },
  },
}));

const ComingSoonSection: React.FC = () => {
  const data = useStaticQuery(graphql`{
  background: file(relativePath: {eq: "coming-soon-bg.jpg"}) {
    childImageSharp {
      gatsbyImageData(quality: 90, layout: FULL_WIDTH)
    }
  }
  text: sharedYaml {
    comingSoonSection {
      header
      projects {
        name
        location
        area
        areaUnit
        handle
        comingSoon
        image {
          childImageSharp {
            gatsbyImageData(quality: 90, layout: FIXED)
          }
          publicURL
        }
      }
    }
  }
}
`);
  const content = data.text.comingSoonSection;
  const classes = useStyles({});
  const theme = useTheme();
  const imageData = data.background.childImageSharp.gatsbyImageData;

  return (
    <BackgroundImage Tag="section" fluid={imageData} backgroundColor={theme.palette.grey['50']}>
      <Section withSlider className={classes.root} title={content.header} titleVariant="subtitle2">
        <ProjectCardsSlider
          projects={content.projects.map(
            ({
              handle,
              name,
              image,
              location,
              area,
              areaUnit,
              comingSoon,
            }: {
              handle?: string;
              name: string;
              area: string;
              areaUnit: string;
              location: string;
              comingSoon: boolean;
              image: {
                publicURL: string;
              };
            }) => ({
              name,
              area,
              areaUnit,
              href: handle && `/registry/projects/${handle}`,
              comingSoon,
              imgSrc: image.publicURL,
              place: location,
            }),
          )}
        />
      </Section>
    </BackgroundImage>
  );
};

export default ComingSoonSection;
