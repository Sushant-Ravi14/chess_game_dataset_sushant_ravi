const Match = require('../models/Match');

const getTotalMatches = async () => {
  return await Match.countDocuments({ isDeleted: { $ne: true } });
};

const getTotalPlayers = async () => {
  const whitePlayers = await Match.distinct('white_id', { isDeleted: { $ne: true } });
  const blackPlayers = await Match.distinct('black_id', { isDeleted: { $ne: true } });
  const uniquePlayers = new Set([...whitePlayers, ...blackPlayers]);
  return uniquePlayers.size;
};

const getAverageRating = async () => {
  const result = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        avgWhite: { $avg: { $toInt: "$white_rating" } },
        avgBlack: { $avg: { $toInt: "$black_rating" } }
      }
    }
  ]);
  if (result.length > 0) {
    return Math.round((result[0].avgWhite + result[0].avgBlack) / 2);
  }
  return 1500;
};

const getTopOpenings = async (limit) => {
  const limitVal = parseInt(limit, 10) || 5;
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$opening_eco",
        name: { $first: "$opening_name" },
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limitVal },
    { $project: { eco: "$_id", name: 1, count: 1, _id: 0 } }
  ]);
};

const getCheckmateRate = async () => {
  const total = await getTotalMatches();
  if (total === 0) return 0;
  const count = await Match.countDocuments({ victory_status: 'mate', isDeleted: { $ne: true } });
  return (count / total) * 100;
};

const getResignationRate = async () => {
  const total = await getTotalMatches();
  if (total === 0) return 0;
  const count = await Match.countDocuments({ victory_status: 'resign', isDeleted: { $ne: true } });
  return (count / total) * 100;
};

const getTimeoutRate = async () => {
  const total = await getTotalMatches();
  if (total === 0) return 0;
  const count = await Match.countDocuments({ victory_status: { $in: ['outoftime', 'timeout'] }, isDeleted: { $ne: true } });
  return (count / total) * 100;
};

const getWhiteWinRate = async () => {
  const total = await getTotalMatches();
  if (total === 0) return 0;
  const count = await Match.countDocuments({ winner: 'white', isDeleted: { $ne: true } });
  return (count / total) * 100;
};

const getBlackWinRate = async () => {
  const total = await getTotalMatches();
  if (total === 0) return 0;
  const count = await Match.countDocuments({ winner: 'black', isDeleted: { $ne: true } });
  return (count / total) * 100;
};

const getDrawRate = async () => {
  const total = await getTotalMatches();
  if (total === 0) return 0;
  const count = await Match.countDocuments({ winner: 'draw', isDeleted: { $ne: true } });
  return (count / total) * 100;
};

module.exports = {
  getTotalMatches,
  getTotalPlayers,
  getAverageRating,
  getTopOpenings,
  getCheckmateRate,
  getResignationRate,
  getTimeoutRate,
  getWhiteWinRate,
  getBlackWinRate,
  getDrawRate
};
