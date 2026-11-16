import React from 'react';

const Badge = ({ children, variant = 'default', size = 'md', className = '' }) => {
  const variantStyles = {
    default: 'bg-slate-100 text-slate-800 border-slate-200',
    primary: 'bg-brand-50 text-brand-700 border-brand-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    navy: 'bg-navy-50 text-navy-800 border-navy-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200'
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${
        variantStyles[variant] || variantStyles.default
      } ${sizeStyles[size] || sizeStyles.md} ${className}`}
    >
      {children}
    </span>
  );
};

export const StatusBadge = ({ status }) => {
  switch (status) {
    case 'Applied':
      return <Badge variant="primary">Applied</Badge>;
    case 'Under Review':
      return <Badge variant="warning">Under Review</Badge>;
    case 'Shortlisted':
      return <Badge variant="purple">Shortlisted</Badge>;
    case 'Selected':
      return <Badge variant="success">Selected 🎉</Badge>;
    case 'Rejected':
      return <Badge variant="danger">Rejected</Badge>;
    case 'active':
      return <Badge variant="success">Active</Badge>;
    case 'closed':
      return <Badge variant="default">Closed</Badge>;
    case 'verified':
      return <Badge variant="success">Verified</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending</Badge>;
    default:
      return <Badge variant="default">{status}</Badge>;
  }
};

export default Badge;
