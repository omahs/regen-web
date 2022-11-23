import { getMetadata } from 'lib/metadata-graph';

import {
  ReactQueryMetadataProps,
  ReactQueryMetadataResponse,
} from './getMetadataQuery.types';

export const getMetadataQuery = ({
  iri,
  ...params
}: ReactQueryMetadataProps): ReactQueryMetadataResponse => ({
  queryKey: ['metadata', iri ?? ''],
  queryFn: async () => {
    return getMetadata(iri);
  },
  keepPreviousData: true,
  ...params,
});
