import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotFoundError } from "./errors";
// import errors

export interface CommentDoc extends BaseDoc {
  post: ObjectId;
  author: ObjectId;
  content: string;
}

export default class CommentConcept {
  public readonly comments = new DocCollection<CommentDoc>("comments");

  async create(post: ObjectId, author: ObjectId, content: string) {
    const _id = await this.comments.createOne({ post, author, content });
    return { msg: "Comment successfully created", comment: await this.comments.readOne({ _id }) };
  }

  async update(_id: ObjectId, newContent: string) {
    await this.comments.updateOne({ _id }, { content: newContent });
    return { msg: "Comment updated" };
  }

  async delete(_id: ObjectId) {
    await this.comments.deleteOne({ _id });
    return { msg: "Comment successfully deleted" };
  }

  async isAuthor(_id: ObjectId, user: ObjectId) {
    const comment = await this.comments.readOne({ _id });
    if (!comment) {
      throw new NotFoundError(`Comment ${_id} does not exist!`);
    }
    if (comment.author.toString() !== user.toString()) {
      throw new Error("User is not author of comment");
    }
  }
}
