import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

export default function Button({
  variant = 'primary', size = 'md', loading, children, className = '', as: Tag = 'button', href, ...rest
}: ButtonProps) {
  const cls = [
    'btn',
    `btn-${variant}`,
    size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '',
    className,
  ].filter(Boolean).join(' ');

  if (Tag === 'a') {
    return <a className={cls} href={href}>{children}</a>;
  }

  return (
    <button className={cls} disabled={loading || rest.disabled} {...rest}>
      {loading ? <span className="btn-spinner">●</span> : children}
    </button>
  );
}
