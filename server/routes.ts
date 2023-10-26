import { ObjectId } from "mongodb";

import { Router, getExpressRouter } from "./framework/router";

import { Circles, Comment, Feed, Friend, Like, Post, User, WebSession } from "./app";
import { CirclesDoc } from "./concepts/circles";
import { PostDoc } from "./concepts/post";
import { UserDoc } from "./concepts/user";
import { WebSessionDoc } from "./concepts/websession";
import Responses from "./responses";

class Routes {
  @Router.get("/session")
  async getSessionUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.getUserById(user);
  }

  @Router.get("/users")
  async getUsers() {
    return await User.getUsers();
  }

  @Router.get("/users/:username")
  async getUser(username: string) {
    return await User.getUserByUsername(username);
  }

  @Router.post("/users")
  async createUser(session: WebSessionDoc, username: string, password: string) {
    WebSession.isLoggedOut(session);
    return await User.create(username, password);
  }

  @Router.patch("/users")
  async updateUser(session: WebSessionDoc, update: Partial<UserDoc>) {
    const user = WebSession.getUser(session);
    return await User.update(user, update);
  }

  @Router.delete("/users")
  async deleteUser(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    WebSession.end(session);
    return await User.delete(user);
  }

  @Router.post("/login")
  async logIn(session: WebSessionDoc, username: string, password: string) {
    const u = await User.authenticate(username, password);
    WebSession.start(session, u._id);
    return { msg: "Logged in!" };
  }

  @Router.post("/logout")
  async logOut(session: WebSessionDoc) {
    WebSession.end(session);
    return { msg: "Logged out!" };
  }

  @Router.get("/posts")
  async getPosts(author?: string) {
    let posts;
    if (author) {
      const id = (await User.getUserByUsername(author))._id;
      posts = await Post.getByAuthor(id);
    } else {
      posts = await Post.getPosts({});
    }
    return Responses.posts(posts);
  }

  @Router.post("/posts")
  async createPost(session: WebSessionDoc, content: string, circles: ObjectId[]) {
    const user = WebSession.getUser(session);
    // Create Post
    const created = await Post.create(user, content);

    // Get all users in the Circles posting to
    let allUsers: Array<ObjectId> = [];
    circles.forEach(async (circleId) => {
      const userIds = await Circles.getCircleUsers(circleId);
      allUsers = allUsers.concat(userIds);
    });

    // Publish to those users
    const post = created.post;
    if (post) await Feed.publish(allUsers, post._id);
    return { msg: created.msg, post: await Responses.post(created.post) };
  }

  @Router.patch("/posts/:_id")
  async updatePost(session: WebSessionDoc, _id: ObjectId, update: Partial<PostDoc>) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return await Post.update(_id, update);
  }

  @Router.delete("/posts/:_id")
  async deletePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Post.isAuthor(user, _id);
    return Post.delete(_id);
  }

  @Router.post("/posts/:_id/like")
  async likePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.like(_id, user);
  }

  @Router.delete("/posts/:_id/unlike")
  async unlikePost(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    return await Like.unlike(_id, user);
  }

  @Router.post("/posts/:_id/comment")
  async commentPost(session: WebSessionDoc, _id: ObjectId, content: string) {
    const user = WebSession.getUser(session);
    return await Comment.create(_id, user, content);
  }

  @Router.patch("/posts/comment/:_id")
  async updateComment(session: WebSessionDoc, _id: ObjectId, newContent: string) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(_id, user);
    return await Comment.update(_id, newContent);
  }

  @Router.delete("/posts/comment/:_id")
  async deleteComment(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Comment.isAuthor(_id, user);
    return await Comment.delete(_id);
  }

  @Router.get("/friends")
  async getFriends(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await User.idsToUsernames(await Friend.getFriends(user));
  }

  @Router.delete("/friends/:friend")
  async removeFriend(session: WebSessionDoc, friend: string) {
    const user = WebSession.getUser(session);
    const friendId = (await User.getUserByUsername(friend))._id;
    return await Friend.removeFriend(user, friendId);
  }

  @Router.get("/friend/requests")
  async getRequests(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Responses.friendRequests(await Friend.getRequests(user));
  }

  @Router.post("/friend/requests/:to")
  async sendFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.sendRequest(user, toId);
  }

  @Router.delete("/friend/requests/:to")
  async removeFriendRequest(session: WebSessionDoc, to: string) {
    const user = WebSession.getUser(session);
    const toId = (await User.getUserByUsername(to))._id;
    return await Friend.removeRequest(user, toId);
  }

  @Router.put("/friend/accept/:from")
  async acceptFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.acceptRequest(fromId, user);
  }

  @Router.put("/friend/reject/:from")
  async rejectFriendRequest(session: WebSessionDoc, from: string) {
    const user = WebSession.getUser(session);
    const fromId = (await User.getUserByUsername(from))._id;
    return await Friend.rejectRequest(fromId, user);
  }

  @Router.post("/circles")
  async createCircle(session: WebSessionDoc, name: string, description?: string) {
    const user = WebSession.getUser(session);
    return await Circles.createCircle(user, name, description);
  }

  @Router.patch("/circles/:_id")
  async updateCircle(session: WebSessionDoc, _id: ObjectId, update: Partial<CirclesDoc>) {
    const user = WebSession.getUser(session);
    await Circles.isOwner(user, _id);
    return await Circles.updateCircle(_id, update);
  }

  @Router.delete("/circles/:_id")
  async deleteCircle(session: WebSessionDoc, _id: ObjectId) {
    const user = WebSession.getUser(session);
    await Circles.isOwner(user, _id);
    return await Circles.deleteCircle(_id);
  }

  @Router.post("/circles/:_id/:user")
  async addUserToCircle(session: WebSessionDoc, _id: ObjectId, user: ObjectId) {
    const owner = WebSession.getUser(session);
    await Circles.isOwner(owner, _id);
    return await Circles.addUserToCircle(user, _id);
  }

  @Router.delete("/circles/:_id/:user")
  async deleteUserInCircle(session: WebSessionDoc, _id: ObjectId, user: ObjectId) {
    const owner = WebSession.getUser(session);
    await Circles.isOwner(owner, _id);
    return await Circles.removeUserFromCircle(user, _id);
  }

  @Router.get("/circles/:_id")
  async getUsersInCircle(session: WebSessionDoc, _id: ObjectId) {
    const owner = WebSession.getUser(session);
    await Circles.isOwner(owner, _id);
    return await Circles.getCircleUsers(_id);
  }

  @Router.get("/feed")
  async getFeed(session: WebSessionDoc) {
    const user = WebSession.getUser(session);
    return await Feed.getFeed(user);
  }

  @Router.patch("/feed/:post")
  async viewPost(session: WebSessionDoc, post: ObjectId) {
    const user = WebSession.getUser(session);
    return await Feed.viewPost(user, post);
  }
}

export default getExpressRouter(new Routes());
