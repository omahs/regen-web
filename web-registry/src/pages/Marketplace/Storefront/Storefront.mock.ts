import { SellOrder } from './Storefront.types';

export const sellOrdersMock: SellOrder[] = [
  {
    id: '1',
    seller: 'regen1qwa9xy0997j5mrc4dxn7jrcvvkpm3uwuldkrmg',
    batch_denom: 'C02-001-19930101-20031031-001',
    quantity: '4.2',
    ask_denom: 'uregen',
    ask_amount: '17',
    disable_auto_retire: false,
    expiration: '1970-01-01T00:00:00Z',
  },
  {
    id: '2',
    seller: 'regen1df675r9vnf7pdedn4sf26svdsem3ugavgxmy46',
    batch_denom: 'C02-001-19930101-20031031-001',
    quantity: '100',
    ask_denom: 'uregen',
    ask_amount: '20',
    disable_auto_retire: false,
    expiration: '2023-12-31T00:00:00Z',
  },
  {
    id: '3',
    seller: 'regen1df675r9vnf7pdedn4sf26svdsem3ugavgxmy46',
    batch_denom: 'C02-001-19930101-20031031-001',
    quantity: '200',
    ask_denom: 'uregen',
    ask_amount: '10',
    disable_auto_retire: true,
    expiration: '2024-12-31T00:00:00Z',
  },
  {
    id: '4',
    seller: 'regen1df675r9vnf7pdedn4sf26svdsem3ugavgxmy46',
    batch_denom: 'C02-001-19930101-20031031-001',
    quantity: '300',
    ask_denom: 'uregen',
    ask_amount: '15',
    disable_auto_retire: false,
    expiration: '2024-01-01T00:00:00Z',
  },
  {
    id: '5',
    seller: 'regen1df675r9vnf7pdedn4sf26svdsem3ugavgxmy46',
    batch_denom: 'C02-001-19930101-20031031-001',
    quantity: '100',
    ask_denom: 'uregen',
    ask_amount: '11',
    disable_auto_retire: false,
    expiration: '2023-12-31T00:00:00Z',
  },
  {
    id: '6',
    seller: 'regen1df675r9vnf7pdedn4sf26svdsem3ugavgxmy46',
    batch_denom: 'C02-001-19930101-20031031-001',
    quantity: '200',
    ask_denom: 'uregen',
    ask_amount: '8',
    disable_auto_retire: true,
    expiration: '2024-12-31T00:00:00Z',
  },
  {
    id: '7',
    seller: 'regen1df675r9vnf7pdedn4sf26svdsem3ugavgxmy46',
    batch_denom: 'C02-001-19930101-20031031-001',
    quantity: '300',
    ask_denom: 'uregen',
    ask_amount: '7',
    disable_auto_retire: false,
    expiration: '2024-01-01T00:00:00Z',
  },
];

export const txHashMock =
  '7C360FC90740051EBC00C74E845C413D5E38BABC05689DB54EA6062F4B6E6417';
