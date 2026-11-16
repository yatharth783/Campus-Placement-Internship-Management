import React from 'react';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';

const DashboardLayout = ({ children, title, subtitle, action }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {(title || action) && (
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                {title && <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>}
                {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
              </div>
              {action && <div>{action}</div>}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
