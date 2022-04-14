import React, { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Grid, styled } from '@mui/material';
import cx from 'clsx';
import LazyLoad from 'react-lazyload';
import jsonld from 'jsonld';

import { Theme } from 'web-components/lib/theme/muiTheme';
// import { getFontSize } from 'web-components/lib/theme/sizing';
import Section from 'web-components/lib/components/section';
import Title from 'web-components/lib/components/title';
import ProjectPlaceInfo from 'web-components/lib/components/place/ProjectPlaceInfo';
import GlanceCard from 'web-components/lib/components/cards/GlanceCard';
import Description from 'web-components/lib/components/description';
import ProjectTopCard from 'web-components/lib/components/cards/ProjectTopCard';
import ReadMore from 'web-components/lib/components/read-more';

import { ProjectByHandleQuery } from '../../generated/graphql';
import { useSdgByIriQuery } from '../../generated/sanity-graphql';
import { getParty, getDisplayParty } from '../../lib/transform';
import { getSanityImgSrc } from '../../lib/imgSrc';
import { qudtUnit, qudtUnitMap } from '../../lib/rdf';
import { client } from '../../sanity';
import {
  BatchInfoWithSupply,
  BatchTotalsForProject,
} from '../../types/ledger/ecocredit';
import { ProjectCreditBatchesTable } from '.';
import { ProjectBatchTotals, AdditionalProjectMetadata } from '../molecules';
import { ProjectTopLink } from '../atoms';

const useStyles = makeStyles((theme: Theme) => ({
  section: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(16),
      paddingBottom: theme.spacing(27.5),
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(6.5),
      paddingBottom: theme.spacing(20.5),
    },
  },
  tagline: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(4.5),
    },
    lineHeight: '150%',
    position: 'relative',
  },
  description: {
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(5.5),
      paddingTop: theme.spacing(7.5),
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(4),
      paddingTop: theme.spacing(3.75),
    },
  },
  quotePersonName: {
    color: theme.palette.secondary.main,
    letterSpacing: '1px',
    fontWeight: 800,
    textTransform: 'uppercase',
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(5.5),
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(3),
      paddingTop: theme.spacing(4),
    },
  },
  quotePersonRole: {
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(4),
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(3),
    },
  },
  media: {
    width: '100%',
    borderRadius: '5px',
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.spacing(12.5),
      marginBottom: theme.spacing(12.5),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.spacing(8.5),
      marginBottom: theme.spacing(8.5),
    },
  },
  iframe: {
    border: 'none',
    [theme.breakpoints.up('sm')]: {
      height: theme.spacing(109.5),
    },
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(55.25),
    },
  },
  quotes: {
    color: theme.palette.secondary.main,
    lineHeight: 0,
    zIndex: 0,
    position: 'absolute',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(9),
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: theme.spacing(12),
    },
  },
  icon: {
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
      paddingTop: theme.spacing(0.25),
    },
  },
}));

const QuoteMark = styled('span')(({ theme }) => ({
  color: theme.palette.secondary.main,
  lineHeight: 0,
  zIndex: 0,
  position: 'absolute',
  [theme.breakpoints.down('sm')]: {
    fontSize: theme.spacing(9),
  },
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.spacing(12),
  },
}));

