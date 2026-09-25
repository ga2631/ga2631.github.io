import Link from 'next/link';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--color-bg-primary, #0f172a)',
        color: 'var(--color-text-primary, #f8fafc)',
      }}
    >
      <h1
        style={{
          fontSize: '4rem',
          fontWeight: '800',
          marginBottom: '1rem',
          color: 'var(--color-primary-500, #3b82f6)',
        }}
      >
        404
      </h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1.5rem' }}>
        Page Not Found
      </h2>
      <p
        style={{
          maxWidth: '480px',
          marginBottom: '2rem',
          color: 'var(--color-text-secondary, #94a3b8)',
          lineHeight: 1.6,
        }}
      >
        The page you are looking for might have been moved or doesn't exist.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          background: 'var(--color-primary-600, #2563eb)',
          color: '#ffffff',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}
