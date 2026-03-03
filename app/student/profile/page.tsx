"use client";
import React, { useState, useEffect } from 'react';

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: "Loading...",
    enrollmentNo: "...",
    email: "...",
    phone: "...",
    parentName: "...",
    parentMobileNo: "...",
    description: "...",
    username: "...",
    role: "STUDENT",
    joined: "..."
  });

  const [tempProfile, setTempProfile] = useState({ ...profile });

  useEffect(() => {
    fetch('/api/student/profile')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setProfile(data);
          setTempProfile(data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleEditClick = () => {
    setTempProfile({ ...profile });
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTempProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/student/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tempProfile),
      });
      const data = await res.json();
      if (data.success) {
        setProfile({ ...tempProfile });
        setIsEditing(false);
        setShowSuccessPopup(true);
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("Error updating profile.");
    }
  };

  if (loading) return <div className="p-5 text-center">Loading profile...</div>;

  return (
    <div className="container-fluid py-4 animate-fade-in">

      {/* SUCCESS MODAL OVERLAY */}
      {showSuccessPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 1050, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="card-main border-0 shadow-lg bg-white p-5 text-center animate-zoom-in" style={{ maxWidth: '400px' }}>
            <div className="welcome-icon-box mx-auto mb-4 bg-success shadow-sm" style={{ width: '70px', height: '70px' }}>
              <span className="material-symbols-rounded text-white fs-1">check_circle</span>
            </div>
            <h4 className="fw-black text-dark">Profile Updated!</h4>
            <p className="text-secondary small">Your changes have been saved successfully.</p>
            <button className="btn btn-primary-premium rounded-pill w-100 mt-3 py-2" onClick={() => setShowSuccessPopup(false)}>
              Got it!
            </button>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card-main border-0 shadow-sm overflow-hidden bg-white">
            <div className="profile-banner"></div>
            <div className="px-4 pb-4">
              <div className="d-flex align-items-end mt-n5 mb-3 gap-3">
                <div className="profile-avatar-lg shadow-lg bg-white d-flex justify-content-center align-items-center">
                  <span className="fs-1 fw-bold text-primary">
                    {profile.name !== "Loading..." ? profile.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'P'}
                  </span>
                </div>
                <div className="pb-1">
                  <h3 className="fw-black text-dark mb-0">{profile.name}</h3>
                  <span className="badge bg-primary-soft text-primary rounded-pill">
                    ID: {profile.enrollmentNo}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card-main border-0 shadow-sm p-4 bg-white h-100">
            <form onSubmit={handleSave}>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="fw-bold mb-0">Personal Details</h5>
                {!isEditing ? (
                  <button type="button" className="btn btn-light-outline btn-sm rounded-pill px-3" onClick={handleEditClick}>
                    <span className="material-symbols-rounded fs-6 me-1">edit</span> Edit Profile
                  </button>
                ) : (
                  <div className="d-flex gap-2">
                    <button type="button" className="btn btn-light btn-sm rounded-pill px-3" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="btn btn-indigo-glow btn-sm rounded-pill px-3">Save Changes</button>
                  </div>
                )}
              </div>

              <div className="row g-4">
                <div className="col-md-6">
                  <label className="extra-small text-uppercase fw-bold text-muted ls-1 d-block mb-1">Full Name</label>
                  {isEditing ? (
                    <input type="text" name="name" className="form-control bg-light border-0 p-3 rounded-4 shadow-none fw-semibold"
                      value={tempProfile.name} onChange={handleChange} required />
                  ) : (
                    <div className="p-3 bg-light rounded-3 fw-semibold">{profile.name}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="extra-small text-uppercase fw-bold text-muted ls-1 d-block mb-1">Email Address</label>
                  {isEditing ? (
                    <input type="email" name="email" className="form-control bg-light border-0 p-3 rounded-4 shadow-none fw-semibold"
                      value={tempProfile.email} onChange={handleChange} required />
                  ) : (
                    <div className="p-3 bg-light rounded-3 fw-semibold">{profile.email}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label className="extra-small text-uppercase fw-bold text-muted ls-1 d-block mb-1">Mobile Number</label>
                  {isEditing ? (
                    <input type="text" name="phone" className="form-control bg-light border-0 p-3 rounded-4 shadow-none fw-semibold"
                      value={tempProfile.phone} onChange={handleChange} required />
                  ) : (
                    <div className="p-3 bg-light rounded-3 fw-semibold">{profile.phone}</div>
                  )}
                </div>

                <div className="col-12">
                  <label className="extra-small text-uppercase fw-bold text-muted ls-1 d-block mb-1">About / Bio</label>
                  {isEditing ? (
                    <textarea name="description" rows={4} className="form-control bg-light border-0 p-3 rounded-4 shadow-none small"
                      value={tempProfile.description} onChange={handleChange} />
                  ) : (
                    <div className="p-3 bg-light rounded-3 small text-secondary">{profile.description}</div>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Account Info Column */}
        <div className="col-lg-4">
          <div className="card-main border-0 shadow-sm p-4 bg-white mb-4">
            <h5 className="fw-bold mb-4">Account Information</h5>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center p-2 border-bottom">
                <span className="small text-muted">Username</span>
                <span className="small fw-bold">{profile.username}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-2">
                <span className="small text-muted">Joined</span>
                <span className="small fw-bold">{profile.joined}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}