"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function StaffNavbar({ sidebarWidth }: { sidebarWidth: string }) {
  // 1. Logic to handle dropdown open/close state
  const [isOpen, setIsOpen] = useState(false);
  const [staffName, setStaffName] = useState("Loading...");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/staff/layout')
      .then(res => res.json())
      .then(data => {
        if (data.staffName) {
          setStaffName(data.staffName);
        }
      })
      .catch(err => console.error("Failed to fetch staff name:", err));
  }, []);

  // 2. Logic to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg bg-white border-bottom px-4"
      style={{
        height: '70px',
        position: 'fixed',
        right: 0,
        left: sidebarWidth,
        top: 0,
        zIndex: 1030,
        transition: 'left 0.3s ease'
      }}
    >
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <div className="d-none d-lg-block">
            <h5 className="fw-black text-dark mb-0" style={{ letterSpacing: '-0.5px' }}>Faculty Portal</h5>
          </div>
        </div>

        <div className="ms-auto d-flex align-items-center gap-3">


          {/* User Profile Dropdown Container */}
          <div className="position-relative" ref={dropdownRef}>
            <div
              className="d-flex align-items-center gap-2 px-2 ps-3 ms-2"
              onClick={() => setIsOpen(!isOpen)} // 3. Manual toggle
              style={{ cursor: 'pointer', userSelect: 'none' }}
            >
              <div className="text-end d-none d-lg-block">
                <p className="mb-0 fw-bold text-dark" style={{ fontSize: '0.8rem', lineHeight: '1.2' }}>{staffName}</p>
                <p className="mb-0 text-success fw-bold" style={{ fontSize: '0.65rem', opacity: '0.8' }}>● Active</p>
              </div>

              <div
                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center shadow-sm"
                style={{ width: '40px', height: '40px' }}
              >
                <span className="material-symbols-rounded">person</span>
              </div>
            </div>

            {/* 4. Conditional Rendering based on State */}
            {isOpen && (
              <ul
                className="dropdown-menu dropdown-menu-end border-0 shadow-lg p-2 rounded-4 show" // Added 'show' class
                style={{
                  display: 'block', // Force display
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '15px',
                  minWidth: '220px'
                }}
              >
                <li>
                  <div className="px-3 py-2">
                    <p className="small text-muted mb-0 fw-bold text-uppercase ls-1" style={{ fontSize: '10px' }}>Manage Account</p>
                  </div>
                </li>
                <li>
                  <Link href="/staff/profile" onClick={() => setIsOpen(false)} className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3">
                    <span className="material-symbols-rounded text-primary fs-5">account_circle</span>
                    <span className="fw-bold small">My Profile</span>
                  </Link>
                </li>
                <li><hr className="dropdown-divider opacity-50" /></li>
                <li>
                  <Link href="/api/auth/logout" className="dropdown-item d-flex align-items-center gap-3 py-2 rounded-3 text-danger">
                    <span className="material-symbols-rounded fs-5">logout</span>
                    <span className="fw-bold small">Sign Out</span>
                  </Link>
                </li>
              </ul>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}