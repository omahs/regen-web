import { OrderBy } from '@regen-network/api/lib/generated/cosmos/tx/v1beta1/service';
import { MsgBridge } from '@regen-network/api/lib/generated/regen/ecocredit/v1/tx';
import { useQueries, useQuery } from '@tanstack/react-query';

import { BridgedEcocredits } from 'types/ledger/ecocredit';
import { useLedger } from 'ledger';
import { client as sanityClient } from 'lib/clients/sanity';
import { messageActionEquals } from 'lib/ecocredit/constants';
import { getBridgeTxStatusQuery } from 'lib/queries/react-query/bridge/getBridgeTxStatusQuery/getBridgeTxStatusQuery';
import { getGetTxsEventQuery } from 'lib/queries/react-query/cosmos/bank/getTxsEventQuery/getTxsEventQuery';
import { getBatchQuery } from 'lib/queries/react-query/ecocredit/getBatchQuery/getBatchQuery';
import { getProjectQuery } from 'lib/queries/react-query/ecocredit/getProjectQuery/getProjectQuery';
import { getMetadataQuery } from 'lib/queries/react-query/registry-server/getMetadataQuery/getMetadataQuery';
import { getAllCreditClassesQuery } from 'lib/queries/react-query/sanity/getAllCreditClassesQuery/getAllCreditClassesQuery';

import { TxWithHash } from '../BridgedEcocreditsTable.types';
import { hasMessages } from '../BridgedEcocreditsTable.utils';

interface Props {
  address?: string;
}

interface Output {
  bridgedCredits: BridgedEcocredits[];
}

export const useFetchBridgedEcocredits = ({ address }: Props): Output => {
  const { txClient, ecocreditClient } = useLedger();

  // AllCreditClasses
  const { data: creditClassData } = useQuery(
    getAllCreditClassesQuery({ sanityClient, enabled: !!sanityClient }),
  );

  // TxsEvent
  const { data: txsEventData } = useQuery(
    getGetTxsEventQuery({
      client: txClient,
      enabled: !!txClient,
      request: {
        events: [
          `${messageActionEquals}'/${MsgBridge.$type}'`,
          `message.sender='${address}'`,
        ],
        orderBy: OrderBy.ORDER_BY_DESC,
      },
    }),
  );

  const txsWithBody: TxWithHash[] =
    txsEventData?.txs
      .map(
        (tx, index): TxWithHash => ({
          ...tx,
          txHash: txsEventData.txResponses[index].txhash,
        }),
      )
      .filter(tx => !!tx.body) ?? [];

  // Tx Status
  const txsStatusResult = useQueries({
    queries: txsWithBody.map(tx =>
      getBridgeTxStatusQuery({
        request: { txHash: tx.txHash },
      }),
    ),
  });

  // Messages
  const txMessages = txsWithBody
    .map(tx =>
      tx.body?.messages.filter(m => m.typeUrl === `/${MsgBridge.$type}`),
    )
    .filter(hasMessages);

  // Credits
  const credits = txMessages
    .map(messages =>
      messages.map(message => MsgBridge.decode(message?.value).credits),
    )
    .flat(2);

  // Batches
  const batchesResult = useQueries({
    queries: credits.map(credit =>
      getBatchQuery({
        client: ecocreditClient,
        request: { batchDenom: credit.batchDenom },
      }),
    ),
  });
  const batches = batchesResult?.map(batchResult => batchResult.data) ?? [];
  const isBatchesLoading = batchesResult.some(
    batchResult => batchResult.isLoading,
  );

  // Projects
  const projectsResults = useQueries({
    queries: batches.map(batch =>
      getProjectQuery({
        request: {
          projectId: batch?.batch?.projectId,
        },
        client: ecocreditClient,
      }),
    ),
  });
  const projects = projectsResults.map(projectResult => projectResult.data);
  const isProjectsLoading = projectsResults.some(
    projectResult => projectResult.isLoading,
  );

  // Metadatas
  const metadatasResults = useQueries({
    queries: projects.map(project =>
      getMetadataQuery({ iri: project?.project?.metadata }),
    ),
  });
  const metadatas = metadatasResults.map(metadataResult => {
    return metadataResult.data;
  });
  const isMetadatasLoading = metadatasResults.some(
    metadataResult => metadataResult.isLoading,
  );

  // Normalization
  // Create normalizer based on normalizeEcocredits
  // normalizeClassProjectForBatch

  return { bridgedCredits: [] };
};
