import mongoose from "mongoose";

interface IUser extends Document {
  name: string;
  mobileNumber: number;
  members: number;
  otp?: number;
}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  mobileNumber: {
    type: Number,
    require: true,
  },
  members: {
    type: Number,
    require: true,
    default: 0,
  },
  otp: {
    type: Number,
  },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
