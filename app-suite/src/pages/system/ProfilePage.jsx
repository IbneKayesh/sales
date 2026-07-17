import { useState, useRef } from 'react';

import { useAuth } from '../../context/AuthContext';
import { useToast, useConfirm } from '@/context/FeedbackContext';
import { fmtDateLong } from '@/utils/dataFormat';
import { IconEyeOpen, IconEyeOff, IconCamera, IconSave, IconUnlock } from '@/assets/icons';
import Avatar from '../../components/Avatar/Avatar';
import './ProfilePage.css';
const ProfilePage = () => {
  const { currentUser, updateProfile, changePassword, defaultAvatarImg } = useAuth();
  const { addToast } = useToast();
  const { confirmWithAction } = useConfirm();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });
  const fileInputRef = useRef(null);

  const handleSaveProfile = async () => {
    if (!displayName.trim()) {
      addToast({ message: 'Display name cannot be empty', type: 'warning' });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    updateProfile({ displayName: displayName.trim(), email: email.trim(), bio: bio.trim() });
    setSaving(false);
    addToast({ message: 'Profile updated successfully', type: 'success' });
  };

  const handleChangePassword = async () => {
    if (!currentPw || !newPw || !confirmPw) {
      addToast({ message: 'Please fill in all password fields', type: 'warning' });
      return;
    }
    if (newPw.length < 6) {
      addToast({ message: 'New password must be at least 6 characters', type: 'warning' });
      return;
    }
    if (newPw !== confirmPw) {
      addToast({ message: 'New passwords do not match', type: 'error' });
      return;
    }

    await confirmWithAction(
      'Change Password',
      'Are you sure you want to change your password? You will be logged out of all active sessions.',
      async () => {
        setChangingPw(true);
        try {
          await changePassword(currentPw, newPw);
          addToast({ message: 'Password changed successfully', type: 'success' });
          setCurrentPw('');
          setNewPw('');
          setConfirmPw('');
        } catch (err) {
          addToast({ message: err.message, type: 'error' });
        }
        setChangingPw(false);
      },
      { confirmLabel: 'Change Password', windowId: 'profile' }
    );
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === 'string') {
        setAvatarPreview(dataUrl);
        updateProfile({ avatar: dataUrl });
        addToast({ message: 'Avatar updated', type: 'success' });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const avatarSrc = avatarPreview || currentUser?.avatar || defaultAvatarImg;

  const PwToggle = ({ field }) => (
    <button
      type="button"
      className="pwToggle"
      onClick={() => setShowPw((p) => ({ ...p, [field]: !p[field] }))}
      tabIndex={-1}
    >
      {showPw[field] ? <IconEyeOff className="pwToggleIcon" /> : <IconEyeOpen className="pwToggleIcon" />}
    </button>
  );

  return (
    <div className="page">
      <div className="layout">
        {/* ── Avatar Column ───────────────────────────────────────── */}
        <div className="avatarColumn">
          <div className="avatarWrap">
            <Avatar src={avatarSrc} alt={currentUser?.displayName || 'User'} size="xlarge" />
            <button className="avatarOverlay" onClick={() => fileInputRef.current?.click()} title="Change avatar">
              <IconCamera className="cameraIcon" />
            </button>
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="fileInput" onChange={handleAvatarChange} />
          <span className="avatarHint">Click to change photo</span>
          <div className="roleBadge">
            {currentUser?.role || 'User'}
          </div>
        </div>

        {/* ── Profile Fields ──────────────────────────────────────── */}
        <div className="fieldsColumn">
          <h1 className="title">Profile Settings</h1>
          <p className="subtitle">Manage your personal information and security</p>

          <div className="section">
            <h2 className="sectionTitle">Personal Information</h2>
            <div className="fieldGrid">
              <div className="field">
                <label className="fieldLabel">Display Name</label>
                <input
                  type="text"
                  className="fieldInput"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                />
              </div>
              <div className="field">
                <label className="fieldLabel">Username</label>
                <input
                  type="text"
                  className={`fieldInput fieldDisabled`}
                  value={`@${currentUser?.username || ''}`}
                  disabled
                />
                <span className="fieldHint">Username cannot be changed</span>
              </div>
              <div className="field">
                <label className="fieldLabel">Email Address</label>
                <input
                  type="email"
                  className="fieldInput"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                />
              </div>
              <div className={`field fieldFull`}>
                <label className="fieldLabel">Bio</label>
                <textarea
                  className="fieldTextarea"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio..."
                  rows={3}
                />
              </div>
            </div>

            <button
              className="saveBtn"
              onClick={handleSaveProfile}
              disabled={saving}
            >
              {saving ? (
                <><span className="btnSpinner" /> Saving...</>
              ) : (
                <><IconSave className="saveIcon" /> Save Changes</>
              )}
            </button>
          </div>

          {/* ── Change Password ───────────────────────────────────── */}
          <div className="section">
            <h2 className="sectionTitle">Change Password</h2>
            <p className="sectionDesc">Enter your current password and a new password.</p>

            <div className="pwFields">
              <div className="field">
                <label className="fieldLabel">Current Password</label>
                <div className="pwInputWrap">
                  <input
                    type={showPw.current ? 'text' : 'password'}
                    className="fieldInput"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Enter current password"
                    autoComplete="current-password"
                  />
                  <PwToggle field="current" />
                </div>
              </div>
              <div className="field">
                <label className="fieldLabel">New Password</label>
                <div className="pwInputWrap">
                  <input
                    type={showPw.new ? 'text' : 'password'}
                    className="fieldInput"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Min 6 characters"
                    autoComplete="new-password"
                  />
                  <PwToggle field="new" />
                </div>
              </div>
              <div className="field">
                <label className="fieldLabel">Confirm New Password</label>
                <div className="pwInputWrap">
                  <input
                    type={showPw.confirm ? 'text' : 'password'}
                    className="fieldInput"
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Re-enter new password"
                    autoComplete="new-password"
                  />
                  <PwToggle field="confirm" />
                </div>
              </div>
            </div>

            <button
              className={`saveBtn pwBtn`}
              onClick={handleChangePassword}
              disabled={changingPw}
            >
              {changingPw ? (
                <><span className="btnSpinner" /> Changing...</>
              ) : (
                <><IconUnlock className="saveIcon" /> Change Password</>
              )}
            </button>
          </div>

          {/* ── Account Info ──────────────────────────────────────── */}
          <div className="section">
            <h2 className="sectionTitle">Account Info</h2>
            <div className="infoGrid">
              <div className="infoItem">
                <span className="infoLabel">Role</span>
                <span className="infoValue">{currentUser?.role || '—'}</span>
              </div>
              <div className="infoItem">
                <span className="infoLabel">Member Since</span>
                <span className="infoValue">
                  {fmtDateLong(currentUser.createdAt) || '—'}
                </span>
              </div>
              <div className="infoItem">
                <span className="infoLabel">User ID</span>
                <span className={`infoValue infoMono`}>{currentUser?.id || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
