'use client';

import React, { useState } from 'react';
import { CmsLayout, CmsTab } from '@/components/layouts/CmsLayout';
import { CmsView } from '@/views/Cms';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<CmsTab>('dashboard');

  return (
    <CmsLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      <CmsView activeTab={activeTab} onSelectTab={setActiveTab} />
    </CmsLayout>
  );
}
