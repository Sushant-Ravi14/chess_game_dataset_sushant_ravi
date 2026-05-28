const Match = require('../models/Match');
const { paginate } = require('../utils/pagination');

const getPlayerAggregatePipeline = (usernameFilter = null, skip = 0, limit = 10) => {
  const pipeline = [
    { $match: { isDeleted: { $ne: true } } }
  ];

  if (usernameFilter) {
    pipeline.push({
      $match: {
        $or: [{ white_id: usernameFilter }, { black_id: usernameFilter }]
      }
    });
  }

  pipeline.push(
    { $sort: { created_at: 1 } },
    {
      $project: {
        created_at: 1,
        white_id: 1,
        black_id: 1,
        white_rating: 1,
        black_rating: 1,
        winner: 1
      }
    },
    {
      $project: {
        created_at: 1,
        players: [
          { username: "$white_id", rating: "$white_rating", isWhite: true, winner: "$winner" },
          { username: "$black_id", rating: "$black_rating", isWhite: false, winner: "$winner" }
        ]
      }
    },
    { $unwind: "$players" }
  );

  if (usernameFilter) {
    pipeline.push({ $match: { "players.username": usernameFilter } });
  }

  pipeline.push(
    {
      $group: {
        _id: "$players.username",
        totalGames: { $sum: 1 },
        wins: {
          $sum: {
            $cond: [
              {
                $or: [
                  { $and: [{ $eq: ["$players.winner", "white"] }, { $eq: ["$players.isWhite", true] }] },
                  { $and: [{ $eq: ["$players.winner", "black"] }, { $eq: ["$players.isWhite", false] }] }
                ]
              },
              1, 0
            ]
          }
        },
        draws: {
          $sum: { $cond: [{ $eq: ["$players.winner", "draw"] }, 1, 0] }
        },
        ratings: { $push: { $toInt: "$players.rating" } },
        timestamps: { $push: "$created_at" }
      }
    },
    {
      $project: {
        username: "$_id",
        totalGames: 1,
        wins: 1,
        draws: 1,
        losses: { $subtract: ["$totalGames", { $add: ["$wins", "$draws"] }] },
        currentRating: { $arrayElemAt: ["$ratings", -1] },
        ratingHistory: {
          $map: {
            input: { $range: [0, { $size: "$ratings" }] },
            as: "idx",
            in: {
              rating: { $arrayElemAt: ["$ratings", "$$idx"] },
              playedAt: { $arrayElemAt: ["$timestamps", "$$idx"] }
            }
          }
        },
        winRate: {
          $cond: [
            { $gt: ["$totalGames", 0] },
            { $multiply: [{ $divide: ["$wins", "$totalGames"] }, 100] },
            0
          ]
        }
      }
    }
  );

  return pipeline;
};

const getAllPlayers = async (query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  // Fast count of distinct players
  const countPipeline = [
    { $match: { isDeleted: { $ne: true } } },
    { $project: { players: ["$white_id", "$black_id"] } },
    { $unwind: "$players" },
    { $group: { _id: "$players" } },
    { $count: "count" }
  ];
  
  const countResult = await Match.aggregate(countPipeline);
  const totalCount = countResult.length > 0 ? countResult[0].count : 0;
  const meta = paginate(query, totalCount);

  const pipeline = getPlayerAggregatePipeline();
  pipeline.push({ $sort: { currentRating: -1 } }, { $skip: skip }, { $limit: limit });

  const players = await Match.aggregate(pipeline);
  return { data: players, meta };
};

const getPlayerByUsername = async (username) => {
  const pipeline = getPlayerAggregatePipeline(username);
  const result = await Match.aggregate(pipeline);
  if (result.length === 0) {
    throw Object.assign(new Error(`Player ${username} not found`), { statusCode: 404 });
  }
  return result[0];
};

const getPlayerHistory = async (username, query) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter = {
    isDeleted: { $ne: true },
    $or: [{ white_id: username }, { black_id: username }]
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limit);

  return { data: matches, meta };
};

module.exports = {
  getAllPlayers,
  getPlayerByUsername,
  getPlayerHistory,
};
