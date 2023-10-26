import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
// import errors

export interface LikeDoc extends BaseDoc {
  post: ObjectId;
  user: ObjectId;
}

export default class LikeConcept {
  public readonly likes = new DocCollection<LikeDoc>("likes");

  async like(post: ObjectId, user: ObjectId) {
    await this.likes.createOne({ post, user });
    return { msg: "Successfully liked" };
  }

  async unlike(post: ObjectId, user: ObjectId) {
    void this.likes.deleteOne({ post, user });
    return { msg: "Successfully unliked" };
  }
}
