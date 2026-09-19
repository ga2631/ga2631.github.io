import React from 'react';
import { UITranslation } from '../data/cvData.ts';
import { ButtonFloatingScrollTop, ButtonPrint } from './composite';

export interface FloatingActionsProps {
  onPrint?: () => void;
  saveCvLabel: string;
  tCommon: UITranslation['common'];
  threshold?: number;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onPrint,
  saveCvLabel,
  tCommon,
  threshold = 320,
}) => {
  return (
    <div className="floating-actions-container" role="region" aria-label="Floating quick actions">
      <ButtonFloatingScrollTop threshold={threshold} tCommon={tCommon} />
      <ButtonPrint
        variant="floating"
        onPrint={onPrint}
        label={saveCvLabel}
        tCommon={tCommon}
      />
    </div>
  );
};

FloatingActions.displayName = 'FloatingActions';
