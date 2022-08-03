import React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import { DefaultTheme as Theme, makeStyles } from '@mui/styles';
import clsx from 'clsx';

interface IconProps {
  className?: string;
  isActive?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: theme.spacing(9.25),
    height: theme.spacing(9.25),
  },
}));

function ShadedCreditsIcon({ className, isActive }: IconProps): JSX.Element {
  const classes = useStyles();

  return (
    <SvgIcon
      className={clsx(className, classes.root)}
      width="90"
      height="97"
      viewBox="0 0 90 97"
      xmlns="http://www.w3.org/2000/svg"
    >
      <svg
        width="90"
        height="97"
        viewBox="0 0 90 97"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M23.3064 11.6532L4.99414 16.6474V69.0871L10.8208 74.9137L22.474 76.5785L32.4625 74.9137V49.9425V32.4626L44.1158 27.4683L62.428 29.1331L66.5899 35.7921L68.2547 69.0871H77.4108L85.7345 63.2605L89.064 11.6532L84.0698 6.65895L69.087 2.49707L51.6072 9.15607V25.8036L39.1215 26.6359L39.9539 19.1446L23.3064 11.6532Z"
          fill="#EFEFEF"
        />
        <path
          d="M43.2834 27.4673L33.2949 34.9587V86.5659L43.2834 92.3925L58.2662 93.2249L67.4223 84.9012L68.2547 34.9587L58.2662 27.4673H43.2834Z"
          fill="white"
        />
        <path
          d="M4.12866 38.0815C4.12866 43.3582 11.8503 47.6358 21.3755 47.6358C25.5973 47.6358 29.4647 46.7954 32.4626 45.4003"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M4.03394 45.7495C4.03394 51.0262 11.7556 55.3037 21.2808 55.3037C25.5472 55.3037 29.4518 54.4455 32.4628 53.0238"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M4.03394 52.9028C4.03394 58.1795 11.7556 62.4571 21.2808 62.4571C25.5472 62.4571 29.4518 61.5989 32.4628 60.1771"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M4.03394 60.0562C4.03394 65.3328 11.7556 69.6104 21.2808 69.6104C25.4543 69.6104 29.2816 68.7891 32.2649 67.4225"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M4.09302 21.4858V67.2665C4.09302 72.5431 11.8147 76.8207 21.3398 76.8207C25.2188 76.8207 28.7987 76.1113 31.6798 74.9139M38.5866 22.0581V28.5002"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="3"
        />
        <path
          d="M4.12866 60.0762C4.12866 65.3528 11.8503 69.6304 21.3755 69.6304C22.5813 69.6304 23.7582 69.5618 24.8942 69.4314"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M4.12866 52.9102C4.12866 58.1868 11.8503 62.4644 21.3755 62.4644C22.212 62.4644 23.0346 62.4314 23.8393 62.3676"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M4.12866 45.7446C4.12866 51.0213 11.8503 55.2988 21.3755 55.2988C22.212 55.2988 23.0346 55.2658 23.8393 55.2021"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <ellipse
          cx="21.3755"
          cy="21.3115"
          rx="17.2468"
          ry="9.55422"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="3"
        />
        <path
          d="M4.12866 30.0698C4.12866 35.3465 11.8503 39.624 21.3755 39.624C25.5276 39.624 29.337 38.8112 32.3135 37.4572"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M86.8053 38.0049C86.8053 43.4414 79.0836 47.8486 69.5585 47.8486C68.6754 47.8486 67.8078 47.8107 66.9604 47.7377"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M86.8053 30.1318C86.8053 35.5684 79.0836 39.9756 69.5585 39.9756C68.6754 39.9756 67.8078 39.9377 66.9604 39.8646"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M86.8052 45.3745C86.8052 50.8111 79.0835 55.2183 69.5584 55.2183C68.2524 55.2183 66.9804 55.1354 65.7576 54.9784"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M86.8052 52.7451C86.8052 58.1817 79.0836 62.5889 69.5584 62.5889C68.8351 62.5889 68.1222 62.5634 67.4224 62.5141"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M52.3708 13.0059V25.8036M86.8645 13.5955V60.1738C86.8645 65.6103 79.1428 70.0175 69.6177 70.0175C68.5848 70.0175 67.5731 69.9657 66.5901 69.8663"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="3"
        />
        <ellipse
          cx="69.6531"
          cy="12.8262"
          rx="17.2468"
          ry="9.84374"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="3"
        />
        <path
          d="M86.9 21.8501C86.9 27.2866 79.1784 31.6938 69.6532 31.6938C68.2566 31.6938 66.8988 31.5991 65.5984 31.4202"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M66.9231 53.4111C66.9231 58.8477 59.2014 63.2549 49.6763 63.2549C40.1511 63.2549 32.4294 58.8477 32.4294 53.4111"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M66.8281 61.3115C66.8281 66.7481 59.1064 71.1553 49.5813 71.1553C40.0561 71.1553 32.3345 66.7481 32.3345 61.3115"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M66.8281 68.6812C66.8281 74.1177 59.1064 78.5249 49.5813 78.5249C40.0561 78.5249 32.3345 74.1177 32.3345 68.6812"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M66.8281 76.0518C66.8281 81.4883 59.1064 85.8955 49.5813 85.8955C40.0561 85.8955 32.3345 81.4883 32.3345 76.0518"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M32.3938 36.3125V83.4804C32.3938 88.917 40.1155 93.3242 49.6406 93.3242C59.1658 93.3242 66.8874 88.917 66.8874 83.4804V36.9021"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="3"
        />
        <path
          d="M32.4294 76.0723C32.4294 81.5088 40.1511 85.916 49.6763 85.916C50.8821 85.916 52.059 85.8454 53.195 85.711"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M32.4294 68.689C32.4294 74.1255 40.1511 78.5327 49.6763 78.5327C50.5128 78.5327 51.3354 78.4987 52.1401 78.433"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <path
          d="M32.4292 61.3066C32.4292 66.7432 40.1509 71.1504 49.676 71.1504C50.5125 71.1504 51.3352 71.1164 52.1398 71.0507"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
        <ellipse
          cx="49.676"
          cy="36.1328"
          rx="17.2468"
          ry="9.84374"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="3"
        />
        <path
          d="M66.9228 45.1567C66.9228 50.5933 59.2012 55.0005 49.676 55.0005C40.1509 55.0005 32.4292 50.5933 32.4292 45.1567"
          stroke={isActive ? '#4FB573' : '#8F8F8F'}
          strokeWidth="1.5"
        />
      </svg>
    </SvgIcon>
  );
}

export default ShadedCreditsIcon;
