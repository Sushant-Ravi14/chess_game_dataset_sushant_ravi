const Match = require('../models/Match');
const { paginate } = require('../utils/pagination');

const getOpeningBasePipeline = (matchFilter = {}) => {
  return [
    { $match: { isDeleted: { $ne: true }, ...matchFilter } },
    {
      $group: {
        _id: "$opening_eco",
        eco: { $first: "$opening_eco" },
        name: { $first: "$opening_name" },
        totalGames: { $sum: 1 },
        whiteWins: { $sum: { $cond: [{ $eq: ["$winner", "white"] }, 1, 0] } },
        blackWins: { $sum: { $cond: [{ $eq: ["$winner", "black"] }, 1, 0] } },
        draws: { $sum: { $cond: [{ $eq: ["$winner", "draw"] }, 1, 0] } },
        totalTurns: { $sum: { $toInt: "$turns" } },
        openingPly: { $first: { $cond: [{ $ifNull: ["$opening_ply", false] }, { $toInt: "$opening_ply" }, 0] } }
      }
    },
    {
      $project: {
        eco: "$_id",
        name: 1,
        totalGames: 1,
        whiteWinRate: { $multiply: [{ $divide: ["$whiteWins", "$totalGames"] }, 100] },
        blackWinRate: { $multiply: [{ $divide: ["$blackWins", "$totalGames"] }, 100] },
        drawRate: { $multiply: [{ $divide: ["$draws", "$totalGames"] }, 100] },
        averageTurns: { $divide: ["$totalTurns", "$totalGames"] },
        complexityLevel: {
          $cond: [
            { $lte: ["$openingPly", 3] }, "Beginner",
            { $cond: [{ $lte: ["$openingPly", 6] }, "Intermediate", "Advanced"] }
          ]
        },
        isGambit: {
          $regexMatch: { input: "$name", regex: /gambit/i }
        },
        family: {
          $arrayElemAt: [{ $split: ["$name", ":"] }, 0]
        },
        _id: 0
      }
    }
  ];
};

const getAllOpenings = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const pipeline = getOpeningBasePipeline();
  
  // Calculate total count first
  const countPipeline = [
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: "$opening_eco" } },
    { $count: "count" }
  ];
  const countResult = await Match.aggregate(countPipeline);
  const totalCount = countResult.length > 0 ? countResult[0].count : 0;
  const meta = paginate(query, totalCount);

  // Sorting
  let sortStage = { totalGames: -1 };
  if (query.sort) {
    let cleanSort = query.sort.trim();
    let order = 1;
    if (cleanSort.startsWith('-')) {
      order = -1;
      cleanSort = cleanSort.substring(1);
    }
    if (cleanSort === 'totalGames' || cleanSort === 'games') sortStage = { totalGames: order };
    else if (cleanSort === 'whiteWinRate') sortStage = { whiteWinRate: order };
    else if (cleanSort === 'blackWinRate') sortStage = { blackWinRate: order };
    else if (cleanSort === 'drawRate') sortStage = { drawRate: order };
    else if (cleanSort === 'eco') sortStage = { eco: order };
    else if (cleanSort === 'name') sortStage = { name: order };
  }
  
  pipeline.push({ $sort: sortStage }, { $skip: skip }, { $limit: limit });

  const openings = await Match.aggregate(pipeline);
  return { data: openings, meta };
};

const getPopularOpenings = async (query) => {
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const pipeline = getOpeningBasePipeline();
  pipeline.push({ $sort: { totalGames: -1 } }, { $limit: limit });
  return await Match.aggregate(pipeline);
};

const getTrendingOpenings = async (query) => {
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const pipeline = getOpeningBasePipeline();
  pipeline.push({ $sort: { totalGames: -1, averageTurns: -1 } }, { $limit: limit });
  return await Match.aggregate(pipeline);
};

module.exports = {
  getAllOpenings,
  getPopularOpenings,
  getTrendingOpenings
};
