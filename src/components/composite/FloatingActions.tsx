import React from 'react';
import { CVData } from '../../types';
import { UITranslation } from '@/i18n';
import { ButtonFloatingScrollTop } from './ButtonFloatingScrollTop';
import { ButtonPrint } from './ButtonPrint';

export interface FloatingActionsProps {
  data?: CVData;
  tPrintCv?: UITranslation['printCv'];
  onPrint?: () => void;
  saveCvLabel: string;
  tCommon: UITranslation['common'];
  threshold?: number;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  data,
  tPrintCv,
  onPrint,
  saveCvLabel,
  tCommon,
  threshold = 320,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-auto" role="region" aria-label="Floating quick actions">
      <ButtonFloatingScrollTop threshold={threshold} tCommon={tCommon} />
      <ButtonPrint
        variant="floating"
        data={data}
        tPrintCv={tPrintCv}
        onPrint={onPrint || (() => window.print())}
        label={saveCvLabel}
        tCommon={tCommon}
      />
    </div>
  );
};

FloatingActions.displayName = 'FloatingActions';
