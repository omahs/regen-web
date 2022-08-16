import { useCallback, useEffect, useState } from 'react';
// TODO: move query client creation to the ledger context ?
import { QueryClientImpl } from '@regen-network/api/lib/generated/regen/ecocredit/v1/query';

import { useLedger } from '../ledger';
import {
  // types
  EcocreditQueryClient,
  EcocreditQueryProps,
  EcocreditQueryResponse,
  // queries
  queryBalance,
  queryBatchesByClass,
  queryBatchesByProject,
  queryBatchInfo,
  queryClasses,
  queryClassInfo,
  queryCreditTypes,
  queryProject,
  queryProjects,
  queryProjectsByAdmin,
} from '../lib/ecocredit/api';

// TODO - this hook is still missing batch query functionality
// TODO - this hook is still missing lazy query functionality

type QueryOutput<T> = {
  data: T | undefined;
  loading: boolean;
  error: Error | undefined;
};

export default function useEcocreditQuery<T extends EcocreditQueryResponse>({
  query,
  params,
}: EcocreditQueryProps): QueryOutput<T> {
  const { api } = useLedger();
  const [client, setClient] = useState<EcocreditQueryClient>();

  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  // TODO: see top of the file
  useEffect(() => {
    if (!api?.queryClient) return;
    if (client) return;
    setClient(new QueryClientImpl(api.queryClient));
  }, [api?.queryClient, client]);

  const balance = useCallback(
    (client, params) => queryBalance({ client, request: params }),
    [],
  );

  const batchInfo = useCallback(
    (client, params) => queryBatchInfo({ client, request: params }),
    [],
  );

  const batches = useCallback(
    (client, params) => queryBatchesByClass({ client, request: params }),
    [],
  );

  const batchesByProject = useCallback(
    (client, params) => queryBatchesByProject({ client, request: params }),
    [],
  );

  const classInfo = useCallback(
    (client, params) => queryClassInfo({ client, request: params }),
    [],
  );

  const classes = useCallback(
    (client, params) => queryClasses({ client, request: params }),
    [],
  );

  const creditTypes = useCallback(
    (client, params) => queryCreditTypes({ client, request: params }),
    [],
  );

  const projects = useCallback(
    (client, params) => queryProjects({ client, request: params }),
    [],
  );

  const projectsByAdmin = useCallback(
    (client, params) => queryProjectsByAdmin({ client, request: params }),
    [],
  );

  const project = useCallback(
    (client, params) => queryProject({ client, request: params }),
    [],
  );

  useEffect(() => {
    if (!client) return;
    if (!params) return;
    if (loading || data || error) return;

    setLoading(true);

    let response;
    switch (query) {
      case 'balance':
        response = balance(client, params);
        break;
      case 'batchInfo':
        response = batchInfo(client, params);
        break;
      case 'batches':
        response = batches(client, params);
        break;
      case 'batchesByProject':
        response = batchesByProject(client, params);
        break;
      case 'classInfo':
        response = classInfo(client, params);
        break;
      case 'classes':
        response = classes(client, params);
        break;
      case 'creditTypes':
        response = creditTypes(client, params);
        break;
      case 'projects':
        response = projects(client, params);
        break;
      case 'projectsByAdmin':
        response = projectsByAdmin(client, params);
        break;
      case 'project':
        response = project(client, params);
        break;
      default:
        setError(
          new Error(
            'You need to provide a valid ecocredit query name (ie. batchInfo)',
          ),
        );
        setLoading(false);
        break;
    }

    if (response) {
      response
        .then(response => setData(response as T))
        .catch(setError)
        .finally(() => setLoading(false));
    }
  }, [
    client,
    query,
    params,
    data,
    loading,
    error,
    balance,
    batchInfo,
    batches,
    classInfo,
    classes,
    creditTypes,
    projects,
    projectsByAdmin,
    project,
    batchesByProject,
  ]);

  return { data, loading, error };
}
