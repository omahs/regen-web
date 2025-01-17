import { getEcocreditQueryClient } from 'lib/clients/regen/ecocredit/ecocreditQueryClient';
import { queryProject } from 'lib/ecocredit/api';

import {
  ReactQueryProjectProps,
  ReactQueryProjectResponse,
} from './getProjectQuery.types';

export const getProjectQuery = ({
  request,
  client,
  ...params
}: ReactQueryProjectProps): ReactQueryProjectResponse => ({
  queryKey: ['project', request.projectId ?? ''],
  queryFn: async () => {
    const clientInstance = client ?? (await getEcocreditQueryClient());
    try {
      return await queryProject({
        request,
        client: clientInstance,
      });
    } catch (e) {
      return null;
    }
  },
  ...params,
});
