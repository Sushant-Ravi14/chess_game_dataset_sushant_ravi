const mongoose = require('mongoose');

const PlayerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    totalGames: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    draws: { type: Number, default: 0 },
    winRate: { type: Number, default: 0 },
    currentRating: { type: Number, default: 1500 },
    ratingHistory: [
      {
        matchId: String,
        rating: Number,
        playedAt: Date,
      },
    ],
    preferredOpenings: [
      {
        eco: String,
        name: String,
        count: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Player', PlayerSchema);
