const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema(
  {
    Annotator_ID: { type: Number, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    userType: { type: String, default: 'annotator' }
  },
  { versionKey: false }
);

// Generate random number and ensure it's unique
usersSchema.pre('save', async function (next) {
  if (!this.Annotator_ID) {
    let isUnique = false;
    while (!isUnique) {
      const randomId = Math.floor(100000 + Math.random() * 900000); // 6-digit random number
      const existingUser = await mongoose.models.User.findOne({ Annotator_ID: randomId });
      if (!existingUser) {
        this.Annotator_ID = randomId;
        isUnique = true;
      }
    }
  }
  next();
});

const User = mongoose.model('User', usersSchema);
module.exports = User;