function ProjectTopSection({
  data,
  geojson,
  isGISFile,
  batchData,
}: {
  data?: ProjectByHandleQuery;
  geojson?: any;
  isGISFile?: boolean;
  batchData?: {
    batches?: BatchInfoWithSupply[];
    totals?: BatchTotalsForProject;
  };
}): JSX.Element {
  const styles = useStyles();
  const [metadata, setMetadata] = useState<any>(null);

  const imageStorageBaseUrl = process.env.REACT_APP_IMAGE_STORAGE_BASE_URL;
  const apiServerUrl = process.env.REACT_APP_API_URI;

  const project = data?.projectByHandle;

  useEffect(() => {
    const expand = async (): Promise<void> => {
      if (!project?.metadata) return;
      console.log('project?.metadata', project?.metadata);

      const result = await jsonld.expand(
        project?.metadata,
        // project?.metadata?.['@context'],
      );
      // const result = await jsonld.frame(
      //   project?.metadata,
      //   project?.metadata?.['@context'],
      // );

      //TODO: JUST use compacted style!!!

      const fixed = result[0];
      console.log('result', fixed);

      setMetadata(fixed);
    };

    expand();
  }, [project]);

  // [
  //   {
  //     '@type': ['http://regen.network/Project'],
  //     'http://regen.network/additionalCertification': [
  //       {
  //         'http://schema.org/name': [
  //           {
  //             '@value': 'CCB',
  //           },
  //         ],
  //         'http://schema.org/url': [
  //           {
  //             '@type': 'http://schema.org/URL',
  //             '@value': 'https://verra.org/project/ccb-program/',
  //           },
  //         ],
  //         'http://schema.org/version': [
  //           {
  //             '@value': 'Second Edition',
  //           },
  //         ],
  //       },
  //     ],
  //     'http://regen.network/boundaries': [
  //       {
  //         '@type': 'http://schema.org/URL',
  //         '@value':
  //           'https://regen-registry.s3.amazonaws.com/projects/wilmot/Wilmot_boundary.kml',
  //       },
  //     ],
  //     'http://regen.network/landStory': [
  //       {
  //         '@value':
  //           'For years, the land between Tsavo East and Tsavo West National parks in Kenya served both as home to a slowly failing cattle ranch and as the main migration corridor for local wildlife moving between the two National Parks. When we first encountered Rukinga, the community and the wildlife were at odds. Rukinga was a bruised, balding land, barren of wildlife. Cattle had grazed the fields into dust, poachers slipped on and off the ranch with ease, and trees were being clear cut along the area’s critical rainwater basin.',
  //       },
  //     ],
  //     'http://regen.network/offsetGenerationMethod': [
  //       {
  //         '@value': 'offsetGenerationMethod',
  //       },
  //     ],
  //     'http://regen.network/projectActivity': [
  //       {
  //         'http://schema.org/name': [
  //           {
  //             '@value': 'REDD+',
  //           },
  //         ],
  //         'http://schema.org/url': [
  //           {
  //             '@type': 'http://schema.org/URL',
  //             '@value': 'https://redd.unfccc.int/',
  //           },
  //         ],
  //       },
  //     ],
  //     'http://regen.network/projectDeveloper': [
  //       {
  //         '@type': ['http://regen.network/OrganizationDisplay'],
  //         'http://regen.network/showOnProjectPage': [
  //           {
  //             '@value': true,
  //           },
  //         ],
  //         'http://schema.org/description': [
  //           {
  //             '@value':
  //               "Wildlife Works is the world's leading REDD+ program development and management company.",
  //           },
  //         ],
  //         'http://schema.org/name': [
  //           {
  //             '@value': 'Wildlife Works Carbon LLC',
  //           },
  //         ],
  //       },
  //     ],
  //     'http://regen.network/projectEndDate': [
  //       {
  //         '@type': 'http://www.w3.org/2001/XMLSchema#date',
  //         '@value': '2022-03-17',
  //       },
  //     ],
  //     'http://regen.network/projectSize': [
  //       {
  //         'http://qudt.org/schema/qudt/numericValue': [
  //           {
  //             '@type': 'http://www.w3.org/2001/XMLSchema#double',
  //             '@value': 123456,
  //           },
  //         ],
  //         'http://qudt.org/schema/qudt/unit': [
  //           {
  //             '@type': 'qudt:Unit',
  //             '@value': 'http://qudt.org/vocab/unit/HA',
  //           },
  //         ],
  //       },
  //     ],
  //     'http://regen.network/projectStartDate': [
  //       {
  //         '@type': 'http://www.w3.org/2001/XMLSchema#date',
  //         '@value': '2020-01-31',
  //       },
  //     ],
  //     'http://regen.network/vcsMethodology': [
  //       {
  //         'http://schema.org/name': [
  //           {
  //             '@value': 'vcsMethodology',
  //           },
  //         ],
  //         'http://schema.org/url': [
  //           {
  //             '@type': 'http://schema.org/URL',
  //             '@value': 'https://verra.org/project/ccb-program/',
  //           },
  //         ],
  //       },
  //     ],
  //     'http://regen.network/vcsProjectId': [
  //       {
  //         '@type': 'http://www.w3.org/2001/XMLSchema#unsignedInt',
  //         '@value': 123,
  //       },
  //     ],
  //     'http://regen.network/vcsProjectPage': [
  //       {
  //         '@type': 'http://schema.org/URL',
  //         '@value': 'https://registry.verra.org/app/projectDetail/VCS/todo',
  //       },
  //     ],
  //     'http://regen.network/vcsProjectType': [
  //       {
  //         '@value': 'vcsProjectType',
  //       },
  //     ],
  //     'http://schema.org/location': [
  //       {
  //         'https://purl.org/geojson/vocab#bbox': [
  //           {
  //             '@value': 152.281925823569,
  //           },
  //           {
  //             '@value': -30.4188967883064,
  //           },
  //           {
  //             '@value': 152.53051845185,
  //           },
  //           {
  //             '@value': -30.1967091580822,
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#center': [
  //           {
  //             '@value': 152.4184,
  //           },
  //           {
  //             '@value': -30.2986,
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#context': [
  //           {
  //             'https://purl.org/geojson/vocab#id': [
  //               {
  //                 '@value': 'postcode.8076814917761920',
  //               },
  //             ],
  //             'https://purl.org/geojson/vocab#text': [
  //               {
  //                 '@value': '2453',
  //               },
  //             ],
  //           },
  //           {
  //             'https://purl.org/geojson/vocab#id': [
  //               {
  //                 '@value': 'region.19582497656831280',
  //               },
  //             ],
  //             'https://purl.org/geojson/vocab#short_code': [
  //               {
  //                 '@value': 'AU-NSW',
  //               },
  //             ],
  //             'https://purl.org/geojson/vocab#text': [
  //               {
  //                 '@value': 'New South Wales',
  //               },
  //             ],
  //             'https://purl.org/geojson/vocab#wikidata': [
  //               {
  //                 '@value': 'Q3224',
  //               },
  //             ],
  //           },
  //           {
  //             'https://purl.org/geojson/vocab#id': [
  //               {
  //                 '@value': 'country.9665923154346070',
  //               },
  //             ],
  //             'https://purl.org/geojson/vocab#short_code': [
  //               {
  //                 '@value': 'au',
  //               },
  //             ],
  //             'https://purl.org/geojson/vocab#text': [
  //               {
  //                 '@value': 'Australia',
  //               },
  //             ],
  //             'https://purl.org/geojson/vocab#wikidata': [
  //               {
  //                 '@value': 'Q408',
  //               },
  //             ],
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#geometry': [
  //           {
  //             'https://purl.org/geojson/vocab#coordinates': [
  //               {
  //                 '@list': [
  //                   {
  //                     '@value': 152.4184,
  //                   },
  //                   {
  //                     '@value': -30.2986,
  //                   },
  //                 ],
  //               },
  //             ],
  //             '@type': ['https://purl.org/geojson/vocab#Point'],
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#id': [
  //           {
  //             '@value': 'locality.6875563885184200',
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#place_name': [
  //           {
  //             '@value': 'Hernani, New South Wales, Australia',
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#place_type': [
  //           {
  //             '@value': 'locality',
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#properties': [{}],
  //         'https://purl.org/geojson/vocab#relevance': [
  //           {
  //             '@value': 1,
  //           },
  //         ],
  //         'https://purl.org/geojson/vocab#text': [
  //           {
  //             '@value': 'Hernani',
  //           },
  //         ],
  //         '@type': ['https://purl.org/geojson/vocab#Feature'],
  //       },
  //     ],
  //     'http://schema.org/name': [
  //       {
  //         '@value': 'VCS Sample Project',
  //       },
  //     ],
  //   },
  // ];

  const registry = project?.partyByRegistryId;
  const videoURL = metadata?.['http://regen.network/videoURL']?.[0]?.['@value'];
  const landStewardPhoto =
    metadata?.['http://regen.network/landStewardPhoto']?.[0]?.['@value'];
  const area =
    metadata?.['http://regen.network/size']?.[0]?.[
      'http://qudt.org/1.1/schema/qudt#numericValue'
    ]?.[0]?.['@value'] ||
    metadata?.['http://regen.network/projectSize']?.[0]?.[
      'http://qudt.org/schema/qudt/numericValue'
    ]?.[0]?.['@value'];
  const unit: qudtUnit | undefined =
    metadata?.['http://regen.network/projectSize']?.[0]?.[
      'http://qudt.org/1.1/schema/qudt#unit'
    ]?.[0]?.['@value'] ||
    metadata?.['http://regen.network/projectSize']?.[0]?.['@value'];
  const creditClass = project?.creditClassByCreditClassId;
  const creditClassVersion = creditClass?.creditClassVersionsById?.nodes?.[0];
  const methodologyVersion =
    creditClass?.methodologyByMethodologyId?.methodologyVersionsById
      ?.nodes?.[0];
  const quote = metadata?.['http://regen.network/projectQuote'];
  const glanceText =
    metadata?.['http://regen.network/glanceText']?.[0]?.['@list'];
  const landStory = metadata?.['http://regen.network/landStory'];
  const landStewardStoryTitle =
    metadata?.['http://regen.network/landStewardStoryTitle'];
  const landStewardStory =
    metadata?.['http://regen.network/landStewardStory']?.[0]?.['@value'];
  const isVcsProject =
    !!metadata?.['http://regen.network/vcsProjectId']?.[0]?.['@value'];

  const sdgIris = creditClassVersion?.metadata?.[
    'http://regen.network/SDGs'
  ]?.[0]?.['@list']?.map((sdg: { '@id': string }) => sdg['@id']);
  const { data: sdgData } = useSdgByIriQuery({
    client,
    variables: {
      iris: sdgIris,
    },
    skip: !sdgIris,
  });
  const sdgs = sdgData?.allSdg.map(s => ({
    title: s.title || '',
    imageUrl: getSanityImgSrc(s.image),
  }));
  return (
    <Section classes={{ root: styles.section }}>
      <Grid container>
        <Grid item xs={12} md={8} sx={{ pr: { md: 19 } }}>
          {/* TODO Show on-chain project id if no off-chain name */}
          <Title variant="h1">
            {metadata?.['http://schema.org/name']?.[0]?.['@value']}
          </Title>
          <Box sx={{ pt: { xs: 5, sm: 6 } }}>
            <ProjectPlaceInfo
              iconClassName={styles.icon}
              // TODO Format and show on-chain project location if no off-chain location
              place={metadata?.['http://schema.org/location']?.[0]?.place_name}
              area={area}
              areaUnit={unit && qudtUnitMap[unit]}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', mt: 2.5 }}>
              {creditClass && creditClassVersion && (
                <>
                  <ProjectTopLink
                    label="credit class"
                    name={creditClassVersion.name}
                    url={
                      isVcsProject
                        ? `/credit-classes/${creditClass?.onChainId}`
                        : creditClassVersion.metadata?.[
                            'http://schema.org/url'
                          ]?.['@value']
                    }
                    creditClassId={
                      creditClassVersion?.metadata?.[
                        'http://regen.network/creditClassId'
                      ]
                    }
                    target="_self"
                  />
                </>
              )}
              {!isVcsProject && (
                <ProjectTopLink
                  label="offset generation method"
                  name={
                    creditClassVersion?.metadata?.[
                      'http://regen.network/offsetGenerationMethod'
                    ]
                  }
                />
              )}
              {methodologyVersion && (
                <ProjectTopLink
                  label="methodology"
                  name={methodologyVersion.name}
                  url={
                    methodologyVersion.metadata?.['http://schema.org/url']?.[
                      '@value'
                    ]
                  }
                />
              )}
              {registry && (
                <ProjectTopLink
                  label="registry"
                  name={registry.name}
                  url={registry.organizationByPartyId?.website}
                />
              )}
            </Box>
          </Box>

          {geojson && isGISFile && glanceText && (
            <LazyLoad offset={50} once>
              <Box sx={{ pt: 6 }}>
                <GlanceCard
                  text={glanceText}
                  imageStorageBaseUrl={imageStorageBaseUrl}
                  apiServerUrl={apiServerUrl}
                  geojson={geojson}
                  isGISFile={isGISFile}
                  mapboxToken={process.env.REACT_APP_MAPBOX_TOKEN}
                />
              </Box>
            </LazyLoad>
          )}
          {landStewardStoryTitle && (
            <Title sx={{ pt: { xs: 11.75, sm: 14 } }} variant="h2">
              Story
            </Title>
          )}
          {landStory && (
            <Description className={styles.description}>
              {landStory}
            </Description>
          )}
          <AdditionalProjectMetadata metadata={metadata} />
          <LazyLoad offset={50}>
            {videoURL &&
              (/https:\/\/www.youtube.com\/embed\/[a-zA-Z0-9_.-]+/.test(
                videoURL,
              ) ||
              /https:\/\/player.vimeo.com\/video\/[a-zA-Z0-9_.-]+/.test(
                videoURL,
              ) ? (
                <iframe
                  className={cx(styles.iframe, styles.media)}
                  title={
                    metadata?.['http://schema.org/name']?.[0]?.['@value'] ||
                    'project'
                  }
                  src={videoURL}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <video className={styles.media} controls>
                  <source src={videoURL} />
                </video>
              ))}
            {landStewardPhoto && (
              <img
                className={styles.media}
                alt={landStewardPhoto}
                src={landStewardPhoto}
              />
            )}
          </LazyLoad>
          {landStewardStoryTitle && (
            <Title variant="h4" className={styles.tagline}>
              {landStewardStoryTitle}
            </Title>
          )}
          {landStewardStory && (
            <ReadMore maxLength={450} restMinLength={300}>
              {landStewardStory}
            </ReadMore>
          )}
          {quote && (
            <div>
              <Title
                variant="h4"
                sx={{ ml: { xs: 4, sm: 4.5 } }}
                className={styles.tagline}
              >
                <QuoteMark sx={{ top: 16, left: { xs: -15, sm: -18 } }}>
                  “
                </QuoteMark>
                <Box component="span" sx={{ position: 'relative', zIndex: 1 }}>
                  {quote['http://regen.network/quote']}
                </Box>
                <QuoteMark sx={{ ml: -2.5, bottom: { xs: 14, sm: 16 } }}>
                  ”
                </QuoteMark>
              </Title>
              <Title variant="h6" className={styles.quotePersonName}>
                {quote['http://schema.org/name']}
              </Title>
              <Description className={styles.quotePersonRole}>
                {quote['http://schema.org/jobTitle']}
              </Description>
            </div>
          )}
          {batchData?.totals && (
            <ProjectBatchTotals
              totals={batchData.totals}
              sx={{
                mt: { xs: 10, sm: 12, md: 16 },
                mb: { xs: 10, sm: 12, md: 0 },
              }}
            />
          )}
        </Grid>
        <Grid item xs={12} md={4} sx={{ pt: { xs: 10, sm: 'inherit' } }}>
          {/* <ProjectTopCard
            projectDeveloper={getDisplayParty(
              'http://regen.network/projectDeveloper',
              metadata,
              project?.partyByDeveloperId,
            )}
            landSteward={getDisplayParty(
              'http://regen.network/landSteward',
              metadata,
              project?.partyByStewardId,
            )}
            landOwner={getDisplayParty(
              'http://regen.network/landOwner',
              metadata,
              project?.partyByLandOwnerId,
            )}
            // TODO if no off-chain data, use on-chain project.issuer
            issuer={getParty(project?.partyByIssuerId)}
            reseller={getParty(project?.partyByResellerId)}
            sdgs={sdgs}
          /> */}
        </Grid>
      </Grid>
      {batchData?.batches && batchData.batches.length > 0 && (
        // spacing here based on paddding-top for `<Section />` component
        <Box sx={{ mt: { xs: 17.75, sm: 22.25 } }}>
          <Title variant="h3" sx={{ pb: 8 }}>
            Credit Batches
          </Title>
          <ProjectCreditBatchesTable batches={batchData.batches} />
        </Box>
      )}
    </Section>
  );
}

export { ProjectTopSection };
