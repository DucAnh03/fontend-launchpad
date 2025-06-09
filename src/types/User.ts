
export interface Skill {
  skill: string;
  level: number;
  createdAt: string;
}

export interface Subscription {
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled' | 'trial';
  autoRenew: boolean;
}

export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  level: number;
  points: number;
  userRank: string;
  isVerified: boolean;
  isUnlimited: boolean;
  role: 'user' | 'admin';
  subscription: Subscription;
  skills: Skill[];
  followers: string[];
  following: string[];
  followerCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}
