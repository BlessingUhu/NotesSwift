import {Schema} from "mongoose";
import mongoose, {models} from "mongoose";

const tokenSchema = new Schema({
  userID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  token: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    default: Date.now,
    expires: 3600,
  },
});

const Token = models?.Token || mongoose.model("Token", tokenSchema);

export default Token;
