import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  isAcceptingMessages: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "user name is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email  is required"],
    match: [/.+\@.+\..+/, 'please use a valid email']
  },
  password: {
    type: String,
    required: [true, "password  is required"]
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required  is required"]
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "verifycode   is required"]
  },
  isVerified: {
    type: Boolean,
    default: true,
  },
  isAcceptingMessages: {
    type: Boolean,
    default: true
  },
  messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)
export default UserModel;