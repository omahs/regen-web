import { BuyCreditsValues } from './BuyCreditsModal';

export const getSellOrderLabel = (sellOrder: BuyCreditsValues | undefined) => {
  const { sellOrderId, price, askDenom = '', creditCount } = sellOrder || {};
  return `${sellOrderId} (${price} ${askDenom.substring(
    1,
  )}/credit: ${creditCount} credit(s) available)`;
};
