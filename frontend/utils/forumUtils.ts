import { ForumDiscussion, ForumReply } from '../types/forum';

// Backend types (matching your API response from http://localhost:3000/api/forum-posts)
interface BackendForumPost {
  id: number;
  userEmail: string;
  businessUen: string | null;
  businessName?: string | null;
  title: string | null;
  body: string;
  likeCount: number;
  createdAt: string;
  replies: BackendForumReply[];
}

interface BackendForumReply {
  id: number;
  postId: number;
  userEmail: string;
  body: string;
  likeCount: number | null;
  createdAt: string | null;
}

// Transform backend reply to frontend reply
export const transformBackendToForumReply = (
  backendReply: BackendForumReply
): ForumReply => {
  return {
    id: String(backendReply.id),
    discussionId: String(backendReply.postId),
    userName: backendReply.userEmail.split('@')[0], // Extract name from email
    userAvatar: undefined,
    content: backendReply.body,
    createdAt: backendReply.createdAt || new Date().toISOString(),
    likes: backendReply.likeCount || 0,
  };
};

// Transform backend post to frontend discussion
export const transformBackendToForumDiscussion = (
  backendPost: BackendForumPost
): ForumDiscussion => {
  return {
    id: String(backendPost.id),
    title: backendPost.title || 'Untitled',
    businessTag: backendPost.businessName || undefined, // Use businessName instead of businessUen
    content: backendPost.body,
    userName: backendPost.userEmail.split('@')[0], // Extract name from email
    userAvatar: undefined,
    createdAt: backendPost.createdAt,
    likes: backendPost.likeCount,
    replies: backendPost.replies.map(transformBackendToForumReply),
  };
};
