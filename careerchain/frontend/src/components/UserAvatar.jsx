import React, { useEffect, useState } from 'react';

const API_ROOT = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1')
  .replace(/\/api\/v1\/?$/, '');

const sizes = {
  small: 'h-8 w-8 text-xs',
  medium: 'h-11 w-11 text-sm',
  large: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-2xl',
  '2xl': 'h-32 w-32 text-4xl',
};

const resolveImageUrl = (url) => {
  if (!url) return '';
  if (/^(https?:|blob:|data:)/i.test(url)) return url;
  return `${API_ROOT}${url.startsWith('/') ? '' : '/'}${url}`;
};

const UserAvatar = ({ user, imageUrl, size = 'medium', className = '' }) => {
  const name = user?.full_name || 'User';
  const source = resolveImageUrl(imageUrl ?? user?.profile_image_url);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => setImageFailed(false), [source]);

  const initials = name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  // Consistent pleasant gradient background based on user name
  const getGradient = (str) => {
    const gradients = [
      'from-emerald-600 to-teal-700',
      'from-blue-600 to-indigo-700',
      'from-indigo-600 to-purple-700',
      'from-teal-600 to-cyan-700',
      'from-violet-600 to-fuchsia-700',
      'from-amber-600 to-rose-700',
    ];
    let hash = 0;
    for (let i = 0; i < (str || '').length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % gradients.length;
    return gradients[index];
  };

  const bgGradient = getGradient(name);

  return (
    <span
      className={`relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br ${bgGradient} font-bold text-white shadow-sm ring-2 ring-white/80 select-none ${sizes[size] || sizes.medium} ${className}`}
      aria-label={`${name} profile photo`}
      role="img"
    >
      {source && !imageFailed ? (
        <img
          src={source}
          alt=""
          className="absolute inset-0 h-full w-full object-cover rounded-full"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span>{initials || 'U'}</span>
      )}
    </span>
  );
};

export default UserAvatar;
