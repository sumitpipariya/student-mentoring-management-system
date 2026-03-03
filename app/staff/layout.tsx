"use client";
import React, { useState } from 'react';
import StaffNavbar from '@/components/staff/StaffNavbar';
import StaffSidebar from '@/components/staff/StaffSidebar';
import styles from './staff.module.css';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  // Sync state for all components
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Dynamic values based on toggle state
  const sidebarWidth = isCollapsed ? '80px' : '280px';

  return (
    <div className="d-flex min-vh-100 bg-light-gray overflow-hidden">
      {/* 1. SIDEBAR: Uses dynamic width */}
      <aside 
        className="d-none d-lg-block bg-white border-end shadow-sm" 
        style={{ 
          width: sidebarWidth, 
          height: '100vh', 
          position: 'fixed', 
          left: 0, 
          top: 0, 
          zIndex: 1040,
          transition: 'width 0.3s ease' 
        }}
      >
        {/* Pass toggle function and state to sidebar */}
        <StaffSidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      </aside>

      {/* 2. MAIN WRAPPER: margin-left now reacts to the sidebar state */}
      <div 
        className="flex-grow-1 d-flex flex-column" 
        style={{ 
          marginLeft: sidebarWidth, 
          minHeight: '100vh',
          transition: 'margin-left 0.3s ease' 
        }}
      >
        <header style={{ height: '70px' }}>
          {/* Navbar also needs to know the width to stay aligned */}
          <StaffNavbar sidebarWidth={sidebarWidth} />
        </header>
        
        <main className="p-3 p-md-4 p-lg-3 flex-grow-1">
          <div className="container-fluid h-100">
            <div className={`card ${styles.contentCard} h-100 shadow-premium`}>
              <div className="card-body p-4 p-md-5">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}