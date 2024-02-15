import mongoose, {models, Schema} from "mongoose";

const noteSchema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    description: {
      type: String,
      required: true,
      minLength: [1, "Please add more words to description"],
    },
    markedImportant: {
      type: Boolean,
      required: false,
    },
    reminderDate: {
      type: Date,
      required: false,
    },
    reminderTime: {
      type: String,
      required: false,
    },
  },
  {timestamps: true}
);

const NoteSchema = models?.Note || mongoose.model("Note", noteSchema);

export default NoteSchema;
