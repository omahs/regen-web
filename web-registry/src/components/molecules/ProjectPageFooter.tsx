import React from 'react';

import SaveFooter from 'web-components/lib/components/fixed-footer/SaveFooter';

import { useProjectEditContext } from '../../pages/ProjectEdit';
import { EditProjectPageFooter } from './EditProjectPageFooter';

interface Props {
  onSave: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  saveText?: string;
  saveDisabled: boolean;
}

const ProjectPageFooter: React.FC<React.PropsWithChildren<Props>> = ({
  saveText,
  saveDisabled,
  onSave,
  ...props
}) => {
  const { isEdit } = useProjectEditContext();

  return isEdit ? (
    <EditProjectPageFooter
      saveText={saveText || 'Save'}
      onSave={onSave}
      saveDisabled={saveDisabled}
    />
  ) : (
    <SaveFooter
      saveText={saveText || 'Save and Next'}
      onSave={onSave}
      onPrev={props.onPrev}
      onNext={props.onNext}
      hideProgress={false} // TODO
      saveDisabled={saveDisabled}
      percentComplete={0} // TODO
    />
  );
};

export { ProjectPageFooter };
