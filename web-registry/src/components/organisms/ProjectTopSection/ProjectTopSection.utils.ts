import { User } from 'web-components/lib/components/user/UserInfo';

// TODO
// This is a temporary hack to show Regen as a Project Admin when applicable

const addressesMap = [
  'regen123a7e9gvgm53zvswc6daq7c85xtzt8263lgasm', // Mainnet - Credit classes
  'regen1v2ncquer9r2ytlkxh2djmmsq3e8we6rjc9snfn', // Mainnet - Projects
  'regen1df675r9vnf7pdedn4sf26svdsem3ugavgxmy46', // Redwood - Shared dev account
];

export const getDisplayAdmin = (address: string): User | undefined => {
  if (addressesMap.includes(address)) {
    return {
      name: 'Regen Network Development, Inc',
      type: 'ORGANIZATION',
      image: 'https://regen-registry.s3.amazonaws.com/regen-logo-green.svg',
      description:
        'Regen Network realigns the agricultural economy with ecological health by creating the global marketplace for planetary stewardship.',
    };
  }
  return;
};