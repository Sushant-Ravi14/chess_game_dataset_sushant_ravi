const Match = require('../models/Match');
const { paginate } = require('../utils/pagination');

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
  getTopGames
};
