import { ObjectId } from "mongodb";
import DocCollection, { BaseDoc } from "../framework/doc";
import { NotAllowedError, NotFoundError } from "./errors";
// import errors

export interface CirclesDoc extends BaseDoc {
  user: ObjectId;
  name: string;
  description?: string;
}

export interface CirclesUsersDoc extends BaseDoc {
  circle: ObjectId;
  user: ObjectId;
}

export default class CirclesConcept {
  public readonly circles = new DocCollection<CirclesDoc>("circles");
  public readonly circleUsers = new DocCollection<CirclesUsersDoc>("circlesUsers");

  async createCircle(user: ObjectId, name: string, description?: string) {
    const _id = await this.circles.createOne({ user, name, description });
    return { msg: "Circle created successfully!", circle: await this.circles.readOne({ _id }) };
  }

  async updateCircle(_id: ObjectId, update: Partial<CirclesDoc>) {
    this.sanitizeUpdate(update);
    await this.circles.updateOne({ _id }, update);
    return { msg: "Circle updated!" };
  }

  async deleteCircle(_id: ObjectId) {
    void this.circles.deleteOne({ _id });
    void this.circleUsers.deleteMany({ circle: _id });
    return { msg: "Deleted Circle" };
  }

  async addUserToCircle(user: ObjectId, circle: ObjectId) {
    let circleExists = await this.circles.readOne({ circle });
    if (circleExists) {
      let userinCircle = await this.circleUsers.readOne({ user, circle });

      if (userinCircle) {
        return { msg: "User already in circle" };
      }

      await this.circleUsers.createOne({ user, circle });
      return { msg: "User added successfully" };
    }
    throw new Error("Circle does not exist");
  }

  async removeUserFromCircle(user: ObjectId, circle: ObjectId) {
    let circleExists = await this.circles.readOne({ circle });
    if (circleExists) {
      let userinCircle = await this.circleUsers.readOne({ user, circle });

      if (userinCircle) {
        await this.circleUsers.deleteOne({ user, circle });
        return { msg: "User removed successfully" };
      }
      return { msg: "User not in Circle" };
    }
    throw new Error("Circle does not exist");
  }

  async getCircleUsers(circle: ObjectId) {
    let circleExists = await this.circles.readOne({ circle });
    if (circleExists) {
      let users = await this.circleUsers.readMany({ circle });
      let userIds: Array<ObjectId> = [];
      users.forEach((user) => userIds.push(user._id));
      return userIds;
    }
    throw new Error("Circle does not exist");
  }

  private sanitizeUpdate(update: Partial<CirclesDoc>) {
    const allowedUpdates = ["name", "description"];
    for (const key in update) {
      if (!allowedUpdates.includes(key)) {
        throw new NotAllowedError("Cannot update ${key} field!");
      }
    }
  }

  async isOwner(user: ObjectId, _id: ObjectId) {
    const circle = await this.circles.readOne({ _id });
    if (!circle) {
      throw new NotFoundError(`Circle ${_id} does not exist!`);
    }
    if (circle.user.toString() !== user.toString()) {
      throw new Error("User does not own this Circle");
    }
  }
}
