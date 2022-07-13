export interface Video {
  caption: string;
  slug: {
    current: string;
  };
  video: {
    asset: {
      _id: string;
      url: string;
    };
  };
  _id: string;
  postedBy: {
    _id: string;
    username: string;
    image: string;
  };
  likes: {
    postedBy: {
      _id: string;
      username: string;
      image: string;
    };
  }[];
  comments: CommentProps[];
  userId: string;
}

export interface CommentProps {
  comment;
  _key;
  postedBy: {
    _id: string;
    username: string;
    image: string;
    _createdAt: string;
    _updatedAt: string;
  };
}
