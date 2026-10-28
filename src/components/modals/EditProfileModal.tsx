import React, { useState, useRef } from 'react';
import { User } from '../../types';
import { X, Upload, Camera, Image as ImageIcon, CheckCircle2, Trash2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSaveProfile: (updated: Partial<User>) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveProfile
}) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [cover, setCover] = useState(currentUser.cover || '');
  const [bio, setBio] = useState(currentUser.bio);
  const [activeAvatarTab, setActiveAvatarTab] = useState<'upload' | 'url'>('upload');
  const [activeCoverTab, setActiveCoverTab] = useState<'upload' | 'url'>('upload');

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle uploading avatar from device
  const handleAvatarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Image file should be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setAvatar(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle uploading cover banner from device
  const handleCoverFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setCover(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim(),
      username: username.trim().toLowerCase().replace(/[^a-z0-9_]/g, ''),
      avatar: avatar.trim() || currentUser.avatar,
      cover: cover.trim(),
      bio: bio.trim()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-card max-w-lg w-full p-6 rounded-2xl border border-slate-800 relative shadow-2xl my-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-extrabold text-xl text-white mb-1">Edit Profile</h3>
        <p className="text-xs text-slate-400 mb-5">
          {currentUser.isAdmin 
            ? 'Admin Profile: Your changes (avatar, bio, name) will immediately update the live Developer Showcase.' 
            : 'Customize your creator profile photo, cover banner, and bio.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Avatar Section with Device File Upload */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-sky-400" />
                <span>Profile Picture</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveAvatarTab('upload')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    activeAvatarTab === 'upload' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAvatarTab('url')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    activeAvatarTab === 'url' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group shrink-0">
                <img 
                  src={avatar || currentUser.avatar} 
                  alt="Avatar Preview" 
                  className="w-16 h-16 rounded-full object-cover border-2 border-sky-500 shadow-md" 
                />
                <button
                  type="button"
                  onClick={() => avatarFileInputRef.current?.click()}
                  className="absolute inset-0 rounded-full bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity cursor-pointer"
                  title="Upload from device"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1">
                {activeAvatarTab === 'upload' ? (
                  <div>
                    <input 
                      ref={avatarFileInputRef}
                      type="file" 
                      accept="image/*" 
                      onChange={handleAvatarFileUpload}
                      className="hidden" 
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileInputRef.current?.click()}
                      className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-sky-400" />
                      <span>Choose Photo from Device</span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1.5">
                      JPG, PNG, GIF or WebP (instant local device upload).
                    </p>
                  </div>
                ) : (
                  <div>
                    <input 
                      type="url" 
                      value={avatar}
                      onChange={e => setAvatar(e.target.value)}
                      placeholder="https://images.unsplash.com/photo-..." 
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-xs" 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Cover Banner Section with Device File Upload */}
          <div className="p-4 bg-slate-900/80 rounded-2xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-bold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Profile Cover Banner</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveCoverTab('upload')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    activeCoverTab === 'upload' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCoverTab('url')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    activeCoverTab === 'url' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Image URL
                </button>
              </div>
            </div>

            {cover && (
              <div className="h-20 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
                <img src={cover} alt="Cover preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => setCover('')}
                  className="absolute top-1.5 right-1.5 p-1 rounded-lg bg-slate-900/80 text-red-400 hover:bg-slate-900 cursor-pointer"
                  title="Remove cover"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {activeCoverTab === 'upload' ? (
              <div>
                <input 
                  ref={coverFileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleCoverFileUpload}
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => coverFileInputRef.current?.click()}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold py-2 px-3 rounded-xl border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors text-xs"
                >
                  <Upload className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Choose Cover Image from Device</span>
                </button>
              </div>
            ) : (
              <input 
                type="url" 
                value={cover}
                onChange={e => setCover(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 text-xs" 
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500" 
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Username</label>
              <input 
                type="text" 
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Bio / About</label>
            <textarea 
              rows={3} 
              value={bio}
              onChange={e => setBio(e.target.value)}
              placeholder="Tell other creatives about your craft, location, and background..."
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-sky-500 resize-none text-xs" 
            ></textarea>
          </div>

          <button 
            type="submit" 
            className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-sky-600/25 cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Profile Changes</span>
          </button>
        </form>
      </div>
    </div>
  );
};
