'use client';

import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon } from 'lucide-react';

interface Props {
  value?: string;                // مسیر فعلی تصویر
  onChange: (url: string) => void;
  folder?: string;               // پوشه‌ی dest در public/uploads/
  label?: string;
  hint?: string;
  className?: string;
}

export default function ImageUploader({
  value, onChange, folder = 'general', label, hint, className = '',
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const upload = async (file: File) => {
    setError('');
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'خطا');
      onChange(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) upload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) upload(file);
  };

  const clear = () => {
    onChange('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold mb-1.5 text-slate-700 dark:text-slate-300">{label}</label>}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`relative rounded-xl border-2 border-dashed transition-all ${
          dragOver
            ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
            : 'border-slate-300 dark:border-[#21262d] bg-slate-50 dark:bg-[#0d1117]'
        }`}
      >
        {value ? (
          <div className="relative group">
            <img
              src={value}
              alt="preview"
              className="w-full h-44 object-cover rounded-xl"
              onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0.3'; }}
            />
            <div className="absolute top-2 end-2 flex gap-1.5">
              <button
                type="button" onClick={() => inputRef.current?.click()}
                className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-900 shadow-md"
                title="جایگزینی"
              >
                <Upload size={14} />
              </button>
              <button
                type="button" onClick={clear}
                className="p-2 rounded-lg bg-white/90 dark:bg-slate-900/90 backdrop-blur text-red-600 hover:bg-red-50 shadow-md"
                title="حذف"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full p-8 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 hover:text-brand-500 transition-colors"
          >
            {uploading ? (
              <Loader2 size={28} className="animate-spin mb-2" />
            ) : (
              <ImageIcon size={28} className="mb-2" />
            )}
            <span className="text-sm font-medium">
              {uploading ? 'در حال آپلود...' : 'برای آپلود کلیک کن یا فایل رو بکش اینجا'}
            </span>
            <span className="text-xs text-slate-400 mt-1 font-mono">
              PNG, JPG, WebP, SVG · حداکثر 5MB
            </span>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={onFileSelect}
          className="hidden"
        />
      </div>

      {/* Manual URL input as alternative */}
      <div className="mt-2 flex items-center gap-2">
        <LinkIcon size={14} className="text-slate-400 flex-shrink-0" />
        <input
          type="text"
          dir="ltr"
          placeholder="یا یه URL/مسیر دستی وارد کن (مثل /projects/x.png)"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-1.5 rounded-lg bg-transparent border border-slate-200 dark:border-[#21262d] focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none text-xs font-mono"
        />
      </div>

      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
      {hint && !error && <p className="text-xs text-slate-500 mt-1 font-mono">{hint}</p>}
    </div>
  );
}
