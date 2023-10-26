import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
// import errors

export interface FeedDoc extends BaseDoc {
  user: ObjectId;
  post: ObjectId;
  viewed: "true" | "false";
}

export default class FeedConcept {
  public readonly feeds = new DocCollection<FeedDoc>("feed");

  async publish(users: ObjectId[], post: ObjectId) {
    users.forEach((user) => {
      void this.feeds.createOne({ user, post });
    });
  }

  async viewPost(user: ObjectId, post: ObjectId) {
    this.feeds.updateOne({ user, post }, { viewed: "true" });
  }

  async getFeed(user: ObjectId) {
    const postEntry = await this.feeds.readMany({ user });
    let allPosts: Array<ObjectId> = [];
    postEntry.forEach(async (doc) => {
      if (doc) allPosts.push(doc.post);
    });
  }
}
