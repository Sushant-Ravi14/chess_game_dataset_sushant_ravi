const Match = require('../models/Match');
const buildFilter = require('../utils/buildFilter');
const buildSort = require('../utils/buildSort');
const { paginate } = require('../utils/pagination');

const getAllMatches = async (query) => {
  const filter = buildFilter(query);
  const sort = buildSort(query.sort);
  
  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .sort(sort)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

module.exports = {
  getAllMatches,
};
