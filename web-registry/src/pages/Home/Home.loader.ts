import { QueryClient } from '@tanstack/react-query';

import { getEcocreditQueryClient } from 'lib/clients/ecocreditQueryClient';
import { getMarketplaceQueryClient } from 'lib/clients/marketplaceQueryClient';
import { getSimplePriceQuery } from 'lib/queries/react-query/coingecko/simplePrice/simplePriceQuery';
import { getProjectsQuery } from 'lib/queries/react-query/ecocredit/getProjectsQuery/getProjectsQuery';
import { getAllowedDenomQuery } from 'lib/queries/react-query/marketplace/getAllowedDenomQuery/getAllowedDenomQuery';
import { getSellOrdersQuery } from 'lib/queries/react-query/marketplace/getSellOrdersQuery/getSellOrdersQuery';
import { getAllCreditClassesQuery } from 'lib/queries/react-query/sanity/getAllCreditClassesQuery/getAllCreditClassesQuery';
import { getAllHomePageQuery } from 'lib/queries/react-query/sanity/getAllHomePageQuery/getAllHomePageQuery';
import { getFromCacheOrFetch } from 'lib/queries/react-query/utils/getFromCacheOrFetch';
import { getFromCacheOrFetchUnresolved } from 'lib/queries/react-query/utils/getFromCacheOrFetchUnresolved';

import { client as sanityClient } from '../../sanity';

type LoaderType = {
  queryClient: QueryClient;
};

export const homeLoader =
  ({ queryClient }: LoaderType) =>
  async ({ params }: { params: any }) => {
    // Clients
    const ecocreditClient = await getEcocreditQueryClient();
    const marketplaceClient = await getMarketplaceQueryClient();

    // Queries
    const allHomePageQuery = getAllHomePageQuery({ sanityClient });
    const allCreditClassesQuery = getAllCreditClassesQuery({ sanityClient });
    const simplePriceQuery = getSimplePriceQuery({});
    const projectsQuery = getProjectsQuery({
      client: ecocreditClient,
      request: {},
    });
    const sellOrdersQuery = getSellOrdersQuery({
      client: marketplaceClient,
      reactQueryClient: queryClient,
      request: {},
    });
    const allowedDenomQuery = getAllowedDenomQuery({
      client: marketplaceClient,
    });

    // Fetch or Cache

    // Mandatory data
    await getFromCacheOrFetch({
      query: allHomePageQuery,
      reactQueryClient: queryClient,
    });

    // Optionnal data
    getFromCacheOrFetchUnresolved({
      query: allCreditClassesQuery,
      reactQueryClient: queryClient,
    });
    getFromCacheOrFetchUnresolved({
      query: projectsQuery,
      reactQueryClient: queryClient,
    });
    getFromCacheOrFetchUnresolved({
      query: sellOrdersQuery,
      reactQueryClient: queryClient,
    });
    getFromCacheOrFetchUnresolved({
      query: allowedDenomQuery,
      reactQueryClient: queryClient,
    });
    getFromCacheOrFetchUnresolved({
      query: simplePriceQuery,
      reactQueryClient: queryClient,
    });

    return {};
  };