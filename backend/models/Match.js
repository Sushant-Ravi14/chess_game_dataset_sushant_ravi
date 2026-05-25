const mongoose = require('mongoose');

const MatchSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, index: true },
    rated: { type: String, required: true, index: true },
    created_at: { type: String, required: true },
    last_move_at: { type: String, required: true },
    turns: { type: String, required: true },
    victory_status: { type: String, required: true },
    winner: { type: String, required: true, index: true },
    increment_code: { type: String, required: true, index: true },
    white_id: { type: String, required: true, index: true },
    white_rating: { type: String, required: true },
    black_id: { type: String, required: true, index: true },
    black_rating: { type: String, required: true },
    moves: { type: String, required: true },
    opening_eco: { type: String, required: true, index: true },
    opening_name: { type: String, required: true },
    opening_ply: { type: String, required: true },
    isDeleted: { type: Boolean, default: false, index: true },
    isArchived: { type: Boolean, default: false, index: true },
  },
  {
    collection: 'chessData',
    timestamps: true,
  }
);

MatchSchema.index({ created_at: -1 });

module.exports = mongoose.model('Match', MatchSchema);
