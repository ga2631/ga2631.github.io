'use client';

import React, { useState, useEffect } from 'react';
import { getCurrentUser, signOut, onAuthStateChange } from '@/services/authService';
import { AdminLogin } from './AdminLogin';
import { AdminCvEditor } from './AdminCvEditor';
import { AdminBlogManager } from './AdminBlogManager';
import { User } from '@supabase/supabase-js';

export const AdminDashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeNav, setActiveNav] = useState<'cv' | 'blog'>('cv');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Check auth on mount
  useEffect(() => {
    async function checkAuth() {
      setIsAuthLoading(true);
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsAuthLoading(false);
    }
    checkAuth();

    const unsubscribe = onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
    showToast('Đã đăng xuất khỏi hệ thống quản trị.', 'success');
  };

  if (isAuthLoading) {
    return (
      <div className="admin-root" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            marginBottom: '1rem',
          }}
        />
        <p style={{ color: '#94a3b8' }}>Đang xác thực quyền quản trị...</p>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onSuccess={async () => setUser(await getCurrentUser())} />;
  }

  return (
    <div className="admin-root">
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            top: '1.5rem',
            right: '1.5rem',
            zIndex: 9999,
            padding: '0.85rem 1.25rem',
            borderRadius: '0.6rem',
            background: toast.type === 'success' ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backdropFilter: 'blur(8px)',
            animation: 'fadeInDown 0.3s ease-out',
          }}
        >
          {toast.type === 'success' ? '✅' : '⚠️'}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-container">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="sidebar-brand">
            <div className="brand-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                <polyline points="2 17 12 22 22 17"></polyline>
                <polyline points="2 12 12 17 22 12"></polyline>
              </svg>
              <span>CMS</span>
            </div>
            <span className="brand-badge">Admin</span>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-label">Quản Trị Phân Hệ</div>

            <button
              className={`nav-item ${activeNav === 'cv' ? 'active' : ''}`}
              onClick={() => setActiveNav('cv')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              <span>📄 Hồ sơ CV</span>
            </button>

            <button
              className={`nav-item ${activeNav === 'blog' ? 'active' : ''}`}
              onClick={() => setActiveNav('blog')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <span>✍️ Quản trị Blog</span>
            </button>

            <div className="nav-label" style={{ marginTop: '1rem' }}>Liên kết ngoài</div>

            <a
              href="/vi/"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item"
              style={{ textDecoration: 'none' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              <span>🌐 Xem Website</span>
            </a>
          </nav>

          <div className="sidebar-footer">
            <div className="user-info">
              <div className="user-avatar">
                {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="user-email" title={user.email || ''}>
                {user.email}
              </div>
            </div>

            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: '0.6rem',
                borderRadius: '0.4rem',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#f87171',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        </aside>

        {/* Main Workspace */}
        <main className="admin-main">
          <header className="admin-topbar">
            <div className="topbar-title">
              {activeNav === 'cv' ? '📄 Quản trị & Chỉnh sửa Hồ sơ CV' : '✍️ Quản trị Blog, Chuyên mục & Thẻ'}
            </div>
            <div className="topbar-actions">
              <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                Đồng bộ Supabase Database ⚡
              </span>
            </div>
          </header>

          <div className="admin-content">
            {activeNav === 'cv' ? (
              <AdminCvEditor onShowToast={showToast} />
            ) : (
              <AdminBlogManager onShowToast={showToast} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
