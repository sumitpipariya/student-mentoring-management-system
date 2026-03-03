"use client";

import React from 'react';
import { 
  ArrowRight, 
  Users, 
  GraduationCap, 
  ShieldCheck, 
  BarChart3, 
  TrendingUp,
  CheckCircle,
  BookOpen,
  CalendarCheck,
  FileText,
  Instagram,
  Facebook,
  Twitter,
  MessageCircle
} from 'lucide-react';

export default function Home() {
  
  const userRoles = [
    { 
      title: 'Student', 
      icon: <GraduationCap size={28} />, 
      color: 'text-primary', 
      bgColor: 'rgba(13, 110, 253, 0.1)',
      desc: 'Seek guidance, set academic goals, and record your mentoring progress.' 
    },
    { 
      title: 'Mentor', 
      icon: <Users size={28} />, 
      color: 'text-success', 
      bgColor: 'rgba(25, 135, 84, 0.1)',
      desc: 'Monitor mentee performance, attendance, and record session details.' 
    },
    { 
      title: 'Admin', 
      icon: <ShieldCheck size={28} />, 
      color: 'text-warning', 
      bgColor: 'rgba(255, 193, 7, 0.1)',
      desc: 'Manage mentor-mentee mapping, user profiles, and view analytics reports.' 
    }
  ];

  const features = [
    { icon: <BookOpen size={20} />, text: 'Academic tracking' },
    { icon: <CalendarCheck size={20} />, text: 'Session scheduling' },
    { icon: <FileText size={20} />, text: 'Automated reports' },
  ];

  // Social links (replace with your actual URLs)
  const socialLinks = [
    { name: 'Instagram', icon: <Instagram size={20} />, url: 'https://instagram.com/' },
    { name: 'Facebook', icon: <Facebook size={20} />, url: 'https://facebook.com/' },
    { name: 'X (Twitter)', icon: <Twitter size={20} />, url: 'https://x.com/' },
    { name: 'WhatsApp', icon: <MessageCircle size={20} />, url: 'https://wa.me/' },
  ];

  return (
    <>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <div className="min-vh-100 bg-white" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        
        {/* 1. STICKY NAVIGATION */}
        <nav className="navbar navbar-light bg-white border-bottom sticky-top py-3">
          <div className="container">
            <a className="navbar-brand fw-bold fs-3 text-primary d-flex align-items-center" href="#">
              <ShieldCheck size={28} className="me-1" />
              SMMS
            </a>
            <div className="d-flex align-items-center gap-3">
              <a href="/auth/login" className="btn btn-dark rounded-pill px-4 fw-bold shadow-sm">
                Sign In
              </a>
            </div>
          </div>
        </nav>

        {/* 2. HERO SECTION */}
        <header className="py-5 overflow-hidden position-relative">
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f0f5ff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              zIndex: 0
            }}
          ></div>

          <div className="container position-relative z-1">
            <div className="row align-items-center g-5">
              <div className="col-lg-6">
                <div className="badge bg-light text-primary border px-3 py-2 rounded-pill mb-4 shadow-sm d-inline-flex align-items-center">
                  <TrendingUp size={14} className="me-1" /> Mentoring Success Tracked
                </div>
                <h1 className="display-3 fw-bolder text-dark mb-4" style={{ lineHeight: 1.2 }}>
                  Empower Your <br />
                  <span className="text-primary">Academic Journey</span>
                </h1>
                <p className="lead text-secondary mb-5" style={{ fontSize: '1.25rem' }}>
                  The SMMS platform facilitates structured mentoring between faculty and students, 
                  ensuring continuous academic and personal development tracking.
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <a href="/auth/login" className="btn btn-primary btn-lg px-5 py-3 rounded-3 fw-bold shadow">
                    Get Started Now <ArrowRight className="ms-2" size={20} />
                  </a>
                  <button className="btn btn-outline-dark btn-lg px-4 py-3 rounded-3 fw-bold">
                    System Overview
                  </button>
                </div>

                <div className="d-flex flex-wrap gap-2 mt-4">
                  {features.map((feat, i) => (
                    <span key={i} className="badge bg-light text-muted d-flex align-items-center px-3 py-2">
                      {feat.icon}
                      <span className="ms-2">{feat.text}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="col-lg-6">
                <div className="position-relative">
                  <div className="card border-0 shadow-xl rounded-4 p-4 bg-white overflow-hidden">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="fw-bold m-0">Performance Dashboard</h5>
                      <BarChart3 className="text-primary" size={24} />
                    </div>

                    <div className="p-4 bg-gradient-primary-light rounded-4 mb-4 position-relative" style={{ height: '180px' }}>
                      <div className="d-flex align-items-end justify-content-between h-100">
                        {[40, 70, 55, 90].map((height, idx) => (
                          <div 
                            key={idx}
                            className="bg-primary rounded-top w-100 mx-1 transition-all duration-700"
                            style={{ 
                              height: `${height}%`,
                              minHeight: '20px',
                              animation: 'growBar 1.2s ease-out forwards',
                              animationDelay: `${idx * 0.2}s`
                            }}
                          ></div>
                        ))}
                      </div>
                      <div className="d-flex justify-content-between mt-2 text-muted small">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                      </div>
                    </div>

                    <div className="row g-3">
                      <div className="col-6">
                        <div className="p-3 border rounded-3 bg-white shadow-sm text-center h-100">
                          <small className="text-muted d-block mb-1">Mentees</small>
                          <span className="h5 fw-bold text-dark">Performance</span>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="p-3 border rounded-3 bg-white shadow-sm text-center h-100">
                          <small className="text-muted d-block mb-1">Reports</small>
                          <span className="h5 fw-bold text-dark">Analytics</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* 3. FEATURE CARDS */}
        <section className="py-5 bg-light border-top border-bottom">
          <div className="container py-4">
            <div className="text-center mb-5">
              <h2 className="fw-bold text-dark h1">Centralized Access</h2>
              <p className="text-secondary col-lg-7 mx-auto">
                Role-based authentication for students, mentors, and administrators 
              </p>
            </div>
            <div className="row g-4 justify-content-center">
              {userRoles.map((role) => (
                <div key={role.title} className="col-md-4">
                  <div className="card h-100 border-0 shadow-sm p-4 role-card" 
                       style={{ borderRadius: '20px' }}>
                    <div className="mb-4 d-inline-block p-3 rounded-4" 
                         style={{ backgroundColor: role.bgColor, color: role.color }}>
                      {role.icon}
                    </div>
                    <h3 className="fw-bold mb-3">{role.title} Portal</h3>
                    <p className="text-muted mb-4">
                      {role.desc}
                    </p>
                    <a href="/auth/login" className={`btn btn-link ${role.color} p-0 fw-bold text-decoration-none d-flex align-items-center gap-2`}>
                      Enter Dashboard <ArrowRight size={18} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. KEY CAPABILITIES */}
        <section className="py-5">
          <div className="container py-5">
            <div className="row g-5 align-items-center">
              <div className="col-md-6">
                <h2 className="display-6 fw-bold mb-4">Advanced Management Features</h2>
                <ul className="list-unstyled">
                  <li className="d-flex align-items-start mb-4">
                    <CheckCircle className="text-success me-3 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h5 className="fw-bold">Bulk User Import</h5>
                      <p className="text-muted mb-0">Easily upload Student and Staff profiles via Excel.</p>
                    </div>
                  </li>
                  <li className="d-flex align-items-start mb-4">
                    <CheckCircle className="text-success me-3 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h5 className="fw-bold">Session Recording</h5>
                      <p className="text-muted mb-0">Track meeting agendas, issues discussed, and action points.</p>
                    </div>
                  </li>
                  <li className="d-flex align-items-start">
                    <CheckCircle className="text-success me-3 mt-1 flex-shrink-0" size={24} />
                    <div>
                      <h5 className="fw-bold">Automated Reporting</h5>
                      <p className="text-muted mb-0">Generate department-wise mentoring summaries and export to PDF.</p>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <div className="bg-primary rounded-5 p-5 text-white shadow-lg h-100 d-flex flex-column justify-content-center">
                  <h4 className="fw-bold mb-4">Our Development Goal</h4>
                  <p className="opacity-90 mb-4">
                    The Student Mentoring Management System enables mentors to monitor academics, 
                    attendance, behavior, and student grievances in one secure place.
                  </p>
                  <div className="d-flex gap-4 mt-auto">
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">98%</h3>
                      <small className="opacity-80">Retention Rate</small>
                    </div>
                    <div className="vr bg-white opacity-25 my-2"></div>
                    <div className="text-center">
                      <h3 className="fw-bold mb-0">100%</h3>
                      <small className="opacity-80">Secure Data</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOCIAL MEDIA SECTION */}
        <section className="py-4 bg-light border-top">
          <div className="container">
            <div className="text-center">
              <p className="text-muted mb-3">Follow us for updates and support</p>
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="d-flex align-items-center justify-content-center social-icon"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-4 border-top text-center text-muted small">
          <div className="container">
            © {new Date().getFullYear()} Student Mentoring Management System (SMMS). All Rights Reserved.
          </div>
        </footer>

        {/* SCOPED CSS + ANIMATIONS */}
        <style jsx global>{`
          @keyframes growBar {
            from { height: 0; }
            to { height: var(--target-height, 100%); }
          }

          .bg-gradient-primary-light {
            background: linear-gradient(135deg, #f0f7ff 0%, #e6f0ff 100%);
          }

          .role-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
          }

          .transition-all {
            transition: all 0.3s ease;
          }

          .z-1 {
            z-index: 1;
          }

          /* Social Icons */
          .social-icon {
            width: 44px;
            height: 44px;
            border-radius: 50%;
            background: white;
            color: #495057;
            box-shadow: 0 2px 6px rgba(0,0,0,0.08);
            transition: all 0.3s ease;
            text-decoration: none;
          }

          .social-icon:hover {
            transform: translateY(-3px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            color: #0d6efd;
          }

          /* Better focus states */
          a:focus, button:focus {
            outline: 2px solid #0d6efd;
            outline-offset: 2px;
          }

          /* Responsive tweaks */
          @media (max-width: 768px) {
            .display-3 {
              font-size: 2.5rem !important;
            }
            .lead {
              font-size: 1.1rem !important;
            }
            .social-icon {
              width: 40px;
              height: 40px;
            }
          }
        `}</style>
      </div>
    </>
  );
}