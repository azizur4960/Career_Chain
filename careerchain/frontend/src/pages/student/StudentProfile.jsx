import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  GraduationCap,
  Building2,
  Mail,
  Github,
  Linkedin,
  Globe,
  FileText,
  Edit3,
  Sparkles,
  BookOpen,
  Calendar,
  Share2,
  CheckCircle2,
  Award,
  ExternalLink,
  Target,
  UserCheck
} from 'lucide-react';
import SkillBadge from '../../components/SkillBadge';
import ProfilePhotoEditor from '../../components/ProfilePhotoEditor';
import UserAvatar from '../../components/UserAvatar';

const StudentProfile = () => {
  const { user } = useAuth();
  const profile = user?.student_profile || {};
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
        <div className="h-40 sm:h-48 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 relative">
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
            {/* Circular Avatar with Thick Ring */}
            <div className="relative inline-block">
              <div className="rounded-full ring-4 ring-white shadow-lg bg-white p-1">
                <UserAvatar user={user} size="2xl" className="h-28 w-28 sm:h-32 sm:w-32 text-3xl" />
              </div>
              <span
                title="Active DIU Student"
                className="absolute bottom-2 right-2 h-5 w-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                to="/student/profile/edit"
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
                {user?.full_name || 'DIU Student'}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-xs font-bold text-indigo-700">
                <GraduationCap className="h-3.5 w-3.5" />
                Current Student
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Semester {profile.semester || 1}
              </span>
            </div>

            {/* Professional Headline */}
            <p className="mt-1.5 text-sm sm:text-base font-medium text-slate-700 flex items-center gap-2">
              <Target className="h-4 w-4 text-indigo-600 flex-shrink-0" />
              Target Role: <span className="font-bold text-indigo-900">{profile.target_role || 'Software Engineer'}</span>
            </p>

            {/* University & Contact Metadata */}
            <div className="mt-3 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-slate-400" />
                {user?.department || 'Computer Science and Engineering'} · Daffodil International University
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-slate-400" />
                Student ID: <strong className="text-slate-700">{user?.university_id || 'Not specified'}</strong>
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
              <p className="text-xs text-slate-500 font-medium">Current Semester</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">{profile.semester ? `Semester ${profile.semester}` : 'Enrolled'}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Core Skills</p>
              <p className="text-lg font-bold text-indigo-700 mt-0.5">{skills.length} listed</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Verification</p>
              <p className="text-lg font-bold text-emerald-700 mt-0.5">
                {user?.is_identity_verified ? 'Verified ID' : 'DIU Enrolled'}
              </p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-3 text-center">
              <p className="text-xs text-slate-500 font-medium">Department</p>
              <p className="text-lg font-bold text-slate-900 mt-0.5">CSE</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Photo Editor Accordion / Component */}
      <ProfilePhotoEditor />

      {/* Main 2-column Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: About & Skills */}
        <div className="lg:col-span-2 space-y-6">

          {/* About / Bio Section */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-indigo-600" />
                About & Career Aspirations
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {profile.bio ||
                'Passionate Daffodil International University student preparing for technology industry internships and full-time software engineering roles. Click "Edit Profile" to share your background, academic projects, and career goals.'}
            </p>
          </section>

          {/* Technical Skills & Tools */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                Skills & Technical Competencies
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-bold text-slate-600">
                {skills.length} skills
              </span>
            </div>

            {skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, idx) => (
                  <SkillBadge key={idx} skill={skill} variant="default" size="default" />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No skills added yet. Click Edit Profile to add your stack.</p>
            )}
          </section>

          {/* Academic Journey Card */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-indigo-600" />
                Education
              </h2>
            </div>
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Daffodil International University (DIU)</h3>
                <p className="text-xs font-semibold text-indigo-600 mt-0.5">
                  Bachelor of Science in {user?.department || 'Computer Science and Engineering'}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Current Status: Semester {profile.semester || 1} · Student ID: {user?.university_id || 'N/A'}
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* Right 1 Col: Portfolio, Social & Quick Actions */}
        <div className="space-y-6">

          {/* Portfolio & Social Links Card */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 border-b border-slate-100 pb-3">
              Portfolio & Profiles
            </h2>
            <div className="space-y-2.5">
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

              {profile.portfolio_url && (
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
                      <Globe className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600">Personal Website</p>
                      <p className="text-[10px] text-slate-400 truncate">{profile.portfolio_url.replace(/^https?:\/\//, '')}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-600" />
                </a>
              )}

              {profile.cv_url && (
                <a
                  href={profile.cv_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 hover:bg-emerald-100/50 transition-all group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                      <FileText className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-emerald-900 group-hover:text-emerald-700">Resume / CV</p>
                      <p className="text-[10px] text-emerald-600">Download PDF</p>
                    </div>
                  </div>
                  <ExternalLink className="h-3.5 w-3.5 text-emerald-600" />
                </a>
              )}

              {!profile.github_url && !profile.linkedin_url && !profile.portfolio_url && !profile.cv_url && (
                <div className="rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <Globe className="mx-auto h-7 w-7 text-slate-300" />
                  <p className="mt-2 text-xs text-slate-500">No public portfolio links added yet.</p>
                  <Link to="/student/profile/edit" className="mt-2 inline-block text-xs font-bold text-indigo-600 hover:underline">
                    Add links
                  </Link>
                </div>
              )}
            </div>
          </section>

          {/* Quick Career Tools */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 border-b border-slate-100 pb-3">
              Career Shortcuts
            </h2>
            <div className="space-y-2">
              <Link
                to="/student/resume-builder"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-indigo-600" />
                  AI Resume Builder
                </span>
                <span className="text-slate-400">&rarr;</span>
              </Link>
              <Link
                to="/student/ai-match"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  Match Jobs with Resume
                </span>
                <span className="text-slate-400">&rarr;</span>
              </Link>
              <Link
                to="/student/alumni"
                className="flex items-center justify-between rounded-xl p-2.5 hover:bg-slate-50 transition-colors text-xs font-semibold text-slate-700"
              >
                <span className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4 text-emerald-600" />
                  Find Alumni Mentors
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

export default StudentProfile;
