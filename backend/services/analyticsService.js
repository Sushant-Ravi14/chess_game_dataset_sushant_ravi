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

const getRatingGapUpsets = async () => {
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        id: 1,
        white_id: 1,
        black_id: 1,
        white_rating: { $toInt: "$white_rating" },
        black_rating: { $toInt: "$black_rating" },
        winner: 1,
        opening_name: 1,
        victory_status: 1
      }
    },
    {
      $project: {
        id: 1,
        white_id: 1,
        black_id: 1,
        white_rating: 1,
        black_rating: 1,
        winner: 1,
        opening_name: 1,
        victory_status: 1,
        ratingDiff: {
          $cond: [
            { $eq: ["$winner", "white"] },
            { $subtract: ["$black_rating", "$white_rating"] },
            {
              $cond: [
                { $eq: ["$winner", "black"] },
                { $subtract: ["$white_rating", "$black_rating"] },
                0
              ]
            }
          ]
        }
      }
    },
    { $match: { ratingDiff: { $gt: 0 } } },
    { $sort: { ratingDiff: -1 } },
    { $limit: 20 }
  ]);
};

const getCheckmateFrequency = async () => {
  const result = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        checkmates: { $sum: { $cond: [{ $eq: ["$victory_status", "mate"] }, 1, 0] } }
      }
    },
    {
      $project: {
        total: 1,
        count: "$checkmates",
        percentage: { $multiply: [{ $divide: ["$checkmates", "$total"] }, 100] },
        _id: 0
      }
    }
  ]);
  return result[0] || { total: 0, count: 0, percentage: 0 };
};

const getDrawFrequency = async () => {
  const result = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        draws: { $sum: { $cond: [{ $or: [{ $eq: ["$winner", "draw"] }, { $eq: ["$victory_status", "draw"] }] }, 1, 0] } }
      }
    },
    {
      $project: {
        total: 1,
        count: "$draws",
        percentage: { $multiply: [{ $divide: ["$draws", "$total"] }, 100] },
        _id: 0
      }
    }
  ]);
  return result[0] || { total: 0, count: 0, percentage: 0 };
};

const getShortestGames = async (limit) => {
  const finalLimit = parseInt(limit, 10) || 10;
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        id: 1,
        white_id: 1,
        black_id: 1,
        winner: 1,
        turns: { $toInt: "$turns" },
        opening_name: 1,
        victory_status: 1
      }
    },
    { $sort: { turns: 1 } },
    { $limit: finalLimit }
  ]);
};

const getLongestGames = async (limit) => {
  const finalLimit = parseInt(limit, 10) || 10;
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        id: 1,
        white_id: 1,
        black_id: 1,
        winner: 1,
        turns: { $toInt: "$turns" },
        opening_name: 1,
        victory_status: 1
      }
    },
    { $sort: { turns: -1 } },
    { $limit: finalLimit }
  ]);
};

const getResignationFrequency = async () => {
  const result = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        resignations: { $sum: { $cond: [{ $eq: ["$victory_status", "resign"] }, 1, 0] } }
      }
    },
    {
      $project: {
        total: 1,
        count: "$resignations",
        percentage: { $multiply: [{ $divide: ["$resignations", "$total"] }, 100] },
        _id: 0
      }
    }
  ]);
  return result[0] || { total: 0, count: 0, percentage: 0 };
};

const getTimeoutFrequency = async () => {
  const result = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        timeouts: { $sum: { $cond: [{ $in: ["$victory_status", ["outoftime", "timeout"]] }, 1, 0] } }
      }
    },
    {
      $project: {
        total: 1,
        count: "$timeouts",
        percentage: { $multiply: [{ $divide: ["$timeouts", "$total"] }, 100] },
        _id: 0
      }
    }
  ]);
  return result[0] || { total: 0, count: 0, percentage: 0 };
};

const getOpeningSuccessRates = async () => {
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $group: {
        _id: "$opening_eco",
        eco: { $first: "$opening_eco" },
        name: { $first: "$opening_name" },
        totalGames: { $sum: 1 },
        whiteWins: { $sum: { $cond: [{ $eq: ["$winner", "white"] }, 1, 0] } },
        blackWins: { $sum: { $cond: [{ $eq: ["$winner", "black"] }, 1, 0] } },
        draws: { $sum: { $cond: [{ $eq: ["$winner", "draw"] }, 1, 0] } }
      }
    },
    {
      $project: {
        eco: 1,
        name: 1,
        totalGames: 1,
        whiteWinRate: { $multiply: [{ $divide: ["$whiteWins", "$totalGames"] }, 100] },
        blackWinRate: { $multiply: [{ $divide: ["$blackWins", "$totalGames"] }, 100] },
        drawRate: { $multiply: [{ $divide: ["$draws", "$totalGames"] }, 100] },
        _id: 0
      }
    },
    { $sort: { totalGames: -1 } },
    { $limit: 20 }
  ]);
};

const getPlayerGrowth = async () => {
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        month: { $dateToString: { format: "%Y-%m", date: { $toDate: { $toDouble: "$created_at" } } } },
        players: ["$white_id", "$black_id"]
      }
    },
    { $unwind: "$players" },
    {
      $group: {
        _id: "$month",
        uniquePlayers: { $addToSet: "$players" }
      }
    },
    {
      $project: {
        month: "$_id",
        activePlayersCount: { $size: "$uniquePlayers" },
        _id: 0
      }
    },
    { $sort: { month: 1 } }
  ]);
};

const getHourlyActivity = async () => {
  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    {
      $project: {
        date: { $toDate: { $toDouble: "$created_at" } }
      }
    },
    {
      $group: {
        _id: { $hour: "$date" },
        count: { $sum: 1 }
      }
    },
    { $project: { hour: "$_id", count: 1, _id: 0 } },
    { $sort: { hour: 1 } }
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
  getRatingGapUpsets,
  getCheckmateFrequency,
  getDrawFrequency,
  getShortestGames,
  getLongestGames,
  getResignationFrequency,
  getTimeoutFrequency,
  getOpeningSuccessRates,
  getPlayerGrowth,
  getHourlyActivity,
  getTopGames
};
