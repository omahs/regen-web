import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import { useLedger } from 'ledger';
import { getSellOrdersExtentedQuery } from 'lib/queries/react-query/marketplace/getSellOrdersExtentedQuery/getSellOrdersExtentedQuery';

import { SellOrderInfoExtented } from 'hooks/useQuerySellOrders';

type UseFetchSellOrdersResponse = {
  sellOrders: SellOrderInfoExtented[] | undefined;
  refetchSellOrders: () => Promise<SellOrderInfoExtented[] | undefined>;
};

export const useFetchSellOrders = (): UseFetchSellOrdersResponse => {
  const { marketplaceClient } = useLedger();
  const reactQueryClient = useQueryClient();
  const sellOrdersQuery = getSellOrdersExtentedQuery({
    enabled: !!marketplaceClient,
    client: marketplaceClient,
    reactQueryClient,
    request: {},
  });
  const { data: sellOrders } = useQuery(sellOrdersQuery);
  const refetchSellOrders = useCallback(async (): Promise<
    SellOrderInfoExtented[] | undefined
  > => {
    await reactQueryClient.invalidateQueries({
      queryKey: sellOrdersQuery.queryKey,
    });
    return await reactQueryClient.fetchQuery(sellOrdersQuery);
  }, [reactQueryClient, sellOrdersQuery]);

  return { sellOrders, refetchSellOrders };
};
