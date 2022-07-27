import { useTheme } from '@mui/styles';
import { Box, Skeleton } from '@mui/material';
import { useParams } from 'react-router-dom';
import { ServiceClientImpl } from '@regen-network/api/lib/generated/cosmos/tx/v1beta1/service';
import { QueryProjectResponse } from '@regen-network/api/lib/generated/regen/ecocredit/v1/query';

import { Theme } from 'web-components/lib/theme/muiTheme';
import IssuanceModal from 'web-components/lib/components/modal/IssuanceModal';
import ProjectMedia from 'web-components/lib/components/sliders/ProjectMedia';
import SEO from 'web-components/lib/components/seo';
import { CreditPrice } from 'web-components/lib/components/fixed-footer/BuyFooter';

import { useLedger } from '../../../ledger';
import { chainId } from '../../../lib/ledger';
import {
  ProjectTopSection,
  ProjectImpactSection,
  MoreProjectsSection,
} from '../../organisms';
import { Credits } from '../../organisms/BuyCreditsModal/BuyCreditsModal';
import {
  useProjectByHandleQuery,
  useProjectByOnChainIdQuery,
} from '../../../generated/graphql';
import { ProjectMetadataLD } from '../../../generated/json-ld/index';
import useOtherProjects from './hooks/useOtherProjects';
import useImpact from './hooks/useImpact';
import useSeo from './hooks/useSeo';
import useGeojson from './hooks/useGeojson';
import useMedia from './hooks/useMedia';
import useIssuanceModal from './hooks/useIssuanceModal';
import useBatches from './hooks/useBatches';
import useQueryMetadataGraph from '../../../hooks/useQueryMetadataGraph';
import useEcocreditQuery from '../../../hooks/useEcocreditQuery';
import { MoreInfo } from './ProjectDetails.MoreInfo';
import { ProjectTimeline } from './ProjectDetails.ProjectTimeline';
import { ProjectDocumentation } from './ProjectDetails.ProjectDocumentation';
import { TransactionModals } from './ProjectDetails.TransactionModals';
import { ManagementActions } from './ProjectDetails.ManagementActions';
import { getMediaBoxStyles } from './ProjectDetails.styles';

interface Project {
  creditPrice?: CreditPrice;
  stripePrice?: string;
  credits?: Credits;
}

// Update for testing purchase credits modal
const testProject: Project = {};

