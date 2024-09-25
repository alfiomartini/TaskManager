import mongoose, { Schema, Document } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  user: mongoose.Types.ObjectId;
}

const taskSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      required: true,
    },
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ITask>("Task", taskSchema);
