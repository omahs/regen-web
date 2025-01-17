const isRedwood = process.env.REACT_APP_LEDGER_CHAIN_ID === 'regen-redwood-1';

export const GRAVITY_USDC_DENOM = isRedwood
  ? 'eco.uC.NCT'
  : 'gravity0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
export const AXELAR_USDC_DENOM = isRedwood ? 'uausdc' : 'uusdc';
export const EEUR_DENOM = 'eeur';
export const REGEN_DENOM = 'uregen';

export const USD_DENOMS = [GRAVITY_USDC_DENOM, AXELAR_USDC_DENOM];
export const EUR_DENOMS = [EEUR_DENOM];
export const CAPITALIZED_DENOM = [REGEN_DENOM];
