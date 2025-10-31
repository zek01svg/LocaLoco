import { useEffect, useCallback } from 'react';
import { useForumStore } from './useForumStore';
import { transformBackendToForumDiscussion } from '../utils/forumUtils';
import { ForumDiscussion, ForumReply } from '../types/forum';

// Backend types (matching your API response from http://localhost:3000/api/forum-posts)
interface BackendForumPost {
  id: number;
  userEmail: string;
  businessUen: string | null;
  title: string | null;
  body: string;
  likeCount: number;
  createdAt: string;
  replies: Array<{
    id: number;
    postId: number;
    userEmail: string;
    body: string;
    likeCount: number | null;
    createdAt: string | null;
  }>;
}

const API_BASE_URL = 'http://localhost:3000/api';

export const useForumPosts = () => {
  const discussions = useForumStore((state) => state.discussions);
  const isLoading = useForumStore((state) => state.isLoading);
  const error = useForumStore((state) => state.error);

  const setDiscussions = useForumStore((state) => state.setDiscussions);
  const setLoading = useForumStore((state) => state.setLoading);
  const setError = useForumStore((state) => state.setError);
  const addDiscussion = useForumStore((state) => state.addDiscussion);
  const addReply = useForumStore((state) => state.addReply);
  const likeDiscussionInStore = useForumStore((state) => state.likeDiscussion);
  const likeReplyInStore = useForumStore((state) => state.likeReply);

  // Fetch all forum posts
  const fetchForumPosts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/forum-posts`);
      if (!response.ok) throw new Error('Failed to fetch forum posts');

      const rawData: BackendForumPost[] = await response.json();
      const transformedDiscussions = rawData.map(transformBackendToForumDiscussion);

      setDiscussions(transformedDiscussions);
      setError(null);
    } catch (error: any) {
      setError(error.message || 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [setDiscussions, setLoading, setError]);

  // Silent refresh (no loading state)
  const silentRefresh = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/forum-posts`);
      if (!response.ok) throw new Error('Failed to fetch forum posts');

      const rawData: BackendForumPost[] = await response.json();
      const transformedDiscussions = rawData.map(transformBackendToForumDiscussion);

      setDiscussions(transformedDiscussions);
    } catch (error: any) {
      // Silent fail - don't show error to user
      console.error('Background refresh failed:', error);
    }
  }, [setDiscussions]);

  // Create new discussion
  const createDiscussion = useCallback(async (discussion: ForumDiscussion) => {
    // Optimistically add to UI immediately
    addDiscussion(discussion);

    try {
      const postData = {
        userEmail: 'user1@example.com', // Use a valid user email from database
        businessUen: null, // Always null for now - user input is free text, not actual business UENs
        title: discussion.title,
        body: discussion.content,
      };

      console.log('Creating discussion with data:', postData);

      const response = await fetch(`${API_BASE_URL}/forum-posts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        throw new Error('Failed to create discussion');
      }

      // Silently refresh in background to get proper IDs from server
      silentRefresh();
    } catch (error: any) {
      console.error('Create discussion error:', error);
      setError(error.message || 'Failed to create discussion');
      // Rollback: refetch to get accurate state
      await fetchForumPosts();
      throw error;
    }
  }, [addDiscussion, silentRefresh, fetchForumPosts, setError]);

  // Create new reply
  const createReply = useCallback(async (discussionId: string, reply: ForumReply) => {
    // Optimistically add reply to UI immediately
    addReply(discussionId, reply);

    try {
      const response = await fetch(`${API_BASE_URL}/forum-replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: parseInt(discussionId),
          userEmail: 'user1@example.com', // Use a valid user email from database
          body: reply.content,
        }),
      });

      if (!response.ok) throw new Error('Failed to create reply');

      // Silently refresh in background to get proper IDs from server
      silentRefresh();
    } catch (error: any) {
      setError(error.message || 'Failed to create reply');
      // Rollback: refetch to get accurate state
      await fetchForumPosts();
      throw error;
    }
  }, [addReply, silentRefresh, fetchForumPosts, setError]);

  // Like a discussion
  const likeDiscussion = useCallback(async (discussionId: string) => {
    // Optimistically update like count in UI immediately
    likeDiscussionInStore(discussionId);

    try {
      const response = await fetch(`${API_BASE_URL}/forum-posts/likes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: parseInt(discussionId),
          clicked: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to update likes');

      // Silently refresh in background to sync with server
      silentRefresh();
    } catch (error: any) {
      setError(error.message || 'Failed to update likes');
      // Rollback: refetch to get accurate state
      await fetchForumPosts();
      throw error;
    }
  }, [likeDiscussionInStore, silentRefresh, fetchForumPosts, setError]);

  // Like a reply
  const likeReply = useCallback(async (discussionId: string, replyId: string) => {
    // Optimistically update like count in UI immediately
    likeReplyInStore(discussionId, replyId);

    try {
      const response = await fetch(`${API_BASE_URL}/forum-replies/likes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          replyId: parseInt(replyId),
          clicked: true,
        }),
      });

      if (!response.ok) throw new Error('Failed to update reply likes');

      // Silently refresh in background to sync with server
      silentRefresh();
    } catch (error: any) {
      setError(error.message || 'Failed to update reply likes');
      // Rollback: refetch to get accurate state
      await fetchForumPosts();
      throw error;
    }
  }, [likeReplyInStore, silentRefresh, fetchForumPosts, setError]);

  // Initial fetch on mount
  useEffect(() => {
    if (discussions.length === 0) {
      fetchForumPosts();
    }
  }, [discussions.length, fetchForumPosts]);

  return {
    discussions,
    isLoading,
    error,
    createDiscussion,
    createReply,
    likeDiscussion,
    likeReply,
    refreshDiscussions: fetchForumPosts,
  };
};
