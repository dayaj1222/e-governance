import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    type: { type: String, enum: ["citizen", "authority"], required: true },
    city: {
        type: String,
        required: function () {
            return this.type === "authority";
        },
    },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", UserSchema);
