import React from 'react';
import { makeStyles, DefaultTheme as Theme } from '@mui/styles';
import Typography from '@mui/material/Typography';
import { Variant } from '@mui/material/styles/createTypography';

interface GaugeTextProps {
  number: number;
  label: string;
  format?: boolean;
  variant?: Variant;
}

const useStyles = makeStyles((theme: Theme) => ({
  number: {
    fontFamily: theme.typography.h1.fontFamily,
    fontWeight: 900,
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.5rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1.125rem',
    },
  },
  text: {
    // fontSize: '0.75rem',
    color: theme.palette.info.dark,
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.125rem',
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '0.85rem',
    },
  },
}));

export default function GaugeText({
  number,
  label,
  format,
  variant,
}: GaugeTextProps): JSX.Element {
  const classes = useStyles({});
  const displayedNumber: string = format
    ? new Intl.NumberFormat('en-US').format(number)
    : number.toString();
  return (
    <Typography variant={variant || 'body1'}>
      <span className={classes.number}>{displayedNumber} </span>
      <span className={classes.text}>{label}</span>
    </Typography>
  );
}
