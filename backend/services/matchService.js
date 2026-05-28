const mongoose = require('mongoose'); 
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


const getMatchById = async (id) => {
  let match = null;
  const query = { isDeleted: { $ne: true } };

  if (mongoose.Types.ObjectId.isValid(id)) {
    match = await Match.findOne({ _id: id, ...query });
  }
  
  if (!match) {
    match = await Match.findOne({ id, ...query });
  }

  if (!match) {
    throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  }
  return match;
};

const createMatch = async (data) => {
  const match = new Match(data);
  await match.save();
  return match;
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
};
