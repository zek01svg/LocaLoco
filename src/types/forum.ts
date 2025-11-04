export interface ForumReply {
  id: string;
  discussionId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ForumDiscussion {
  id: string;
  title: string;
  businessTag?: string;
  content: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  likes: number;
  replies: ForumReply[];
}
