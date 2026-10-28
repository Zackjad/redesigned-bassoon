import React, { useState, useRef } from 'react';
import { User, Pin } from '../../types';
import { CATEGORIES } from '../../data/mockData';
import { X, Image as ImageIcon, Sparkles, PlusCircle, Upload, Link } from 'lucide-react';

interface CreatePinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onPinCreated: (newPin: Pin) => void;
}

const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
];

export const CreatePinModal: React.FC<CreatePinModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onPinCreated
}) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState(CATEGORIES.filter(c => c !== 'All')[0] || 'Interior');
  const [description, setDescription] = useState('');
  const [uploadMode, setUploadMode] = useState<'device' | 'url'>('device');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle image upload from device
  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      alert('Please choose an image file under 12MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setImageUrl(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    const newPin: Pin = {
      id: 'pin-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      image: imageUrl.trim(),
      category: category,
      authorId: currentUser.id,
      likes: [],
      saves: [],
      comments: [],
      createdAt: 'Just now'
    };

    onPinCreated(newPin);
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

        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-white">Publish New Visual Pin</h3>
            <p className="text-xs text-slate-400">Upload photography, UI designs, architectural renders, or artwork</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Pin Title</label>
            <input 
              type="text" 
              required 
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g., Minimalist Nairobi Studio Concept" 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-sky-500 text-xs" 
            />
          </div>

          {/* Image source switch: Device Upload vs URL */}
          <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ImageIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>Pin Media</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => setUploadMode('device')}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    uploadMode === 'device' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3 h-3" /> Device File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMode('url')}
                  className={`px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-1 ${
                    uploadMode === 'url' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Link className="w-3 h-3" /> Image URL
                </button>
              </div>
            </div>

            {uploadMode === 'device' ? (
              <div>
                <input 
                  ref={fileInputRef}
                  type="file" 
                  accept="image/*" 
                  onChange={handleDeviceFileUpload}
                  className="hidden" 
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950/60"
                >
                  <Upload className="w-6 h-6 text-sky-400 mx-auto mb-1.5" />
                  <p className="font-semibold text-slate-200 text-xs">Click to browse & upload from this device</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Supports PNG, JPG, WebP, GIF</p>
                </div>
              </div>
            ) : (
              <div>
                <input 
                  type="url" 
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..." 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 text-xs" 
                />
              </div>
            )}

            {/* Quick Inspiration Image Pickers */}
            <div>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 mb-1.5">
                <Sparkles className="w-3 h-3 text-amber-400" /> Or pick a sample image:
              </span>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {SAMPLE_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setImageUrl(img)}
                    className="w-12 h-12 rounded-lg overflow-hidden border border-slate-700 shrink-0 hover:border-sky-400 cursor-pointer transition-colors"
                  >
                    <img src={img} alt="Sample" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="h-36 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800 relative">
              <img 
                src={imageUrl} 
                alt="Preview" 
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-1.5 right-2 bg-slate-950/80 text-[10px] font-semibold px-2 py-0.5 rounded text-sky-300 border border-slate-800">
                Selected Media Preview
              </span>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 text-xs cursor-pointer"
            >
              {CATEGORIES.filter(c => c !== 'All').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description</label>
            <textarea 
              rows={3} 
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Tell other creatives about the style, composition, tools, or story behind this pin..." 
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-sky-500 text-xs resize-none"
            ></textarea>
          </div>

          <button 
            type="submit" 
            disabled={!imageUrl.trim()}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-all shadow-md shadow-sky-600/20 cursor-pointer flex items-center justify-center gap-2"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Publish to Zackjad Feed</span>
          </button>
        </form>
      </div>
    </div>
  );
};
