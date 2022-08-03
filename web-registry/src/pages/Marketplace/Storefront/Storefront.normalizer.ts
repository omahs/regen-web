import { SellOrderInfo } from '@regen-network/api/lib/generated/regen/ecocredit/marketplace/v1/query';
import {
  ProjectInfo,
  QueryBatchResponse,
} from '@regen-network/api/lib/generated/regen/ecocredit/v1/query';
import { NormalizedSellOrder } from './Storefront.types';
import { AllProjectsQuery } from '../../../generated/graphql';

/* normalizeprojectsInfosByHandleMap */

type NormalizeprojectsInfosByHandleMapProps = {
  offChainProjects: AllProjectsQuery['allProjects'];
  onChainProjects?: ProjectInfo[];
};

// eslint-disable-next-line
export const normalizeProjectsInfosByHandleMap = ({
  offChainProjects,
  onChainProjects = [],
}: NormalizeprojectsInfosByHandleMapProps) => {
  const projectsMap = new Map<
    string,
    { name: string; classIdName: string; classIdUrl: string }
  >();

  offChainProjects?.nodes?.forEach(project => {
    const isVCSProject = !!project?.metadata?.['regen:vcsProjectId'];
    const creditClass = project?.creditClassByCreditClassId;
    const creditClassVersion = creditClass?.creditClassVersionsById?.nodes[0];

    if (project?.handle) {
      projectsMap.set(project?.handle, {
        name: project?.handle,
        classIdName: creditClassVersion?.name ?? '',
        classIdUrl: isVCSProject
          ? creditClass?.onChainId
          : creditClassVersion?.metadata?.['http://schema.org/url']?.['@value'],
      });
    }
  });

  onChainProjects.forEach(project => {
    projectsMap.set(project?.id, {
      name: project?.id,
      classIdName: project?.classId,
      classIdUrl: project?.classId,
    });
  });

  return projectsMap;
};

/* normalizeSellOrders */

type NormalizedSellOrderProps = {
  sellOrders?: SellOrderInfo[];
  batchInfos?: QueryBatchResponse[];
  projectsInfosByHandleMap: Map<
    string,
    { name: string; classIdName: string; classIdUrl: string }
  >;
};

export const normalizeSellOrders = ({
  batchInfos,
  sellOrders = [],
  projectsInfosByHandleMap,
}: NormalizedSellOrderProps): NormalizedSellOrder[] =>
  sellOrders.map(
    (
      { askAmount, askDenom, batchDenom, id, quantity, seller, expiration },
      index,
    ) => {
      const currentBatch = batchInfos?.[index]?.batch;
      const projectId = currentBatch?.projectId ?? '';
      const isLoading =
        currentBatch === undefined || projectsInfosByHandleMap.size === 0;

      return {
        id: String(id),
        expiration,
        project: {
          name: isLoading
            ? undefined
            : projectsInfosByHandleMap.get(projectId)?.name ?? null,
          id: projectId,
          classIdName: isLoading
            ? undefined
            : projectsInfosByHandleMap.get(projectId)?.classIdName ?? null,
          classIdUrl: isLoading
            ? undefined
            : projectsInfosByHandleMap.get(projectId)?.classIdUrl ?? null,
        },
        status: 'Partially filled',
        askAmount,
        askDenom,
        amountAvailable: quantity,
        amountSold: undefined,
        batchDenom,
        batchStartDate: isLoading ? undefined : currentBatch?.startDate ?? null,
        batchEndDate: isLoading ? undefined : currentBatch?.endDate ?? null,
        seller,
      };
    },
  );