"use client";
import React, { useState, useEffect } from 'react';
import styles from '../staff.module.css';

export default function StaffProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [faculty, setFaculty] = useState({
    name: "",
    staffId: "",
    email: "",
    phone: "",
    description: "",
    username: "",
    role: "",
    joined: "",
  });

  // Form state for editing
  const [formData, setFormData] = useState({ ...faculty });

  useEffect(() => {
    fetch('/api/staff/profile')
      .then(res => res.json())
      .then(data => {
        const profile = {
          name: data.name || '',
          staffId: data.staffId ? `FAC-${data.staffId}` : 'N/A',
          email: data.email || '',
          phone: data.phone || '',
          description: data.description || '',
          username: data.username || '',
          role: data.role || 'STAFF',
          joined: data.joined || 'Unknown',
        };
        setFaculty(profile);
        setFormData(profile);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load profile:", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/staff/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          description: formData.description,
        })
      });
      const data = await res.json();
      if (data.success) {
        setFaculty({ ...formData });
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save profile:", err);
    }
    setSaving(false);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      handleSave();
    } else {
      setFormData({ ...faculty });
      setIsEditing(true);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <span className="ms-3 fw-bold text-muted">Loading profile...</span>
      </div>
    );
  }

  const displayData = isEditing ? formData : faculty;

  return (
    <div className="container-fluid py-4 animate-fade-in">
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between mb-4 px-2">
        <div>
          <h3 className="fw-black text-dark mb-1">Faculty Account</h3>
          <p className="text-secondary small fw-medium mb-0">Manage your professional profile and contact details</p>
        </div>
        <button
          onClick={handleToggleEdit}
          disabled={saving}
          className={`btn ${isEditing ? 'btn-success shadow-sm' : 'btn-outline-primary border-2'} rounded-4 px-4 py-2 fw-bold transition-all d-flex align-items-center gap-2`}
        >
          {saving ? (
            <span className="spinner-border spinner-border-sm" role="status"></span>
          ) : (
            <span className="material-symbols-rounded fs-5">{isEditing ? 'check_circle' : 'edit_square'}</span>
          )}
          {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="row g-4">
        {/* LEFT COLUMN: Identity Card */}
        <div className="col-lg-4 col-xl-3">
          <div className="card border-0 shadow-sm rounded-5 overflow-hidden">
            {/* Refined Banner */}
            <div className={`${styles.facultyProfileBanner} p-4 text-center`} style={{ background: 'linear-gradient(180deg, rgba(79, 70, 229, 0.05) 0%, rgba(255, 255, 255, 0) 100%)' }}>

              {/* Stylized Name Icon (Letter Avatar) */}
              <div className={`${styles.profileAvatarWrapper} mx-auto mb-3`}>
                <div className={styles.premiumNameIcon}>
                  {displayData.name.charAt(0) || '?'}
                </div>
                {isEditing && (
                  <button className={styles.avatarEditBtn} title="Upload New Photo">
                    <span className="material-symbols-rounded fs-6">add_a_photo</span>
                  </button>
                )}
              </div>

              <h5 className="fw-black text-dark mb-1">{displayData.name || 'Staff Member'}</h5>
              <div className="d-flex justify-content-center">
                <span className="badge rounded-pill px-3 py-2 extra-small-text fw-bold" style={{ backgroundColor: '#EEF2FF', color: '#4F46E5' }}>
                  {displayData.role}
                </span>
              </div>
            </div>

            <div className="card-body p-4 bg-light-subtle">
              <div className="d-flex flex-column gap-3">
                {/* ID Badge Item */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-white border border-light shadow-sm-hover transition-all">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '40px', height: '40px', backgroundColor: '#F1F5F9' }}>
                    <span className="material-symbols-rounded text-slate fs-5">badge</span>
                  </div>
                  <div>
                    <p className="extra-small-text text-muted fw-bold text-uppercase mb-0" style={{ fontSize: '0.65rem' }}>Employee ID</p>
                    <p className="small fw-black text-dark mb-0">{displayData.staffId}</p>
                  </div>
                </div>

                {/* Status Item */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-white border border-light shadow-sm-hover transition-all">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '40px', height: '40px', backgroundColor: '#ECFDF5' }}>
                    <span className="material-symbols-rounded text-success fs-5">verified_user</span>
                  </div>
                  <div>
                    <p className="extra-small-text text-muted fw-bold text-uppercase mb-0" style={{ fontSize: '0.65rem' }}>Account Status</p>
                    <p className="small fw-black text-success mb-0 d-flex align-items-center gap-1">
                      Verified <span className="material-symbols-rounded fs-6">check_circle</span>
                    </p>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="d-flex align-items-center gap-3 p-3 rounded-4 bg-white border border-light shadow-sm-hover transition-all">
                  <div className="d-flex align-items-center justify-content-center rounded-3" style={{ width: '40px', height: '40px', backgroundColor: '#FEF3C7' }}>
                    <span className="material-symbols-rounded text-warning fs-5">calendar_month</span>
                  </div>
                  <div>
                    <p className="extra-small-text text-muted fw-bold text-uppercase mb-0" style={{ fontSize: '0.65rem' }}>Member Since</p>
                    <p className="small fw-black text-dark mb-0">{displayData.joined}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* RIGHT COLUMN: Details Form */}
        <div className="col-lg-8 col-xl-9">
          <div className="card border-0 shadow-sm rounded-5 p-2">
            <div className="card-body p-4">
              <h5 className="fw-black text-dark mb-4 d-flex align-items-center gap-2">
                Personal Details
              </h5>

              <div className="row g-4">
                {[
                  { label: 'Full Name', key: 'name', icon: 'person', type: 'text' },
                  { label: 'Official Email', key: 'email', icon: 'alternate_email', type: 'email' },
                  { label: 'Mobile Number', key: 'phone', icon: 'smartphone', type: 'tel' },
                  { label: 'Username', key: 'username', icon: 'account_circle', type: 'text', readOnly: true },
                ].map((item, index) => (
                  <div className="col-md-6" key={index}>
                    <div className={styles.inputGroupPremium}>
                      <label className={styles.premiumLabel}>{item.label}</label>
                      <div className="position-relative">
                        <span className={`material-symbols-rounded ${styles.inputIconPremium}`}>
                          {item.icon}
                        </span>
                        <input
                          type={item.type}
                          className={`form-control ${styles.premiumInput} ${(!isEditing || item.readOnly) ? styles.readOnlyInput : ''}`}
                          value={(displayData as any)[item.key] || ''}
                          onChange={(e) => handleChange(item.key, e.target.value)}
                          readOnly={!isEditing || item.readOnly}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <div className="col-12 mt-4">
                  <div className={styles.inputGroupPremium}>
                    <label className={styles.premiumLabel}>Description & Specializations</label>
                    <textarea
                      className={`form-control ${styles.premiumInput} ${!isEditing ? styles.readOnlyInput : ''}`}
                      rows={3}
                      value={displayData.description || ''}
                      onChange={(e) => handleChange('description', e.target.value)}
                      readOnly={!isEditing}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}