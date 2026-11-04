import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  Building2,
  Award,
  Clock,
  Mail,
  Linkedin,
  Github,
  Edit3,
  CheckCircle,
  Sparkles,
  Share2,
  Briefcase,
  FilePlus,
  BookOpen,
  MessageSquare,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers
} from 'lucide-react';
import SkillBadge from '../../components/SkillBadge';
import ProfilePhotoEditor from '../../components/ProfilePhotoEditor';
import UserAvatar from '../../components/UserAvatar';

const AlumniProfile = () => {
  const { user } = useAuth();
  const profile = user?.alumni_profile || {};
  const [copied, setCopied] = useState(false);

  let skills = [];
  try {
    if (profile.skills) {
      if (profile.skills.startsWith('[')) {
        skills = JSON.parse(profile.skills);
      } else {
        skills = profile.skills.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }
  } catch {
    skills = (profile.skills || '').split(',').map((s) => s.trim()).filter(Boolean);
  }

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">

      {/* LinkedIn/Facebook Style Hero Profile Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Cover Banner */}
        <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-blue-700 via-indigo-700 to-teal-700 relative">
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-3.5 py-1.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-white transition-all"
            >
              <Share2 className="h-3.5 w-3.5" />
              {copied ? 'Link Copied!' : 'Share Profile'}
            </button>
          </div>
        </div>

        {/* Profile Info Header Bar */}
        <div className="px-6 pb-6 relative">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
            {/* Circular Avatar with Thick White Ring */}
            <div className="relative inline-block">
              <div className="rounded-full ring-4 ring-white shadow-lg bg-white p-1">
                <UserAvatar user={user} size="2xl" className="h-28 w-28 sm:h-32 sm:w-32 text-3xl" />
              </div>
              <span
                title="Verified DIU Alumni"
                className="absolute bottom-2 right-2 h-6 w-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white shadow-sm"
              >
                <CheckCircle2 className="h-4 w-4" />
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/alumni/profile/edit"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 transition-all active:scale-95"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* User Names, Headline & Badges */}
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {user?.full_name || 'DIU Alumni'}
              </h1>
              {profile.is_verified ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-xs font-bold text-emerald-800">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                  Verified Alumni
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  🎓 DIU Alumni
                </span>
              )}

              {profile.is_available_for_mentorship && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-xs font-semibold text-teal-800">
                  <span className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
                  Open for Mentoring
                </span>
              )}
            </div>

            {/* Professional Headline */}
            <p className="mt-1.5 text-sm sm:text-base font-semibold text-slate-800 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-600 flex-shrink-0" />
              <span>{profile.current_position || 'Software Professional'}</span>
              <span className="text-slate-400">at</span>
              <span className="font-bold text-indigo-900">{profile.current_company || 'Tech Industry'}</span>
            </p>

            {/* University & Contact Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {user?.department || 'Software Engineering'} · Daffodil International University
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-slate-400" />
                Batch of <strong className="text-slate-700">{profile.graduation_batch || '2022'}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" />
                <strong className="text-slate-700">{profile.years_of_experience || 1}+ Years</strong> Experience
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <a href={`mailto:${user?.email}`} className="text-indigo-600 hover:underline">{user?.email}</a>
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar (LinkedIn-style) */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100 pt-5">
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Industry Experience</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{profile.years_of_experience || 0} Years</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Graduation Batch</p>
              <p className="text-lg font-bold text-indigo-700 mt-0.5">{profile.graduation_batch || 'Alumni'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Core Stack</p>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">{skills.length} skills</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Mentorship</p>
              <p className="text-lg font-bold text-teal-700 mt-0.5">
                {profile.is_available_for_mentorship ? 'Active' : 'Unavailable'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Photo Editor */}
      <ProfilePhotoEditor />

      {/* Main 2-column Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Summary & Skills */}
        <div className="lg:col-span-2 space-y-6">

          {/* Professional Summary */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-indigo-600" />
                Professional Summary
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {profile.bio ||
                'DIU alumni working in software engineering and technology. Dedicated to mentoring students and offering referrals for industry roles.'}
            </p>
          </section>

          {/* Core Competencies & Skills */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Core Competencies & Stack
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                {skills.length} skills
              </span>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <SkillBadge key={idx} skill={skill} variant="neutral" size="default" />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
            )}
          </section>

          {/* Current Experience & Alma Mater */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Layers className="h-4 w-4 text-indigo-600" />
                Career & Education
              </h2>
            </div>
            <div className="space-y-5">
              {/* Company */}
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{profile.current_company || 'Tech Industry'}</h3>
                  <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                    {profile.current_position || 'Software Engineer'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {profile.years_of_experience || 1}+ Years Professional Experience
                  </p>
                </div>
              </div>

              {/* University */}
              <div className="flex items-start gap-4 border-t border-slate-100 pt-4">
                <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700">
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Daffodil International University (DIU)</h3>
                  <p className="text-xs font-semibold text-emerald-700 mt-0.5">
                    Bachelor of Science in {user?.department || 'Software Engineering'}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Graduation Batch: {profile.graduation_batch || 'DIU Graduate'}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right 1 Col: Social Links & Alumni Shortcuts */}
        <div className="space-y-6">

          {/* Social Profiles */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-3">
              Professional Profiles
            </h2>
            <div className="space-y-2.5">
              {profile.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:border-blue-300 hover:bg-blue-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Linkedin className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600">LinkedIn</p>
                      <p className="text-[10px] text-slate-400 truncate">{profile.linkedin_url.replace(/^https?:\/\//, '')}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600" />
                </a>
              )}

              {profile.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:border-slate-300 hover:bg-slate-50 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white">
                      <Github className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">GitHub</p>
                      <p className="text-[10px] text-slate-400 truncate">{profile.github_url.replace(/^https?:\/\//, '')}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                </a>
              )}

              {!profile.linkedin_url && !profile.github_url && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <Linkedin className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-2 text-xs text-slate-500">No public profiles linked.</p>
                  <Link to="/alumni/profile/edit" className="mt-2 inline-block text-xs font-bold text-indigo-600 hover:underline">
                    Add LinkedIn / GitHub
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Alumni Opportunities & Actions */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-100 pb-3">
              Alumni Actions
            </h2>
            <div className="space-y-2">
              <Link
                to="/alumni/jobs/create"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <FilePlus className="h-4 w-4 text-emerald-600" />
                  Post a Job / Referral
                </span>
                <span className="text-slate-400">&rarr;</span>
              </Link>
              <Link
                to="/alumni/blogs/create"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  Write Career Article
                </span>
                <span className="text-slate-400">&rarr;</span>
              </Link>
              <Link
                to="/alumni/messages"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-teal-600" />
                  Student Mentorship Messages
                </span>
                <span className="text-slate-400">&rarr;</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AlumniProfile;
