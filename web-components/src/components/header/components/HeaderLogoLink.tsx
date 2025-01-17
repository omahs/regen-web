import React, { useEffect, useState } from 'react';
import { makeStyles } from 'tss-react/mui';

import RegenIcon from '../../icons/RegenIcon';

type UseStylesParams = {
  isLoaded: boolean;
};

const useStyles = makeStyles<UseStylesParams>()((theme, { isLoaded }) => {
  const { pxToRem } = theme.typography;

  return {
    icon: {
      display: isLoaded ? 'block' : 'inline-block',
      height: 'auto',
      width: pxToRem(186),
      [theme.breakpoints.down('md')]: {
        width: pxToRem(111),
      },
      [theme.breakpoints.down('sm')]: {
        width: pxToRem(104),
      },
    },
  };
});

export const HeaderLogoLink: React.FC<
  React.PropsWithChildren<{ color: string }>
> = ({ color }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { classes: styles } = useStyles({ isLoaded });

  // TODO: this is a hack to make the SVG render properly in safari - it's not a
  // perfect solution but should work until we can dedicate time to find
  // something more long-term. You can see the bug by visiting the /community
  // page in safari
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.location &&
      window.location.href
    )
      setIsLoaded(i => !i);
  }, []);

  return (
    <a href="/">
      <RegenIcon className={styles.icon} color={color} />
    </a>
  );
};
