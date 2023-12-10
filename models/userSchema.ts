import mongoose, {models} from "mongoose";
import {Schema} from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      match: /.+\@.+\..+/,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    tokenId: {
      type: String,
      required: false,
    },
    tokenPasswordExpired: {
      type: Date,
      required: false,
    },
  },
  {timestamps: true}
);

const User = models?.User || mongoose.model("User", userSchema);
export default User;
