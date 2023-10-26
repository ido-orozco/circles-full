import CirclesConcept from "./concepts/circles";
import CommentConcept from "./concepts/comment";
import FeedConcept from "./concepts/feed";
import FriendConcept from "./concepts/friend";
import LikeConcept from "./concepts/like";
import PostConcept from "./concepts/post";
import UserConcept from "./concepts/user";
import WebSessionConcept from "./concepts/websession";

// App Definition using concepts
export const WebSession = new WebSessionConcept();
export const User = new UserConcept();
export const Post = new PostConcept();
export const Friend = new FriendConcept();
export const Like = new LikeConcept();
export const Comment = new CommentConcept();
export const Circles = new CirclesConcept();
export const Feed = new FeedConcept();
