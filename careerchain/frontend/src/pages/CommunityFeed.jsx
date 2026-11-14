import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  Image,
  MessageCircle,
  Newspaper,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  Trash2,
  X,
  TrendingUp,
  Users,
  Briefcase,
  BookOpen,
  Share2,
  CheckCircle,
  ThumbsUp,
  Check
} from 'lucide-react';
import { feedApi } from '../api/feed';
import { useAuth } from '../hooks/useAuth';
import UserAvatar from '../components/UserAvatar';
import Loader from '../components/Loader';

// LinkedIn reaction assets
import likeIcon from '../assets/reactions/like.png';
import celebrateIcon from '../assets/reactions/celebrate.png';
import supportIcon from '../assets/reactions/support.png';
import loveIcon from '../assets/reactions/love.png';
import insightfulIcon from '../assets/reactions/insightful.png';
import funnyIcon from '../assets/reactions/funny.png';

const REACTIONS = [
  { emoji: '👍', label: 'Like', icon: likeIcon, color: 'text-blue-600', activeBg: 'bg-blue-50 text-blue-700' },
  { emoji: '👏', label: 'Celebrate', icon: celebrateIcon, color: 'text-emerald-700', activeBg: 'bg-emerald-50 text-emerald-800' },
  { emoji: '💪', label: 'Support', icon: supportIcon, color: 'text-purple-700', activeBg: 'bg-purple-50 text-purple-800' },
  { emoji: '❤️', label: 'Love', icon: loveIcon, color: 'text-rose-600', activeBg: 'bg-rose-50 text-rose-700' },
  { emoji: '💡', label: 'Insightful', icon: insightfulIcon, color: 'text-amber-600', activeBg: 'bg-amber-50 text-amber-800' },
  { emoji: '😊', label: 'Funny', icon: funnyIcon, color: 'text-cyan-700', activeBg: 'bg-cyan-50 text-cyan-800' },
];

const EMOJI_MAP = {
  '👍': { label: 'Like', icon: likeIcon, color: 'text-blue-600' },
  '🎉': { label: 'Celebrate', icon: celebrateIcon, color: 'text-emerald-700' },
  '👏': { label: 'Celebrate', icon: celebrateIcon, color: 'text-emerald-700' },
  '💪': { label: 'Support', icon: supportIcon, color: 'text-purple-700' },
  '❤️': { label: 'Love', icon: loveIcon, color: 'text-rose-600' },
  '💡': { label: 'Insightful', icon: insightfulIcon, color: 'text-amber-600' },
  '😊': { label: 'Funny', icon: funnyIcon, color: 'text-cyan-700' },
};

const API_ORIGIN = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1').replace(/\/api\/v1\/?$/, '');
const MAX_IMAGE_SIZE = 8 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const countVisibleComments = (items) =>
  items.reduce((total, comment) => total + (comment.is_deleted ? 0 : 1) + countVisibleComments(comment.replies || []), 0);

const updateCommentTree = (items, targetId, update) =>
  items.map((comment) => (
    comment.id === targetId
      ? update(comment)
      : { ...comment, replies: updateCommentTree(comment.replies || [], targetId, update) }
  ));

const CommunityFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [feedFilter, setFeedFilter] = useState('ALL');
  const [content, setContent] = useState('');
  const [postType, setPostType] = useState('UPDATE');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [comments, setComments] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [replyingToId, setReplyingToId] = useState(null);
  const [hoveredReactionPostId, setHoveredReactionPostId] = useState(null);
  const [copiedPostId, setCopiedPostId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [feedLoadError, setFeedLoadError] = useState('');
  const [retryingMore, setRetryingMore] = useState(false);
  const [pendingDeletePost, setPendingDeletePost] = useState(null);
  const [pendingDeleteComment, setPendingDeleteComment] = useState(null);
  const [deletingPostId, setDeletingPostId] = useState(null);
  const [deletingCommentId, setDeletingCommentId] = useState(null);
  const [deleteError, setDeleteError] = useState('');
  const imageInputRef = useRef(null);
  const cancelDeleteButtonRef = useRef(null);
  const deleteInProgressRef = useRef(false);
  const hoverTimeoutRef = useRef(null);

  useEffect(() => {
    if (!pendingDeletePost && !pendingDeleteComment) return undefined;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape' && !deleteInProgressRef.current) {
        setPendingDeletePost(null);
        setPendingDeleteComment(null);
      }
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    cancelDeleteButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [pendingDeletePost, pendingDeleteComment]);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview('');
      return undefined;
    }
    const previewUrl = URL.createObjectURL(imageFile);
    setImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [imageFile]);

  const loadFeed = async (showLoader = false) => {
    try {
      setRetryingMore(false);
      setFeedLoadError('');
      if (showLoader) setLoading(true);
      const page = await feedApi.getFeed();
      setPosts(page.posts);
      setNextCursor(page.next_cursor);
    } catch (err) {
      setFeedLoadError(err.response?.data?.detail || 'Could not load the feed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeed();
  }, []);

  const loadMore = async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    setRetryingMore(false);
    setFeedLoadError('');
    try {
      const page = await feedApi.getFeed({ cursor: nextCursor });
      setPosts((current) => [...current, ...page.posts]);
      setNextCursor(page.next_cursor);
    } catch (err) {
      setRetryingMore(true);
      setFeedLoadError(err.response?.data?.detail || 'Could not load more updates. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  };

  const normalizedSearch = searchQuery.trim().toLocaleLowerCase();
  const filteredPosts = posts.filter((post) => {
    if (feedFilter !== 'ALL' && post.post_type !== feedFilter) {
      return false;
    }
    if (!normalizedSearch) return true;
    return [post.content, post.author?.full_name, post.author?.role, post.author?.department]
      .some((value) => value?.toLocaleLowerCase().includes(normalizedSearch));
  });

  const filterOptions = [
    { value: 'ALL', label: 'All posts', count: posts.length },
    { value: 'UPDATE', label: 'Updates', count: posts.filter((post) => post.post_type === 'UPDATE').length },
    { value: 'SUCCESS_STORY', label: 'Success stories', count: posts.filter((post) => post.post_type === 'SUCCESS_STORY').length },
  ];

  const createPost = async (event) => {
    event.preventDefault();
    if (!content.trim() && !imageFile) return;
    setPosting(true);
    setError('');
    try {
      const newPost = await feedApi.createPost({
        content: content.trim(),
        post_type: postType,
        image: imageFile,
      });
      setPosts((current) => [newPost, ...current]);
      setContent('');
      setImageFile(null);
      if (imageInputRef.current) imageInputRef.current.value = '';
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not publish your post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const selectImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please choose a JPEG, PNG, or WebP photo.');
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Photos must be 8 MB or smaller.');
      return;
    }
    setError('');
    setImageFile(file);
  };

  const react = async (postId, emoji) => {
    if (busy) return;
    setBusy(`react-${postId}-${emoji}`);
    setHoveredReactionPostId(null);
    try {
      const summary = await feedApi.react(postId, emoji);
      setPosts((current) => current.map((post) => (
        post.id === postId ? { ...post, reactions: summary.reactions } : post
      )));
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not update your reaction.');
    } finally {
      setBusy('');
    }
  };

  const handleSharePost = (postId) => {
    const url = `${window.location.origin}/student/feed#post-${postId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  const sendComment = async (event, postId) => {
    event.preventDefault();
    const commentContent = (comments[postId] || '').trim();
    if (!commentContent || busy) return;
    setBusy(`comment-${postId}`);
    try {
      const newComment = await feedApi.addComment(postId, { content: commentContent });
      setPosts((current) => current.map((post) => (
        post.id === postId ? { ...post, comments: [...post.comments, newComment] } : post
      )));
      setComments((current) => ({ ...current, [postId]: '' }));
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not post your comment.');
    } finally {
      setBusy('');
    }
  };

  const sendReply = async (event, postId, parentId) => {
    event.preventDefault();
    const replyContent = (replyDrafts[parentId] || '').trim();
    if (!replyContent || busy) return;
    setBusy(`reply-${parentId}`);
    try {
      const reply = await feedApi.addComment(postId, {
        content: replyContent,
        parent_comment_id: parentId,
      });
      setPosts((current) => current.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: updateCommentTree(post.comments, parentId, (target) => ({
            ...target,
            replies: [...(target.replies || []), reply],
          })),
        };
      }));
      setReplyDrafts((current) => ({ ...current, [parentId]: '' }));
      setReplyingToId(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Could not post your reply.');
    } finally {
      setBusy('');
    }
  };

  const deletePost = async () => {
    if (!pendingDeletePost || deleteInProgressRef.current) return;
    deleteInProgressRef.current = true;
    setDeletingPostId(pendingDeletePost.id);
    setDeleteError('');
    try {
      await feedApi.deletePost(pendingDeletePost.id);
      setPosts((current) => current.filter((item) => item.id !== pendingDeletePost.id));
      setPendingDeletePost(null);
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Could not delete the post.');
    } finally {
      deleteInProgressRef.current = false;
      setDeletingPostId(null);
    }
  };

  const deleteComment = async () => {
    if (!pendingDeleteComment || deleteInProgressRef.current) return;
    deleteInProgressRef.current = true;
    const { postId, comment } = pendingDeleteComment;
    setDeletingCommentId(comment.id);
    setDeleteError('');
    try {
      await feedApi.deleteComment(postId, comment.id);
      setPosts((current) => current.map((post) => {
        if (post.id !== postId) return post;
        return {
          ...post,
          comments: updateCommentTree(post.comments, comment.id, (target) => ({
            ...target,
            is_deleted: true,
            content: '[deleted]',
          })),
        };
      }));
      setPendingDeleteComment(null);
    } catch (err) {
      setDeleteError(err.response?.data?.detail || 'Could not delete the comment.');
    } finally {
      deleteInProgressRef.current = false;
      setDeletingCommentId(null);
    }
  };

  const profileUrl = user?.role === 'STUDENT'
    ? '/student/profile'
    : user?.role === 'ALUMNI'
    ? '/alumni/profile'
    : '/admin/profile';

  const renderComment = (comment, postId, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-7 border-l-2 border-slate-100 pl-3 sm:ml-10 sm:pl-4' : ''}`}>
      <div className="flex gap-2.5 items-start">
        {!comment.is_deleted && <UserAvatar user={comment.author} size="small" />}
        <div className="min-w-0 flex-1">
          <div className={`rounded-2xl px-3.5 py-2.5 ${comment.is_deleted ? 'bg-slate-50' : 'bg-slate-100/90'}`}>
            {comment.is_deleted ? (
              <p className="text-xs italic text-slate-500">This comment was deleted.</p>
            ) : (
              <>
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <p className="text-xs font-bold text-slate-900">{comment.author?.full_name || 'Former member'}</p>
                  <time className="text-[10px] text-slate-400" dateTime={comment.created_at}>
                    {new Date(comment.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </time>
                </div>
                <p className="mt-1 whitespace-pre-wrap break-words text-xs leading-5 text-slate-800">{comment.content}</p>
              </>
            )}
          </div>
          {!comment.is_deleted && (
            <div className="mt-1 flex items-center gap-2 pl-2">
              {depth === 0 && (
                <button
                  type="button"
                  onClick={() => setReplyingToId((current) => current === comment.id ? null : comment.id)}
                  className="rounded px-2 py-0.5 text-[11px] font-semibold text-slate-500 hover:bg-slate-100 hover:text-indigo-700 transition-colors"
                >
                  Reply
                </button>
              )}
              {Number(comment.author?.id) === Number(user?.id) && (
                <button
                  type="button"
                  onClick={() => { setDeleteError(''); setPendingDeleteComment({ postId, comment }); }}
                  aria-label="Delete your comment"
                  className="inline-flex items-center gap-1 rounded px-2 py-0.5 text-[11px] font-semibold text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              )}
            </div>
          )}
          {comment.replies?.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => renderComment(reply, postId, depth + 1))}
            </div>
          )}
        </div>
      </div>

      {replyingToId === comment.id && (
        <form onSubmit={(event) => sendReply(event, postId, comment.id)} className="mt-2 flex items-center gap-2 pl-9">
          <UserAvatar user={user} size="small" />
          <input
            autoFocus
            aria-label={`Reply to ${comment.author?.full_name}`}
            value={replyDrafts[comment.id] || ''}
            onChange={(event) => setReplyDrafts((current) => ({ ...current, [comment.id]: event.target.value }))}
            maxLength={2000}
            placeholder={`Reply to ${comment.author?.full_name}…`}
            className="cc-control min-w-0 flex-1 rounded-full text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
          <button
            type="submit"
            disabled={Boolean(busy) || !(replyDrafts[comment.id] || '').trim()}
            aria-label="Post reply"
            className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      )}
    </div>
  );

  if (loading) return <Loader message="Loading community feed…" size="large" />;

  return (
    <div className="w-full">
      {/* Top Banner */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
              <Newspaper className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Community News Feed</h1>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Official DIU student and alumni network · Share career milestones, job referrals & campus updates
          </p>
        </div>
        <button
          type="button"
          disabled={loading}
          onClick={() => loadFeed(true)}
          className="inline-flex min-h-9 items-center gap-1.5 self-start rounded-full border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors sm:self-auto"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
          Refresh Feed
        </button>
      </div>

      {/* Main 2-column Facebook / LinkedIn Feed Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">

        {/* FEED STREAM (Center column) */}
        <div className="flex-1 min-w-0 w-full space-y-4">

          {/* Facebook/LinkedIn Post Composer */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
            <form onSubmit={createPost}>
              <div className="flex items-start gap-3">
                <UserAvatar user={user} size="medium" />
                <div className="flex-1 min-w-0">
                  <textarea
                    id="feed-post"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                    maxLength={5000}
                    rows={content.length > 60 || imagePreview ? 3 : 2}
                    placeholder={`What's on your mind, ${user?.full_name?.split(' ')[0] || 'DIUian'}? Share an update or opportunity…`}
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                  />
                </div>
              </div>

              {imagePreview && (
                <div className="relative mt-3 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <img src={imagePreview} alt="Selected preview" className="max-h-80 w-full object-contain" />
                  <button
                    type="button"
                    onClick={() => setImageFile(null)}
                    aria-label="Remove image"
                    className="absolute right-2.5 top-2.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/75 text-white shadow hover:bg-slate-900 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-2">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={selectImage}
                    className="hidden"
                    aria-label="Attach photo"
                  />
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-emerald-700 transition-colors"
                  >
                    <Image className="h-4 w-4 text-emerald-600" />
                    <span>Photo</span>
                  </button>

                  <div className="h-4 w-[1px] bg-slate-200" />

                  <div className="flex items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1">
                    <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                    <select
                      aria-label="Post category"
                      value={postType}
                      onChange={(event) => setPostType(event.target.value)}
                      className="bg-transparent text-[11px] font-semibold text-slate-700 outline-none cursor-pointer border-0 p-0 pr-5"
                    >
                      <option value="UPDATE">General Update</option>
                      <option value="SUCCESS_STORY">Success Story 🎉</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={posting || (!content.trim() && !imageFile)}
                  className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <Send className="h-3.5 w-3.5" />
                  {posting ? 'Publishing…' : 'Post'}
                </button>
              </div>
            </form>
          </div>

          {/* Search & Filter pills */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search posts or members…"
                  className="w-full rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={feedFilter === option.value}
                    onClick={() => setFeedFilter(option.value)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                      feedFilter === option.value
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className={`text-[10px] ${feedFilter === option.value ? 'text-indigo-200' : 'text-slate-400'}`}>
                      ({option.count})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={() => setError('')} className="text-rose-500 hover:text-rose-700">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {feedLoadError && (
            <div role="alert" className="flex flex-col gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 sm:flex-row sm:items-center sm:justify-between">
              <span>{feedLoadError}</span>
              <button
                type="button"
                onClick={retryingMore ? loadMore : () => loadFeed(true)}
                className="inline-flex items-center gap-1 self-start rounded-lg bg-white px-3 py-1 font-bold text-rose-700 shadow-sm border border-rose-200 hover:bg-rose-50"
              >
                <RefreshCw className="h-3 w-3" /> Retry
              </button>
            </div>
          )}

          {/* Empty states */}
          {posts.length === 0 && !feedLoadError && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
              <MessageCircle className="mx-auto h-10 w-10 text-slate-300" />
              <h3 className="mt-3 text-sm font-bold text-slate-800">No community posts yet</h3>
              <p className="mt-1 text-xs text-slate-500">Be the first to share an update or milestone with the DIU network!</p>
            </div>
          )}

          {/* Social Feed Post Cards */}
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const totalReactions = post.reactions?.reduce((total, r) => total + r.count, 0) || 0;
              const commentCount = countVisibleComments(post.comments || []);
              const myReaction = post.reactions?.find((r) => r.reacted_by_me);
              const myReactionMeta = myReaction ? (EMOJI_MAP[myReaction.emoji] || { label: 'Liked', icon: likeIcon, color: 'text-blue-600' }) : null;

              return (
                <article
                  id={`post-${post.id}`}
                  key={post.id}
                  className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-visible transition-all hover:border-slate-300"
                >
                  {/* Card Header: Author, Role, Time, Options */}
                  <div className="flex items-start justify-between p-4 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <UserAvatar user={post.author} size="medium" />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <p className="text-xs font-bold text-slate-900 leading-tight truncate">
                            {post.author?.full_name || 'Community member'}
                          </p>
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            post.author?.role === 'ALUMNI'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : post.author?.role === 'STUDENT'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}>
                            {post.author?.role === 'ALUMNI' ? 'Alumni' : post.author?.role === 'STUDENT' ? 'Student' : 'Admin'}
                          </span>
                          {post.post_type === 'SUCCESS_STORY' && (
                            <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                              🎉 Success Story
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-400">
                          {post.author?.department ? `${post.author.department} · ` : ''}
                          <time dateTime={post.created_at}>
                            {new Date(post.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </time>
                        </p>
                      </div>
                    </div>

                    {/* Post Author Options Menu */}
                    {Number(post.author?.id) === Number(user?.id) && (
                      <button
                        type="button"
                        aria-label="Delete your post"
                        title="Delete post"
                        onClick={() => {
                          setDeleteError('');
                          setPendingDeletePost(post);
                        }}
                        className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-rose-100 bg-white px-3 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-300"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>

                  {/* Post Content */}
                  {post.content && (
                    <div className="px-4 pb-3">
                      <p className="whitespace-pre-wrap break-words text-xs sm:text-[13px] leading-relaxed text-slate-800">
                        {post.content}
                      </p>
                    </div>
                  )}

                  {/* Post Image */}
                  {post.image_url && (
                    <div className="bg-slate-100 border-t border-b border-slate-100 overflow-hidden">
                      <img
                        src={`${API_ORIGIN}${post.image_url}`}
                        alt="Shared community visual"
                        loading="lazy"
                        className="max-h-[30rem] w-full object-contain mx-auto"
                      />
                    </div>
                  )}

                  {/* LinkedIn Reaction & Comment Count Stats Bar */}
                  {(totalReactions > 0 || commentCount > 0) && (
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2 text-[11px] text-slate-500">
                      <div className="flex items-center gap-2">
                        {/* Overlapping top reaction circular icons */}
                        <div className="flex -space-x-1.5 items-center">
                          {post.reactions?.filter((r) => r.count > 0).slice(0, 3).map((r) => {
                            const meta = EMOJI_MAP[r.emoji] || { label: 'Reaction', icon: likeIcon };
                            return (
                              <span
                                key={r.emoji}
                                title={`${r.count} ${meta.label}`}
                                className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200 p-0.5"
                              >
                                <img src={meta.icon} alt={meta.label} className="h-3.5 w-3.5 object-contain" />
                              </span>
                            );
                          })}
                        </div>
                        {totalReactions > 0 && (
                          <span className="font-semibold text-slate-700 hover:underline cursor-pointer">
                            {totalReactions}
                          </span>
                        )}
                      </div>
                      <div>
                        {commentCount > 0 && (
                          <span className="hover:underline cursor-pointer">
                            {commentCount} {commentCount === 1 ? 'comment' : 'comments'}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* LinkedIn Style Interactive Action Row with Floating Reaction Popup */}
                  <div className="relative border-b border-slate-100 px-3 py-1.5">

                    {/* Floating Reaction Popup (shows on hover or active click) */}
                    {hoveredReactionPostId === post.id && (
                      <div
                        onMouseEnter={() => {
                          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                          setHoveredReactionPostId(post.id);
                        }}
                        onMouseLeave={() => setHoveredReactionPostId(null)}
                        className="absolute -top-14 left-2 z-30 flex items-center gap-1.5 rounded-full bg-white px-3 py-2 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150"
                      >
                        {REACTIONS.map((r) => {
                          const hasReacted = post.reactions?.some((item) => item.emoji === r.emoji && item.reacted_by_me);
                          return (
                            <button
                              key={r.label}
                              type="button"
                              onClick={() => react(post.id, r.emoji)}
                              disabled={Boolean(busy)}
                              className={`group relative flex flex-col items-center justify-center p-1 rounded-full hover:bg-slate-100 transition-all transform hover:scale-130 active:scale-95 ${
                                hasReacted ? 'ring-2 ring-indigo-500 bg-indigo-50/50' : ''
                              }`}
                            >
                              <img src={r.icon} alt={r.label} className="h-7 w-7 sm:h-8 sm:w-8 object-contain transition-transform" />
                              {/* Tooltip */}
                              <span className="pointer-events-none absolute -top-7 rounded-md bg-slate-900 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 shadow group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                {r.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-1">
                      {/* LinkedIn Like / React Primary Button */}
                      <div
                        className="relative"
                        onMouseEnter={() => {
                          if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                          setHoveredReactionPostId(post.id);
                        }}
                        onMouseLeave={() => {
                          hoverTimeoutRef.current = setTimeout(() => {
                            setHoveredReactionPostId((curr) => (curr === post.id ? null : curr));
                          }, 300);
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => react(post.id, myReaction ? myReaction.emoji : '👍')}
                          disabled={Boolean(busy)}
                          aria-label={myReactionMeta ? `Reacted ${myReactionMeta.label}` : 'Like this post'}
                          className={`w-full inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-xs font-bold transition-all hover:bg-slate-100 disabled:opacity-50 ${
                            myReactionMeta ? myReactionMeta.color : 'text-slate-600'
                          }`}
                        >
                          {myReactionMeta ? (
                            <img src={myReactionMeta.icon} alt={myReactionMeta.label} className="h-5 w-5 object-contain" />
                          ) : (
                            <img src={likeIcon} alt="Like" className="h-5 w-5 object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all" />
                          )}
                          <span>{myReactionMeta ? myReactionMeta.label : 'Like'}</span>
                        </button>
                      </div>

                      {/* Comment Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const input = document.getElementById(`comment-input-${post.id}`);
                          if (input) input.focus();
                        }}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <MessageCircle className="h-4 w-4 text-slate-500" />
                        <span>Comment</span>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => handleSharePost(post.id)}
                        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        {copiedPostId === post.id ? (
                          <>
                            <Check className="h-4 w-4 text-emerald-600" />
                            <span className="text-emerald-700">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="h-4 w-4 text-slate-500" />
                            <span>Share</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Quick Clickable 6 Reaction Pills Row (Direct Access) */}
                  <div className="flex flex-wrap items-center gap-1.5 px-3 py-2 bg-slate-50/70 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 mr-1 uppercase tracking-wider hidden sm:inline">
                      React:
                    </span>
                    {REACTIONS.map(({ emoji, label, icon, activeBg }) => {
                      const reaction = post.reactions?.find((r) => r.emoji === emoji);
                      const isReacted = Boolean(reaction?.reacted_by_me);

                      return (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => react(post.id, emoji)}
                          disabled={Boolean(busy)}
                          aria-label={`${label} reaction`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all shadow-2xs disabled:opacity-50 ${
                            isReacted
                              ? `${activeBg} ring-1 ring-slate-300 font-bold scale-105`
                              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                        >
                          <img src={icon} alt={label} className="h-4 w-4 object-contain" />
                          <span className="text-[11px]">{label}</span>
                          {reaction?.count ? (
                            <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold text-slate-600">
                              {reaction.count}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>

                  {/* Comments Section */}
                  <div className="bg-slate-50/40 p-4 space-y-3">
                    {post.comments?.length > 0 && (
                      <div className="space-y-2.5">
                        {post.comments.map((comment) => renderComment(comment, post.id))}
                      </div>
                    )}

                    {/* Comment Composer */}
                    <form onSubmit={(event) => sendComment(event, post.id)} className="flex items-center gap-2 pt-1">
                      <UserAvatar user={user} size="small" />
                      <input
                        id={`comment-input-${post.id}`}
                        aria-label="Add a comment"
                        value={comments[post.id] || ''}
                        onChange={(event) => setComments((current) => ({ ...current, [post.id]: event.target.value }))}
                        maxLength={2000}
                        placeholder="Add a congratulatory comment or question…"
                        className="min-h-9 flex-1 rounded-full border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-100"
                      />
                      <button
                        type="submit"
                        disabled={Boolean(busy) || !(comments[post.id] || '').trim()}
                        aria-label="Send comment"
                        className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 transition-colors"
                      >
                        <Send className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Load More Button */}
          {nextCursor && (
            <div className="flex justify-center pt-3 pb-6">
              <button
                type="button"
                disabled={loadingMore}
                onClick={loadMore}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-300 bg-white px-6 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                {loadingMore ? (
                  <>
                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    Loading updates…
                  </>
                ) : (
                  'Load more posts'
                )}
              </button>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR WIDGETS (LinkedIn/Facebook Style) */}
        <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">

          {/* Profile Card Widget */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="h-16 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700" />
            <div className="px-4 pb-4 -mt-8">
              <div className="inline-block rounded-full ring-4 ring-white shadow-sm mb-2">
                <UserAvatar user={user} size="medium" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">
                {user?.full_name || 'Member'}
              </h2>
              <p className="text-[11px] text-slate-500">{user?.email}</p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-100">
                  {user?.role === 'ALUMNI' ? '🎓 DIU Alumni' : user?.role === 'STUDENT' ? '📚 Current Student' : '⚙️ Administrator'}
                </span>
              </div>

              <div className="mt-3 border-t border-slate-100 pt-3">
                <Link
                  to={profileUrl}
                  className="block w-full rounded-xl border border-indigo-200 bg-indigo-50/50 py-2 text-center text-xs font-bold text-indigo-700 hover:bg-indigo-100 transition-colors"
                >
                  View My Profile
                </Link>
              </div>
            </div>
          </div>

          {/* Trending at DIU */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                Trending at DIU
              </h3>
            </div>
            <div className="space-y-2.5">
              {[
                { tag: '#DIUCareerFair2026', desc: 'Over 40 tech companies participating', count: '84 posts' },
                { tag: '#AlumniReferrals', desc: 'Engineering & QA positions open', count: '42 posts' },
                { tag: '#FinalYearCapstone', desc: 'Project presentations and defense', count: '31 posts' },
                { tag: '#FastAPIWorkshop', desc: 'Backend system design seminar', count: '19 posts' },
              ].map(({ tag, desc, count }) => (
                <div
                  key={tag}
                  onClick={() => setSearchQuery(tag.replace('#', ''))}
                  className="group cursor-pointer rounded-lg p-1.5 hover:bg-slate-50 transition-colors"
                >
                  <p className="text-xs font-bold text-indigo-700 group-hover:underline">{tag}</p>
                  <p className="text-[11px] text-slate-500 leading-tight">{desc}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{count}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Community Guidelines Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Community Guidelines
            </h3>
            <ul className="space-y-1.5 text-[11px] text-slate-600 leading-relaxed">
              <li>• Connect respectfully with students & alumni.</li>
              <li>• Share genuine job openings & career milestones.</li>
              <li>• Help peers by providing constructive feedback.</li>
            </ul>
          </div>
        </aside>
      </div>

      {/* Delete Confirmation Modal */}
      {(pendingDeletePost || pendingDeleteComment) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingPostId && !deletingCommentId) {
              setPendingDeletePost(null);
              setPendingDeleteComment(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-post-title"
            aria-describedby="delete-post-description"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-slate-100"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-50 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h2 id="delete-post-title" className="mt-4 text-base font-bold text-slate-900">
              {pendingDeletePost ? 'Delete this post?' : 'Delete this comment?'}
            </h2>
            <p id="delete-post-description" className="mt-2 text-xs leading-5 text-slate-600">
              {pendingDeletePost
                ? 'Your post, image, comments, and reactions will be permanently removed. This cannot be undone.'
                : 'Your comment will be removed. Any replies will remain visible.'}
            </p>
            {deleteError && (
              <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">
                {deleteError}
              </p>
            )}
            <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                ref={cancelDeleteButtonRef}
                type="button"
                disabled={Boolean(deletingPostId || deletingCommentId)}
                onClick={() => { setPendingDeletePost(null); setPendingDeleteComment(null); }}
                className="cc-button-secondary text-xs"
              >
                Keep it
              </button>
              <button
                type="button"
                disabled={Boolean(deletingPostId || deletingCommentId)}
                onClick={pendingDeletePost ? deletePost : deleteComment}
                className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-rose-700 px-4 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-60"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {deletingPostId || deletingCommentId ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default CommunityFeed;
