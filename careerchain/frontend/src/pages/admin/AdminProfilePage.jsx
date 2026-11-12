import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  CheckCircle,
  Briefcase,
  Calendar,
  Mail,
  Building2,
  KeyRound,
  FileText,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import ProfilePhotoEditor from '../../components/ProfilePhotoEditor';
import UserAvatar from '../../components/UserAvatar';

const AdminProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* Hero Admin Profile Banner Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Cover Banner */}
        <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 relative">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-emerald-400 border border-slate-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Root Admin Access
            </span>
          </div>
        </div>

        {/* Profile Info Header Bar */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Circular Avatar */}
            <div className="relative inline-block">
              <div className="rounded-full ring-4 ring-white shadow-lg bg-white p-1">
                <UserAvatar user={user} size="2xl" className="h-28 w-28 sm:h-32 sm:w-32 text-3xl" />
              </div>
              <span
                title="System Administrator"
                className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white shadow-sm"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/admin/users"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Users className="h-4 w-4" />
                Manage Users
              </Link>
            </div>
          </div>

          {/* Names, Title & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user?.full_name || 'System Administrator'}
              </h1>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 border border-purple-200 px-3 py-1 text-xs font-bold text-purple-800">
                <ShieldCheck className="h-3.5 w-3.5 text-purple-600" />
                Platform Administrator
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                Active Superuser
              </span>
            </div>

            <p className="mt-1.5 text-sm sm:text-base font-semibold text-slate-700">
              Department of {user?.department || 'Computer Science and Engineering'} · Daffodil International University
            </p>

            {/* Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                Faculty / Administrative Leadership
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-slate-400" />
                Staff ID: <strong className="text-slate-700">{user?.university_id || 'ADMIN-001'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <a href={`mailto:${user?.email}`} className="text-indigo-600 hover:underline">{user?.email}</a>
              </span>
            </div>
          </div>

          {/* Metrics */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-5">
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Role Privilege</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">Admin Level 1</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Identity Audit</p>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">Verified Institutional</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">User Governance</p>
              <p className="text-lg font-bold text-indigo-700 mt-0.5">Global</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Jobs & Moderation</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">Full Access</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Photo Editor */}
      <ProfilePhotoEditor />

      {/* Admin Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          to="/admin/users"
          className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            <Users className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-indigo-700">User Accounts</h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Manage students, alumni accounts, change roles, deactivate or review user profiles.
          </p>
        </Link>

        <Link
          to="/admin/alumni-verify"
          className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <CheckCircle className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-emerald-700">Alumni Verification</h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Audit DIU alumni graduation certificates, batches, and grant verified credentials.
          </p>
        </Link>

        <Link
          to="/admin/jobs"
          className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Briefcase className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-sm font-bold text-slate-900 group-hover:text-blue-700">Jobs Governance</h2>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed">
            Monitor alumni job postings, referrals, and verify company legitimacy for student safety.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default AdminProfilePage;
