const Match = require('../models/Match');
const { paginate } = require('../utils/pagination');

const getVictoryDistribution = async () => {
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$winner', count: { $sum: 1 } } },
    { $project: { winner: '$_id', count: 1, _id: 0 } },
    { $sort: { count: -1 } }
  ]);
};

const getColorAdvantage = async () => {
  const result = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        white: { $sum: { $cond: [{ $eq: ["$winner", "white"] }, 1, 0] } },
        black: { $sum: { $cond: [{ $eq: ["$winner", "black"] }, 1, 0] } },
        draw: { $sum: { $cond: [{ $eq: ["$winner", "draw"] }, 1, 0] } }
      }
    },
    {
      $project: {
        total: 1,
        white: { count: "$white", percentage: { $multiply: [{ $divide: ["$white", "$total"] }, 100] } },
        black: { count: "$black", percentage: { $multiply: [{ $divide: ["$black", "$total"] }, 100] } },
        draw: { count: "$draw", percentage: { $multiply: [{ $divide: ["$draw", "$total"] }, 100] } },
        _id: 0
      }
    }
  ]);
  return result[0] || { total: 0, white: { count: 0, percentage: 0 }, black: { count: 0, percentage: 0 }, draw: { count: 0, percentage: 0 } };
};

const getAverageTurnCount = async () => {
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$increment_code",
        averageTurns: { $avg: { $toInt: "$turns" } },
        count: { $sum: 1 }
      }
    },
    { $project: { timeControl: "$_id", averageTurns: 1, count: 1, _id: 0 } },
    { $sort: { count: -1 } }
  ]);
};

const getRatedVsCasual = async () => {
  const result = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        rated: { $sum: { $cond: [{ $in: ["$rated", ["TRUE", "True"]] }, 1, 0] } }
      }
    },
    {
      $project: {
        total: 1,
        ratedCount: "$rated",
        casualCount: { $subtract: ["$total", "$rated"] },
        ratedPercentage: { $multiply: [{ $divide: ["$rated", "$total"] }, 100] },
        casualPercentage: { $multiply: [{ $divide: [{ $subtract: ["$total", "$rated"] }, "$total"] }, 100] },
        _id: 0
      }
    }
  ]);
  return result[0] || { total: 0, ratedCount: 0, casualCount: 0, ratedPercentage: 0, casualPercentage: 0 };
};

const getTimeControlUsage = async () => {
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$increment_code",
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        timeControl: "$_id",
        count: 1,
        _id: 0
      }
    },
    { $sort: { count: -1 } }
  ]);
};

const getTopGames = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = { isDeleted: { $ne: true } };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const pipeline = [
    { $match: filter },
    {
      $addFields: {
        totalRating: { $add: [{ $toInt: "$white_rating" }, { $toInt: "$black_rating" }] }
      }
    },
    { $sort: { totalRating: -1 } },
    { $skip: skip },
    { $limit: limit }
  ];

  const matches = await Match.aggregate(pipeline);
  return { data: matches, meta };
};

module.exports = {
  getVictoryDistribution,
  getColorAdvantage,
  getAverageTurnCount,
  getRatedVsCasual,
  getTimeControlUsage,
  getTopGames
};