function ProjectDetails(): JSX.Element {
  const theme = useTheme<Theme>();
  const { projectId } = useParams();

  // Page mode (info/Tx)
  const isInfoMode = !(chainId && testProject.creditPrice);
  const isTxMode =
    chainId && (testProject.creditPrice || testProject.stripePrice);

  // Tx client
  const { api } = useLedger({ forceExp: true });
  let txClient: ServiceClientImpl | undefined;
  if (api) {
    txClient = new ServiceClientImpl(api.queryClient);
  }

  // first, check if projectId is handle or onChainId
  const isOnChainId =
    !!projectId && /([A-Z]{1}[\d]+)([-])([\d{3,}])\w+/.test(projectId);

  // if projectId is handle, query project by handle
  const { data: dataByHandle, loading: loadingDataByHandle } =
    useProjectByHandleQuery({
      skip: isOnChainId,
      variables: { handle: projectId as string },
    });

  // else fetch project by onChainId
  const { data: dataByOnChainId, loading } = useProjectByOnChainIdQuery({
    skip: !isOnChainId,
    variables: { onChainId: projectId as string },
  });

  const { data: projectResponse } = useEcocreditQuery<QueryProjectResponse>({
    query: 'project',
    params: { projectId },
  });
  const onChainProject = projectResponse?.project;

  // TODO: when all projects are on-chain, just use dataByOnChainId
  const data = isOnChainId ? dataByOnChainId : dataByHandle;
  const project = isOnChainId
    ? dataByOnChainId?.projectByOnChainId
    : dataByHandle?.projectByHandle;

  const offChainProjectMetadata: ProjectMetadataLD = project?.metadata;
  const onChainProjectMetadata = useQueryMetadataGraph(
    onChainProject?.metadata,
  );
  const vcsProjectId = onChainProjectMetadata?.['regen:vcsProjectId'];
  const managementActions =
    offChainProjectMetadata?.['regen:landManagementActions']?.['@list'];

  const creditClassId = project?.creditClassByCreditClassId?.onChainId;
  const { batchData, batchTotals } = useBatches({
    creditClassId,
    vcsProjectId,
  });

  // with project query
  const projectEvents = project?.eventsByProjectId?.nodes;
  const projectDocs = project?.documentsByProjectId?.nodes;

  const creditClassVersion =
    project?.creditClassByCreditClassId?.creditClassVersionsById?.nodes?.[0];

  const creditClassName = creditClassVersion?.name;
  const creditClassDenom =
    creditClassVersion?.metadata?.['http://regen.network/creditDenom'];
  const coBenefitsIris =
    creditClassVersion?.metadata?.['http://regen.network/coBenefits']?.[
      '@list'
    ]?.map((impact: { '@id': string }) => impact['@id']) || [];
  const primaryImpactIRI = [
    creditClassVersion?.metadata?.['http://regen.network/indicator']?.['@id'],
  ];

  const { geojson, isGISFile, setGeojson } = useGeojson(
    offChainProjectMetadata,
  );

  // TODO: what should be used here?
  const seoData = useSeo({
    metadata: offChainProjectMetadata,
    creditClassName,
    // metadataLocation,
    handleReset: () => setGeojson(null),
  });
  const mediaData = useMedia({ metadata: offChainProjectMetadata, geojson });
  const impactData = useImpact({ coBenefitsIris, primaryImpactIRI });
  const otherProjects = useOtherProjects(projectId as string);
  const isLoading = loading || loadingDataByHandle;

  const {
    issuanceModalData,
    issuanceModalOpen,
    setIssuanceModalOpen,
    viewOnLedger,
  } = useIssuanceModal(data);

  return (
    <Box sx={{ backgroundColor: 'primary.main' }}>
      <SEO
        location={seoData.location}
        siteMetadata={seoData.siteMetadata}
        title={seoData.title}
        imageUrl={seoData.imageUrl}
      />

      {mediaData.assets.length === 0 && isLoading && (
        <Box sx={getMediaBoxStyles(theme)}>
          <Skeleton height={theme.spacing(78.75)} />
        </Box>
      )}

      {mediaData.assets.length > 0 && (
        <Box sx={getMediaBoxStyles(theme)}>
          <ProjectMedia
            gridView
            assets={mediaData.assets}
            apiServerUrl={mediaData.apiServerUrl}
            imageStorageBaseUrl={mediaData.imageStorageBaseUrl}
            imageCredits={mediaData.imageCredits}
            mobileHeight={theme.spacing(78.75)}
          />
        </Box>
      )}

      <ProjectTopSection
        data={data}
        batchData={{
          batches: batchData,
          totals: batchTotals,
        }}
        geojson={geojson}
        isGISFile={isGISFile}
      />

      {impactData?.length > 0 && (
        <div className="topo-background-alternate">
          <ProjectImpactSection impact={impactData} />
        </div>
      )}

      {projectDocs && projectDocs.length > 0 && (
        <ProjectDocumentation
          docs={projectDocs}
          txClient={txClient}
          viewOnLedger={viewOnLedger}
        />
      )}

      {managementActions && <ManagementActions actions={managementActions} />}

      {projectEvents && projectEvents?.length > 0 && (
        <ProjectTimeline
          events={projectEvents}
          txClient={txClient}
          viewOnLedger={viewOnLedger}
        />
      )}

      {otherProjects && otherProjects.length > 0 && (
        <div className="topo-background-alternate">
          <MoreProjectsSection projects={otherProjects} />
        </div>
      )}

      {issuanceModalData && (
        <IssuanceModal
          txClient={txClient}
          open={issuanceModalOpen}
          onClose={() => setIssuanceModalOpen(false)}
          {...issuanceModalData}
        />
      )}

      {isInfoMode && <MoreInfo />}

      {isTxMode && (
        <TransactionModals
          metadata={onChainProjectMetadata}
          projectId={projectId}
          testProject={testProject}
          creditDenom={creditClassDenom || creditClassName}
        />
      )}
    </Box>
  );
}

export { ProjectDetails };
