import React, { Suspense } from 'react';
import { Box, SxProps } from '@mui/material';
import { useTheme } from '@mui/styles';

import { Center, Flex } from 'web-components/lib/components/box';
import BridgeIcon from 'web-components/lib/components/icons/BridgeIcon';
import { CreditBatchIcon } from 'web-components/lib/components/icons/CreditBatchIcon';
import { CreditClassIcon } from 'web-components/lib/components/icons/CreditClassIcon';
import CreditsIcon from 'web-components/lib/components/icons/CreditsIcon';
import { ProjectPageIcon } from 'web-components/lib/components/icons/ProjectPageIcon';
import { Spinner } from 'web-components/lib/components/icons/Spinner';
import Section from 'web-components/lib/components/section';
import { IconTabProps } from 'web-components/lib/components/tabs/IconTab';
import { IconTabs } from 'web-components/lib/components/tabs/IconTabs';

import { useWallet } from 'lib/wallet';

import { useQueryIfCreditClassAdmin } from 'hooks/useQueryIfCreditClassAdmin';
import { useQueryIfCreditClassCreator } from 'hooks/useQueryIfCreditClassCreator';
import { useQueryIfIssuer } from 'hooks/useQueryIfIssuer';
import { useQueryIfProjectAdmin } from 'hooks/useQueryIfProjectAdmin';

import MyCreditBatches from './MyCreditBatches';

const MyEcocredits = React.lazy(() => import('./MyEcocredits'));
const MyProjects = React.lazy(() => import('./MyProjects'));
const MyCreditClasses = React.lazy(() => import('./MyCreditClasses'));
const MyBridge = React.lazy(() => import('./MyBridge'));

const LazyLoad: React.FC = ({ children }) => (
  <Suspense
    fallback={
      <Center>
        <Spinner />
      </Center>
    }
  >
    {children}
  </Suspense>
);

const sxs = {
  padTop: { pt: 10, pb: [21.25, 28.28] } as SxProps,
};

const Dashboard = (): JSX.Element => {
  const theme = useTheme();
  const isIssuer = useQueryIfIssuer();
  const isCreditClassCreator = useQueryIfCreditClassCreator();
  const isCreditClassAdmin = useQueryIfCreditClassAdmin();
  const isProjectAdmin = useQueryIfProjectAdmin();
  const walletContext = useWallet();
  const showProjectTab = isIssuer || isProjectAdmin;
  const showCreditClassTab = isCreditClassCreator || isCreditClassAdmin;

<<<<<<< HEAD
  // TODO: We should handle these as nested routes, converting this to an
  // <Outlet> layout component if we think we'll need to route to a page
  // directly. See:
  // https://reactrouter.com/docs/en/v6/getting-started/overview#nested-routes
  const tabs: IconTabProps[] = [
    {
      label: 'Portfolio',
      icon: (
        <CreditsIcon color={theme.palette.secondary.main} fontSize="small" />
      ),
      content: <LazyLoad>{<MyEcocredits />}</LazyLoad>,
    },
    {
      label: 'Projects',
      icon: <ProjectPageIcon />,
      hidden: !showProjectTab,
      content: (
        <LazyLoad>
          <Flex sx={sxs.padTop}>
            <MyProjects isIssuer={isIssuer} isProjectAdmin={isProjectAdmin} />
          </Flex>
        </LazyLoad>
      ),
    },
    {
      label: 'Credit Classes',
      icon: <CreditClassIcon sx={{ opacity: '70%' }} />,
      hidden: !showCreditClassTab,
      content: (
        <LazyLoad>
          <Flex sx={sxs.padTop}>
            <MyCreditClasses
              isCreditClassCreator={isCreditClassCreator}
              isCreditClassAdmin={isCreditClassAdmin}
            />
          </Flex>
        </LazyLoad>
      ),
    },
    {
      label: 'Credit Batches',
      icon: (
        <CreditBatchIcon sx={{ color: 'secondary.dark', opacity: '70%' }} />
      ),
      hidden: !isIssuer,
      content: (
        <LazyLoad>
          <Flex sx={sxs.padTop}>
            <MyCreditBatches address={walletContext?.wallet?.address} />
          </Flex>
        </LazyLoad>
      ),
    },
    {
      label: 'Bridge',
      icon: <BridgeIcon />,
      content: (
        <LazyLoad>
          <Flex sx={sxs.padTop}>
            <MyBridge />
          </Flex>
        </LazyLoad>
      ),
    },
  ];
=======
  const tabs: IconTabProps[] = useMemo(
    () => [
      {
        label: 'Portfolio',
        icon: (
          <CreditsIcon color={theme.palette.secondary.main} fontSize="small" />
        ),
        href: '/ecocredits/portfolio',
      },
      {
        label: 'Projects',
        icon: <ProjectPageIcon />,
        href: '/ecocredits/projects',
        hidden: !showProjectTab,
      },
      {
        label: 'Credit Classes',
        icon: <CreditClassIcon sx={{ opacity: '70%' }} />,
        href: '/ecocredits/credit-classes',
        hidden: !showCreditClassTab,
      },
      {
        label: 'Credit Batches',
        icon: (
          <CreditBatchIcon sx={{ color: 'secondary.dark', opacity: '70%' }} />
        ),
        href: '/ecocredits/credit-batches',
        hidden: !isIssuer,
      },
      {
        label: 'Bridge',
        icon: <BridgeIcon />,
        href: '/ecocredits/bridge',
        hidden: process.env.REACT_APP_LEDGER_CHAIN_ID === 'regen-1', // TODO: Hide in PROD - remove when Bridge is ready
      },
    ],
    [
      isIssuer,
      showCreditClassTab,
      showProjectTab,
      theme.palette.secondary.main,
    ],
  );

  const activeTab = Math.max(
    tabs.findIndex(tab => location.pathname.includes(tab.href ?? '')),
    0,
  );
>>>>>>> f37835ac (chore: feature flag to temporarily hide Bridge tab in mainnet (regen-1) (#1568))

  return (
    <Box sx={{ bgcolor: 'grey.50' }}>
      <Section>
        <IconTabs aria-label="dashboard tabs" tabs={tabs} mobileFullWidth />
      </Section>
    </Box>
  );
};

export { Dashboard };
