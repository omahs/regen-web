import React, { useState, useEffect } from 'react';
import { Field } from 'formik';

import SelectTextField, { Option } from './SelectTextField';
import { countries } from './countries';

interface FieldProps {
  className?: string;
}

const LocationCountryField: React.FC<FieldProps> = ({ className }) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const countriesWithEmpty = Object.keys(countries).map(key => ({
      value: key,
      label: countries[key],
    }));
    countriesWithEmpty.unshift({ value: '', label: 'Please choose a country' });
    setOptions(countriesWithEmpty);
  }, []);

  return (
    <Field
      name="country"
      label="Country"
      component={SelectTextField}
      className={className}
      options={options}
    />
  );
};

export default LocationCountryField;
