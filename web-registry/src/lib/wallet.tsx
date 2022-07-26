import React, { useEffect, useState, createContext } from 'react';
import { SigningStargateClient, DeliverTxResponse } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Window as KeplrWindow } from '@keplr-wallet/types';

import { truncate } from 'web-components/lib/utils/truncate';

import { ledgerRPCUri, ledgerRESTUri, chainId } from './ledger';

const AUTO_CONNECT_WALLET_KEY = 'auto_connect_wallet';
const KEPLR_WALLET_EXTENSION = 'keplr-wallet-extension';
const chainName = process.env.REACT_APP_LEDGER_CHAIN_NAME;
const emptySender = { address: '', shortAddress: '' };
const defaultClientOptions = {
  broadcastPollIntervalMs: 1000,
  broadcastTimeoutMs: 600000,
};

export interface Wallet {
  offlineSigner?: OfflineSigner;
  address: string;
  shortAddress: string;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

type ContextType = {
  wallet?: Wallet;
  loaded: boolean;
  connect?: () => Promise<void>;
  disconnect?: () => void;
  connectionType?: string;
  error?: unknown;

  // TODO: remove
  signSend?: (amount: number, recipient: string) => Promise<Uint8Array>;
  broadcast?: (txBytes: Uint8Array) => Promise<string>;
  txResult?: DeliverTxResponse;
  setTxResult: (txResult: DeliverTxResponse | undefined) => void;
};

export const chainInfo = {
  // Chain-id of the Regen chain.
  chainId: chainId || '',
  // The name of the chain to be displayed to the user.
  chainName: chainName || '',
  // RPC endpoint of the chain.
  rpc: ledgerRPCUri,
  // REST endpoint of the chain.
  rest: ledgerRESTUri,
  // Staking coin information
  stakeCurrency: {
    // Coin denomination to be displayed to the user.
    coinDenom: 'REGEN',
    // Actual denom (i.e. uatom, uscrt) used by the blockchain.
    coinMinimalDenom: 'uregen',
    // # of decimal points to convert minimal denomination to user-facing denomination.
    coinDecimals: 6,
    // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
    // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
    // coinGeckoId: ""
  },
  // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
  // The 'stake' button in Keplr extension will link to the webpage.
  // walletUrlForStaking: "",
  // The BIP44 path.
  bip44: {
    // You can only set the coin type of BIP44.
    // 'Purpose' is fixed to 44.
    coinType: 118,
  },
  // Bech32 configuration to show the address to user.
  bech32Config: {
    bech32PrefixAccAddr: 'regen',
    bech32PrefixAccPub: 'regenpub',
    bech32PrefixValAddr: 'regenvaloper',
    bech32PrefixValPub: 'regenvaloperpub',
    bech32PrefixConsAddr: 'regenvalcons',
    bech32PrefixConsPub: 'regenvalconspub',
  },
  // List of all coin/tokens used in this chain.
  currencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: 'REGEN',
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: 'uregen',
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: 6,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
    },
  ],
  // List of coin/tokens used as a fee token in this chain.
  feeCurrencies: [
    {
      // Coin denomination to be displayed to the user.
      coinDenom: 'REGEN',
      // Actual denom (i.e. uatom, uscrt) used by the blockchain.
      coinMinimalDenom: 'uregen',
      // # of decimal points to convert minimal denomination to user-facing denomination.
      coinDecimals: 6,
      // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
      // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
      // coinGeckoId: ""
    },
  ],
  // (Optional) The number of the coin type.
  // This field is only used to fetch the address from ENS.
  // Ideally, it is recommended to be the same with BIP44 path's coin type.
  // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
  // So, this is separated to support such chains.
  coinType: 118,
  // (Optional) This is used to set the fee of the transaction.
  // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
  // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
  // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
  gasPriceStep: {
    low: 0.01,
    average: 0.025,
    high: 0.04,
  },
};

const WalletContext = createContext<ContextType>({
  loaded: false,
  setTxResult: (txResult: DeliverTxResponse | undefined) => {},
});

export const WalletProvider: React.FC = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet>(emptySender);
  const [connectionType, setConnectionType] = useState<string | undefined>(
    undefined,
  );
  // Because initiating the wallet is asyncronous, when users enter the app, the wallet is seen as not loaded.
  // This is being used so that we display the "connect wallet" or the connected wallet address
  // only once we know what's the actual wallet connection status.
  const [loaded, setLoaded] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [txResult, setTxResult] = useState<DeliverTxResponse | undefined>(
    undefined,
  );

  const disconnect = (): void => {
    setWallet(emptySender);
    setConnectionType(undefined);
    localStorage.removeItem(AUTO_CONNECT_WALLET_KEY);
  };

  const connect = async (): Promise<void> => {
    try {
      await connectWallet();
      setConnectionType(KEPLR_WALLET_EXTENSION);
      localStorage.setItem(AUTO_CONNECT_WALLET_KEY, KEPLR_WALLET_EXTENSION);
    } catch (e) {
      setError(e);
    }
  };

  const connectWallet = async (): Promise<void> => {
    if (window.keplr && chainId) {
      await window.keplr.experimentalSuggestChain(chainInfo);

      // Enabling before using the Keplr is recommended.
      // This method will ask the user whether or not to allow access if they haven't visited this website.
      // Also, it will request user to unlock the wallet if the wallet is locked.
      await window.keplr.enable(chainId);

      const offlineSigner = window.getOfflineSigner
        ? window.getOfflineSigner(chainId)
        : undefined;
      const key = await window.keplr.getKey(chainId);
      if (key && key.bech32Address && offlineSigner) {
        const wallet = {
          offlineSigner,
          address: key.bech32Address,
          shortAddress: truncate(key.bech32Address),
        };
        setWallet(wallet);
      }
    } else if (!window.keplr) {
      throw new Error(
        'Please install Keplr extension to use Regen Ledger feature',
      );
    }
  };

  // Automatically connect wallet if connected before
  useEffect(() => {
    const tryConnectWallet = async (): Promise<void> => {
      try {
        await connectWallet();
      } catch (e) {
        setError(e);
      } finally {
        setLoaded(true);
      }
    };

    const autoConnectionType = localStorage.getItem(AUTO_CONNECT_WALLET_KEY);
    if (autoConnectionType) {
      tryConnectWallet();
    } else {
      setLoaded(true);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        wallet,
        loaded,
        connect,
        disconnect,
        connectionType,
        error,

        // TODO Remove
        txResult,
        setTxResult,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): ContextType => React.useContext(WalletContext);
