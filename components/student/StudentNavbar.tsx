"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styles from '@/components/student/Student.module.css';

export default function StudentNavbar() {
  const [showConfig] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Local state for configuration toggles
  const [config, setConfig] = useState({
    darkMode: false,
    notifications: true,
    compactMode: false,
    language: 'English'
  });

  const [userData, setUserData] = useState({
    studentName: 'Loading...',
    enrollmentNo: '...',
    email: '...'
  });

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    setMounted(true);

    fetch('/api/student/layout')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setUserData(data);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const toggleConfig = (key: keyof typeof config) => {
    setConfig(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationCount = 3;

  return (
    <>
      <motion.nav
        className={`navbar navbar-expand-lg fixed-top ${styles.premiumNav}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 150 }}
      >
        <div className="container-fluid px-4">
          {/* Left Section */}
          <div className="d-flex align-items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${styles.brandGradient} px-4 py-2 rounded-5 d-none d-lg-flex align-items-center `}
            >
              <span className="material-symbols-rounded text-white fs-4 me-2">school</span>
              <h5 className="fw-bold text-white mb-0">Student Portal</h5>
            </motion.div>

          </div>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-3">

            {/* Profile Dropdown */}
            <div className="dropdown">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className={`btn profile-pill dropdown-toggle d-flex align-items-center gap-3 border-1 rounded-5 p-1`}
                type="button"
                id="profileDropdownMenu"
                data-bs-toggle="dropdown"
              >
                <div className="text-end d-none d-md-block">
                  <div className="fw-bold text-dark small">{userData.studentName}</div>
                  <div className="text-muted extra-small">{userData.enrollmentNo}</div>
                </div>
                <div className={styles.avatarCirclePremium}>
                  <span className="material-symbols-rounded">account_circle</span>
                  <div className={styles.avatarGlow}></div>
                </div>
              </motion.button>

              <motion.ul
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`dropdown-menu dropdown-menu-end ${styles.premiumDropdown} mt-2 shadow-lg border-0`}
              >
                <li className="px-4 py-3 border-bottom mb-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className={styles.avatarCircleLarge}>
                      {userData.studentName !== 'Loading...' ? userData.studentName.charAt(0) : 'A'}
                    </div>
                    <div>
                      <div className="fw-bold small text-dark">{userData.studentName}</div>
                      <div className="text-muted extra-small">{userData.email}</div>
                    </div>
                  </div>
                </li>
                <li>
                  <a className="dropdown-item d-flex align-items-center gap-3" href="/student/profile">
                    <span className="material-symbols-rounded fs-5">person</span>
                    <span>View Profile</span>
                  </a>
                </li>
                <li>

                </li>

                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a className="dropdown-item d-flex align-items-center gap-3 text-danger fw-bold" href="/api/auth/logout">
                    <span className="material-symbols-rounded fs-5">logout</span>
                    <span>Sign Out</span>
                  </a>
                </li>
              </motion.ul>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* --- SYSTEM CONFIG MODAL --- */}

    </>
  );
}