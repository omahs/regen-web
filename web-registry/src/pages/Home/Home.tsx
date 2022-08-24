import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, CardMedia, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/styles';
import { QueryProjectsResponse } from '@regen-network/api/lib/generated/regen/ecocredit/v1/query';

import { BlockContent } from 'web-components/lib/components/block-content';
import ContainedButton from 'web-components/lib/components/buttons/ContainedButton';
import ProjectCard from 'web-components/lib/components/cards/ProjectCard';
import { Loading } from 'web-components/lib/components/loading';
import Modal from 'web-components/lib/components/modal';
import Section from 'web-components/lib/components/section';
import { Body, Title } from 'web-components/lib/components/typography';

import { useProjectsSellOrders } from 'pages/Projects/hooks/useProjectsSellOrders';
import { useSortProjects } from 'pages/Projects/hooks/useSortProjects';
import {
  API_URI,
  IMAGE_STORAGE_BASE_URL,
} from 'pages/Projects/Projects.config';
import WithLoader from 'components/atoms/WithLoader';
import { useEcocreditQuery } from 'hooks';
import { useQuerySellOrders } from 'hooks/useQuerySellOrders';

import topographyImg from '../../assets/background-contour-1.jpg';
import horsesImg from '../../assets/horses-grazing.png';
import { SanityButton } from '../../components/atoms';
import { BackgroundImgSection, HeroAction } from '../../components/molecules';
import { CreditBatches, CreditClassCards } from '../../components/organisms';
import {
  useAllCreditClassQuery,
  useAllHomePageQuery,
} from '../../generated/sanity-graphql';
import { client } from '../../sanity';
import { FEATURE_PROJECTS_COUNT, PROJECTS_SORT } from './Home.constants';
import { useHomeStyles } from './Home.styles';

const Home: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [modalLink, setModalLink] = useState<string>('');
  const navigate = useNavigate();

  const styles = useHomeStyles();
  const theme = useTheme();

  const { data, loading: loadingSanity } = useAllHomePageQuery({ client });
  const { data: creditClassData } = useAllCreditClassQuery({ client });
  const content = data?.allHomePage?.[0];
  const heroSection = content?.heroSection;

  const creditClassesContent = creditClassData?.allCreditClass;

  const { data: ecocreditData } = useEcocreditQuery<QueryProjectsResponse>({
    query: 'projects',
    params: {},
  });
  const { sellOrdersResponse } = useQuerySellOrders();
  const sellOrders = sellOrdersResponse?.sellOrders;
  const projects = useMemo(
    () => ecocreditData?.projects?.filter(project => project.metadata),
    [ecocreditData?.projects],
  );

  const projectsWithOrderData = useProjectsSellOrders({
    projects,
    sellOrders,
    limit: FEATURE_PROJECTS_COUNT,
  });
  const sortedProjects = useSortProjects({
    projects: projectsWithOrderData,
    sort: PROJECTS_SORT,
  });

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const anchor = window.location.hash.slice(1);
    if (anchor) {
      const anchorEl = document.getElementById(anchor);
      if (anchorEl) {
        anchorEl.scrollIntoView();
      }
    }
  }, []);

  if (loadingSanity) return <Loading sx={{ minHeight: '100vh' }} />;

  return (
    <Box sx={{ backgroundColor: 'primary.main' }}>
      <BackgroundImgSection
        img={heroSection?.background?.image?.asset?.url || ''}
        linearGradient="linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 100%);"
        classes={{ section: styles.section }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column-reverse', sm: 'row' },
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            pt: { xs: 8, sm: 15 },
          }}
        >
          <Box sx={{ pr: 4, maxWidth: '585px' }}>
            <Title
              variant="h1"
              sx={{
                color: 'primary.main',
                lineHeight: { xs: '140%', sm: '130%' },
              }}
            >
              {heroSection?.title}
            </Title>
            <Body
              as="div"
              size="xl"
              mobileSize="md"
              sx={{ color: 'primary.main', my: 4 }}
            >
              <BlockContent content={heroSection?.bodyRaw} />
            </Body>
            <SanityButton
              size="large"
              btn={heroSection?.button}
              sx={{ mt: { xs: 4, sm: 4 } }}
            />
          </Box>
          <Box
            sx={{
              alignSelf: 'center',
              maxWidth: { xs: '187px', sm: '100%' },
            }}
          >
            <img
              loading="lazy"
              style={{ width: '100%' }}
              src={heroSection?.icon?.image?.asset?.url || ''}
              alt={heroSection?.icon?.imageAlt || 'icon'}
            />
          </Box>
        </Box>
      </BackgroundImgSection>

      {sortedProjects && (
        <div id="projects">
          <Section
            title="Featured Projects"
            titleAlign="center"
            classes={{ root: styles.section, title: styles.title }}
          >
            <WithLoader
              isLoading={sortedProjects?.length === 0}
              sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}
            >
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 338px))',
                  gridGap: '1.125rem',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                {sortedProjects?.map(project => (
                  <Box key={project?.id}>
                    <ProjectCard
                      name={project?.name}
                      imgSrc={project?.imgSrc}
                      place={project?.place}
                      area={project?.area}
                      areaUnit={project?.areaUnit}
                      // onButtonClick={() => {}} TODO #1055
                      purchaseInfo={project.purchaseInfo}
                      onClick={() => navigate(`/projects/${project.id}`)}
                      imageStorageBaseUrl={IMAGE_STORAGE_BASE_URL}
                      apiServerUrl={API_URI}
                      truncateTitle={true}
                      sx={{ width: 338, height: 479 }}
                    />
                  </Box>
                ))}
              </Box>
            </WithLoader>
          </Section>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 30 }}>
            <Link to="/projects">
              <ContainedButton>{'DISCOVER PROJECTS'}</ContainedButton>
            </Link>
          </Box>
        </div>
      )}

      <CardMedia image={topographyImg}>
        <CreditBatches />
      </CardMedia>

      {creditClassesContent && (
        <Section
          title="Credit Classes"
          classes={{ root: styles.section, title: styles.title }}
        >
          <CreditClassCards
            btnText="Learn More"
            justifyContent={isMobile ? 'center' : 'flex-start'}
            creditClassesContent={creditClassesContent} // CMS data
          />
        </Section>
      )}

      <HeroAction
        isBanner
        classes={{
          main: styles.bottomSectionWidth,
          section: styles.bottomSection,
        }}
        img={horsesImg}
        openModal={(href: string): void => {
          setModalLink(href);
          setOpen(true);
        }}
        bottomBanner={content?.bottomBanner}
      />

      <Modal open={open} onClose={() => setOpen(false)} isIFrame>
        <iframe title="airtable-signup-form" src={modalLink} />
      </Modal>
    </Box>
  );
};

export { Home };
