import React from 'react';
import { makeStyles, DefaultTheme as Theme } from '@mui/styles';
import { fieldToTextField, TextFieldProps } from 'formik-mui';
import MuiTextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import clsx from 'clsx';

import { DefaultStyleProps } from './FieldFormControl';
import InputLabel from './InputLabel';

// TODO: create styled component as described in issue: regen-network/regen-web/issues/955

interface TriggerTextFieldProps extends TextFieldProps {
  triggerOnChange?: (v: any) => Promise<void>;
  transformValue?: (v: any) => any;
}

export interface RegenTextFieldProps
  extends TriggerTextFieldProps,
    DefaultStyleProps {
  children?: any;
  errors?: boolean;
  optional?: boolean | string;
  startAdornment?: React.ReactNode;
  endAdornment?: React.ReactNode;
  step?: number;
  customInputProps?: { min?: number; max?: number };
}

interface StyleProps extends TextFieldProps {
  errors: boolean;
  optional: boolean;
}

const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
  root: props => ({
    '& label': {
      lineHeight: '140%',
      transform: 'scale(1)',
      color: theme.palette.primary.contrastText,
      fontWeight: 'bold',
      position: 'relative',
      textAlign: 'left',
      [theme.breakpoints.up('sm')]: {
        fontSize: theme.spacing(4.5),
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(4),
      },
      '&.Mui-focused': {
        display: 'block',
      },
      '&.Mui-disabled': {
        color: theme.palette.primary.contrastText,
      },
    },
    '& .MuiInputBase-formControl': {
      marginTop: props.label ? theme.spacing(2.25) : 0,
      [theme.breakpoints.up('sm')]: {
        marginBottom: props.errors ? theme.spacing(5.25) : 0,
      },
      [theme.breakpoints.down('sm')]: {
        marginBottom: props.errors ? theme.spacing(4.75) : 0,
      },
      '&.Mui-disabled': {
        backgroundColor: theme.palette.info.light,
      },
    },
    '& .MuiFormHelperText-root': {
      fontWeight: 'bold',
      color: theme.palette.primary.light,
      position: props.errors ? 'absolute' : 'inherit',
      bottom: 0,
      [theme.breakpoints.up('sm')]: {
        fontSize: theme.spacing(3.5),
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(3),
      },
      '&.MuiFormHelperText-filled': {
        color: theme.palette.info.main,
      },
      '&.Mui-error': {
        color: theme.palette.error.main,
      },
    },
    '& .MuiSvgIcon-root': {
      width: theme.spacing(3.25),
      height: theme.spacing(2.5),
      top: 'calc(50% - 5px)',
      [theme.breakpoints.up('sm')]: {
        right: theme.spacing(3.75),
      },
      [theme.breakpoints.down('sm')]: {
        right: theme.spacing(3.25),
      },
      position: 'absolute',
      pointerEvents: 'none',
    },
    '& .MuiInputBase-root': {
      backgroundColor: theme.palette.primary.main,
      border: `1px solid ${theme.palette.grey[100]}`,
      borderRadius: '2px',
      [theme.breakpoints.up('sm')]: {
        paddingLeft: theme.spacing(3.75),
        paddingRight: theme.spacing(3.75),
        fontSize: theme.spacing(4.5),
        height: theme.spacing(15), // 11.25
      },
      [theme.breakpoints.down('sm')]: {
        paddingLeft: theme.spacing(3.25),
        paddingRight: theme.spacing(3.25),
        fontSize: theme.spacing(4),
        height: theme.spacing(12.5), // 8.75
      },
      '& .MuiInputAdornment-root p': {
        color: theme.palette.info.main,
      },
      '&.Mui-error': {
        '& input, & .MuiSelect-select': {
          borderColor: theme.palette.error.main,
        },
      },
    },
    // '& input, & select.MuiSelect-select': {},
    '& input[type=number]': {
      '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
        '-webkit-appearance': 'none',
        margin: 0,
      },
    },
  }),
  firstOfType: {
    '&:first-of-type': {
      marginTop: 0,
    },
  },
  default: {
    [theme.breakpoints.up('sm')]: {
      marginTop: theme.typography.pxToRem(40),
    },
    [theme.breakpoints.down('sm')]: {
      marginTop: theme.typography.pxToRem(33),
    },
  },
}));

function TriggerTextField({
  triggerOnChange,
  transformValue,
  ...props
}: TriggerTextFieldProps): JSX.Element {
  const {
    form: { setFieldValue },
    field: { name },
  } = props;
  const onChange = async (event: any): Promise<void> => {
    const { value } = event.target;
    if (triggerOnChange) {
      await triggerOnChange(value);
    }
    setFieldValue(name, transformValue ? transformValue(value) : value);
  };
  return <MuiTextField {...fieldToTextField(props)} onChange={onChange} />;
}

export default function RegenTextField({
  transformValue,
  triggerOnChange,
  errors = false,
  optional = false,
  defaultStyle = true,
  forceDefaultStyle = false,
  children,
  startAdornment,
  endAdornment,
  customInputProps = {},
  ...props
}: RegenTextFieldProps): JSX.Element {
  const styles = useStyles({ ...props, errors, optional: !!optional });
  const baseClasses = [styles.root, props.className];
  const defaultClasses = [styles.default, ...baseClasses];
  const rootClasses = defaultStyle
    ? forceDefaultStyle
      ? defaultClasses
      : [...defaultClasses, styles.firstOfType]
    : baseClasses;

  return (
    <TriggerTextField
      {...props}
      variant="standard"
      transformValue={transformValue}
      triggerOnChange={triggerOnChange}
      className={clsx(rootClasses)}
      InputProps={{
        disableUnderline: true,
        startAdornment: startAdornment ? (
          <InputAdornment position="start">{startAdornment}</InputAdornment>
        ) : null,
        endAdornment: endAdornment ? (
          <InputAdornment position="end">{endAdornment}</InputAdornment>
        ) : null,
        inputProps: { ...customInputProps },
      }}
      label={
        <InputLabel optional={!!optional} focused={false} required={false}>
          {props.label}
        </InputLabel>
      }
      InputLabelProps={{ focused: false, required: false }}
      fullWidth
    >
      {children}
    </TriggerTextField>
  );
}
