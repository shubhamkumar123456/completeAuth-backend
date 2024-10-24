const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    googleId: { type: String },
    email: { type: String, required: true },
    name: { type: String, required: true },
    picture: { type: String },
    password: { type: String },
    isAdmin: {
        type: Boolean,
        default: false
    },
    Exam: [
        { type: mongoose.Schema.ObjectId, ref: "Exam" }
    ]
});

userSchema.pre('save', async function (next) {
    const user = this;

    // Only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the generated salt
        user.password = await bcrypt.hashSync(user.password, salt);

        next();
    } catch (err) {
        return next(err);
    }
});
module.exports = mongoose.model('User', userSchema);