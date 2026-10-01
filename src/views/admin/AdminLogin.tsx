'use client';

import React, { useState } from 'react';
import { signInWithEmail, signInWithGitHub } from '@/services/authService';

interface AdminLoginProps {
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingType, setLoadingType] = useState<'email' | 'github' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Vui lòng nhập đầy đủ Email và Mật khẩu.');
      return;
    }

    setIsLoading(true);
    setLoadingType('email');
    setErrorMsg(null);

    const { user, error } = await signInWithEmail(email, password);
    setIsLoading(false);
    setLoadingType(null);

    if (error || !user) {
      setErrorMsg(
        error ||
          'Đăng nhập không thành công. Hãy đảm bảo bạn đã tạo tài khoản trong Supabase Dashboard -> Authentication -> Users.'
      );
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setLoadingType('github');
    setErrorMsg(null);

    const { error } = await signInWithGitHub();
    if (error) {
      setIsLoading(false);
      setLoadingType(null);
      setErrorMsg(`Lỗi kết nối GitHub OAuth: ${error}`);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="login-header">
          <div className="login-badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            <span>Supabase Authentication</span>
          </div>
          <h1>Admin Portal</h1>
          <p>Đăng nhập bằng tài khoản Supabase của bạn</p>
        </div>

        {/* Status Alerts */}
        {errorMsg && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.85rem 1rem',
              borderRadius: '0.6rem',
              fontSize: '0.85rem',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.6rem',
              lineHeight: 1.4,
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0, marginTop: '2px' }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Đăng nhập Email & Password Supabase */}
        <form onSubmit={handlePasswordLogin}>
          <div className="admin-form-group">
            <label htmlFor="admin-email">Email tài khoản Supabase</label>
            <input
              id="admin-email"
              type="email"
              className="admin-input"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
              autoFocus
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="admin-password">Mật khẩu</label>
            <input
              id="admin-password"
              type="password"
              className="admin-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.8rem',
              background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
              border: 'none',
              borderRadius: '0.55rem',
              color: '#fff',
              fontWeight: 600,
              fontSize: '0.95rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 14px rgba(14, 165, 233, 0.3)',
            }}
          >
            {loadingType === 'email' ? (
              <>
                <div
                  style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }}
                />
                <span>Đang xác thực...</span>
              </>
            ) : (
              <span>Đăng nhập</span>
            )}
          </button>
        </form>

        {/* Hoặc đăng nhập bằng GitHub */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            margin: '1.5rem 0',
            color: '#64748b',
            fontSize: '0.8rem',
          }}
        >
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
          <span style={{ padding: '0 0.75rem' }}>HOẶC</span>
          <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
        </div>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGitHubLogin}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '0.55rem',
            color: '#cbd5e1',
            fontWeight: 500,
            fontSize: '0.9rem',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            transition: 'all 0.2s ease',
          }}
          onMouseOver={(e) => {
            if (!isLoading) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
          }}
          onMouseOut={(e) => {
            if (!isLoading) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          {loadingType === 'github' ? (
            <span>Đang kết nối GitHub...</span>
          ) : (
            <>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                ></path>
              </svg>
              <span>Đăng nhập bằng GitHub OAuth</span>
            </>
          )}
        </button>

        {/* Back to Portfolio Link */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center' }}>
          <a
            href="/vi/"
            style={{
              color: '#64748b',
              fontSize: '0.82rem',
              textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            ← Quay lại trang chủ Portfolio
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
