import React, { useState, useRef } from 'react';
import { User, Reel } from '../../types';
import { X, Play, Upload, Film, Video, Sparkles } from 'lucide-react';

interface CreateReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onReelCreated: (newReel: Reel) => void;
}

const SAMPLE_REEL_VIDEOS = [
  {
    name: 'Binary Code Flow',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-matrix-style-binary-code-animation-28821-large.mp4'
  },
  {
    name: 'Circuit Board Loop',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-micro-controller-loop-41566-large.mp4'
  },
  {
    name: 'Cyberpunk Neon Glow',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-video-of-a-futuristic-tunnel-with-neon-lights-42999-large.mp4'
  }
];

export const CreateReelModal: React.FC<CreateReelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onReelCreated
}) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDeviceVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      alert('Please choose a video file under 50MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setVideoUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;

    const newReel: Reel = {
      id: 'reel-' + Date.now(),
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      authorId: currentUser.id,
      likes: [],
      reposts: 0,
      comments: []
    };

    onReelCreated(newReel);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="glass-card max-w-md w-full p-6 rounded-2xl border border-slate-800 relative shadow-2xl my-auto">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Upload Creator Reel</h3>
            <p className="text-xs text-slate-400">Share short 9:16 vertical videos, loops, and creative clips</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Reel Title & Caption</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Creative design breakdown in Nairobi ⚡" 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500 text-xs" 
            />
          </div>

          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-sky-400" />
                <span>Video Source</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadMode('device')}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    uploadMode === 'device' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Upload Device Video
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer ${
                    uploadMode === 'url' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Video URL
                </button>
              </div>
            </div>

            {uploadMode === 'device' ? (
              <div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="video/mp4,video/webm,video/quicktime" 
                  onChange={handleDeviceVideoUpload}
                  className="hidden" 
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/60"
                >
                  <Upload className="w-6 h-6 text-sky-400 mx-auto mb-1.5" />
                  <p className="font-semibold text-slate-200 text-xs">Click to browse & upload video from device</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">MP4, WebM, MOV supported (vertical 9:16 best)</p>
                </div>
              </div>
            ) : (
              <input 
                type="url" 
                value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://assets.mixkit.co/videos/preview/..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 text-xs" 
              />
            )}

            {/* Quick Sample Video Pickers */}
            <div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" /> Or pick a sample loop:
              </span>
              <div className="flex gap-2">
                {SAMPLE_REEL_VIDEOS.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setVideoUrl(item.url)}
                    className="flex-1 p-2 rounded-lg bg-slate-950 border border-slate-800 hover:border-sky-400 text-slate-300 text-[10px] font-semibold text-center cursor-pointer truncate transition-colors"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Video Preview */}
          {videoUrl && (
            <div className="aspect-[9/16] max-h-56 w-auto mx-auto rounded-xl overflow-hidden bg-black border border-slate-800 relative">
              <video src={videoUrl} controls autoPlay loop muted className="w-full h-full object-cover" />
            </div>
          )}

          <button 
            type="submit" 
            disabled={!videoUrl.trim() || !title.trim()}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-sky-600/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Publish Reel to Zackjad</span>
          </button>
        </form>
      </div>
    </div>
  );
};
