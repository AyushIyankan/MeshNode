import { BigNumber } from 'ethers';

export type Address = `0x${string}` | undefined;

export type Type = 'Question' | 'Answer';

export interface Answer {
  id: BigNumber;
  author: Address;
  isBestAnswer: boolean;
  qid: BigNumber;
  upvotes: BigNumber;
  downvotes: BigNumber;
  comments: any[];
  uri: string;
}

export interface Question {
  id: BigNumber;
  answers: any[];
  author: Address;
  bestAnswerChosen: boolean;
  comments: any[];
  downvotes: BigNumber;
  tags: BigNumber[];
  upvotes: BigNumber;
  uri: string;
}

export interface UserContract {
  aUpvotes: BigNumber;
  answers: [];
  bestAnswerCount: BigNumber;
  comments: BigNumber[];
  id: BigNumber;
  qUpvotes: BigNumber;
  questions: BigNumber[];
  uri: string;
  userAddress: Address;
}

export interface UserMetadata {
  banner: string;
  bio: string;
  email: string;
  name: string;
  profile: string;
  personalWebsite: string;
  linkedin: string;
  github: string;
  twitter: string;
}

export interface Comment {
  id: BigNumber;
  parentPostType: BigNumber;
  parentPostId: BigNumber;
  author: Address;
  uri: string;
}
