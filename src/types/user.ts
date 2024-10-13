import type { IDateValue, ISocialLink } from './common';

// ----------------------------------------------------------------------

export type IUserTableFilters = {
  name: string;
  role?: string[];
  status: string;
  selectedColumn: string;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserItem = {
  id: string;
  name: string;
  first_name: string; // Added field for first name
  last_name: string; // Added field for last name
  city: string;
  state: string;
  reserved_cities: string; // Added field for reserved city
  reserved_states: string; // Added field for reserved city
  role: string;
  email: string;
  phone_number: string; // Changed to snake_case
  phone: string; // Added field for phone
  referred_by_first_name?: string; // Changed to snake_case
  referred_by_last_name?: string; // Changed to snake_case
  status: string;
  address1: string;
  address2: string;
  country: string;
  zip_code: string; // Changed to snake_case
  company: string;
  avatar_url: string; // Changed to snake_case
  is_verified: boolean; // Changed to snake_case
};

export type IUserAccount = {
  city: string;
  email: string;
  state: string;
  about: string;
  address: string;
  zipCode: string;
  isPublic: boolean;
  displayName: string;
  phoneNumber: string;
  country: string | null;
  photoURL: File | string | null;
};

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  invoiceNumber: string;
  createdAt: IDateValue;
};
