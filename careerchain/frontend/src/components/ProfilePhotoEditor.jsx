import React, { useEffect, useRef, useState } from 'react';
import { Camera, ImagePlus, Loader2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { authApi } from '../api/auth';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from './UserAvatar';

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

const ProfilePhotoEditor = () => {
  const { user, refreshUser } = useAuth();
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewUrl('');
      return undefined;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const chooseFile = (event) => {
    const selected = event.target.files?.[0] || null;
    setError('');
    setNotice('');
    if (!selected) {
      setFile(null);
      return;
    }
    if (!ACCEPTED_TYPES.has(selected.type)) {
      setFile(null);
      setError('Choose a JPEG, PNG, or WebP image.');
      event.target.value = '';
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFile(null);
      setError('Choose an image smaller than 5 MB.');
      event.target.value = '';
      return;
    }
    setFile(selected);
  };

  const uploadPhoto = async () => {
    if (!file || uploading || removing) return;
    setUploading(true);
    setError('');
    setNotice('');
    const formData = new FormData();
    formData.append('avatar', file);
    try {
      await authApi.uploadAvatar(formData);
      await refreshUser();
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setNotice('Profile photo successfully updated.');
    } catch (uploadError) {
      setError(uploadError.response?.data?.detail || 'The photo could not be uploaded. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removePhoto = async () => {
    if (removing || uploading) return;
    setRemoving(true);
    setError('');
    setNotice('');
    try {
      await authApi.removeAvatar();
      await refreshUser();
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      setNotice('Profile photo removed.');
    } catch (removeError) {
      setError(removeError.response?.data?.detail || 'The photo could not be removed. Please try again.');
    } finally {
      setRemoving(false);
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" aria-labelledby="profile-photo-title">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <UserAvatar user={user} imageUrl={previewUrl || user?.profile_image_url} size="xl" className="ring-4 ring-slate-100" />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              aria-label="Upload photo"
              className="absolute bottom-0 right-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-md hover:bg-indigo-700 transition-transform active:scale-95"
            >
              <Camera className="h-4 w-4" />
            </button>
          </div>
          <div>
            <h2 id="profile-photo-title" className="text-sm font-bold text-slate-900">
              Profile Photo
            </h2>
            <p className="mt-0.5 text-xs text-slate-500">
              A professional photo helps students and alumni recognize you. JPEG, PNG, or WebP up to 5 MB.
            </p>
            {file && (
              <p className="mt-1 text-xs font-semibold text-indigo-700">
                Selected: {file.name}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={inputRef}
            className="sr-only"
            id="profile-photo-file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={chooseFile}
            disabled={uploading || removing}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading || removing}
            className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Choose photo
          </button>

          {file && (
            <button
              type="button"
              onClick={uploadPhoto}
              disabled={uploading || removing}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl bg-indigo-600 px-4 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              {uploading ? 'Saving…' : 'Save Photo'}
            </button>
          )}

          {user?.profile_image_url && !file && (
            <button
              type="button"
              onClick={removePhoto}
              disabled={uploading || removing}
              className="inline-flex min-h-9 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-50 transition-colors"
            >
              {removing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              {removing ? 'Removing…' : 'Remove'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="mt-3 flex items-center gap-2 rounded-xl bg-rose-50 p-3 text-xs font-semibold text-rose-700">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div role="status" className="mt-3 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          <span>{notice}</span>
        </div>
      )}
    </section>
  );
};

export default ProfilePhotoEditor;
