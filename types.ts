export type User = {
  _id: string;
  username: string;
  email: string;
  password: string;
  fullname: string;
  profileImg: {
    url: string;
    publicId: string;
  },
  coverImg: {
    url: string;
    publicId: string;
  },
  followers: string[];
  following: string[];
  bio: string;
  link: string;
  likedPosts: string[];
  createdAt: Date;
  updatedAt: Date;
};

export type Post = {
  _id: string;
  user: {
    _id: string;
    fullname: string;
    username: string;
    profileImg: {
      url: string;
    };
  };
  text: string;
  imgs: {
    url: string;
    publicId: string;
  }[];
  likes: string[];
  comments: {
    text: string;
    user: string;
  }[];
  reposts: string[];
  favorites: string[];
  views: string[];
  createdAt: Date;
};

export type Notification = {
  _id: string;
  from: {
    profileImg: {
      url: string
    },
    username: string;
  },
  to: {
    username: string;
  }
  post: {
    _id: string;
    text: string;
  }
  comment: {
    _id: string;
    type: string;
    content: string;
  }
  type: string;
  read: boolean;
};

export type Comment = {
  _id: string;
  postId: string;
  from: {
    _id: string,
    username: string,
    profileImg: {
      url: string;
    }
  }
  to: string | null;
  content: string;
  likes: string[],
  createdAt: Date
};