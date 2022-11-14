import React from 'react';
import MuiCheckbox from '@mui/material/Checkbox';
import { DefaultTheme as Theme, makeStyles } from '@mui/styles';
import { CheckboxProps as MuiCheckboxProps, fieldToCheckbox } from 'formik-mui';

import CheckedIcon from '../icons/CheckedIcon';
import UncheckedIcon from '../icons/UncheckedIcon';

interface CheckboxProps extends MuiCheckboxProps {
  triggerOnChange?: (v: any) => Promise<void>;
}

const useStyles = makeStyles((theme: Theme) => ({
  check: {
    height: theme.spacing(5),
    width: theme.spacing(5),
  },
}));

/** Custom styles on top of MUI's `Checkbox` component */
const Checkbox: React.FC<CheckboxProps> = (props: CheckboxProps) => {
  const classes = useStyles();
  const { form, field, triggerOnChange, disabled } = props;

  const onChange = (e: React.ChangeEvent<any>): void => {
    const value = e.target.checked;
    form.setFieldValue(field.name, value);
    if (triggerOnChange) {
      triggerOnChange(value);
    }
  };

  return (
    // @ts-ignore
    <MuiCheckbox
      {...fieldToCheckbox(props)}
      onChange={onChange}
      color="secondary"
      icon={<UncheckedIcon className={classes.check} />}
      checkedIcon={
        <CheckedIcon className={classes.check} disabled={disabled} />
      }
    />
  );
};

export default Checkbox;
