'use client';

import React, { useState, useEffect } from 'react';
import { CmsLayout, CmsTab } from '@/components/layouts/CmsLayout';
import { CmsView } from '@/views/Cms';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<CmsTab>(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      const params = new URLSearchParams(search);
      const tabParam = params.get('tab') as CmsTab | null;
      if (tabParam) return tabParam;

      if (
        search.includes('error') ||
        hash.includes('error') ||
        search.includes('code') ||
        hash.includes('access_token')
      ) {
        return 'login';
      }
    }
    return 'dashboard';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      const params = new URLSearchParams(search);
      const tabParam = params.get('tab') as CmsTab | null;
      if (tabParam) {
        setActiveTab(tabParam);
      } else if (
        search.includes('error') ||
        hash.includes('error') ||
        search.includes('code') ||
        hash.includes('access_token')
      ) {
        setActiveTab('login');
      }
    }
  }, []);

  return (
    <CmsLayout activeTab={activeTab} onSelectTab={setActiveTab}>
      <CmsView activeTab={activeTab} onSelectTab={setActiveTab} />
    </CmsLayout>
  );
}
