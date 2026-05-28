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

const updateMatch = async (id, data) => {
  const match = await getMatchById(id);
  
  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined) {
      match[key] = data[key];
    }
  });
  await match.save();
  return match;
};

const deleteMatch = async (id) => {
  const match = await getMatchById(id);
  match.isDeleted = true;
  match.isDeletedAt = new Date();
  await match.save();
  return { id: match.id, isDeleted: true };
};

const getMatchMoves = async (id) => {
  const match = await getMatchById(id);
  return { moves: match.moves.split(' ') };
};

const getMatchPGN = async (id) => {
  const match = await getMatchById(id);
  const pgn = `[Event "Online Match"]
[Site "Chess Analytics Platform"]
[Date "${match.created_at}"]
[Round "?"]
[White "${match.white_id}"]
[Black "${match.black_id}"]
[Result "${match.winner === 'white' ? '1-0' : match.winner === 'black' ? '0-1' : '1/2-1/2'}"]
[WhiteElo "${match.white_rating}"]
[BlackElo "${match.black_rating}"]
[ECO "${match.opening_eco}"]

${match.moves}`;

  return { pgn };
};

const getMatchFEN = async (id) => {
  const match = await getMatchById(id);
  return { fen: match.final_fen || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1' };
};

const getMatchAnalysis = async (id) => {
  const match = await getMatchById(id);
  return { analysis: match.analysis || null };
};

const getLatestMatches = async (query) => {
  const filter = buildFilter(query);
  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);
  const matches = await Match.find(filter)
    .sort({ created_at: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const getTrendingMatches = async (query) => {
  const filter = buildFilter(query);
  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);
  const matches = await Match.find({ ...filter, rated: { $in: ['TRUE', 'True'] } })
    .sort({ turns: -1, created_at: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const getRandomMatch = async () => {
  const matches = await Match.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $sample: { size: 1 } }
  ]);
  
  if (matches.length === 0) {
    throw Object.assign(new Error('No matches found'), { statusCode: 404 });
  }
  
  return matches[0];
};

const archiveMatch = async (id) => {
  const match = await getMatchById(id);
  match.isArchived = true;
  await match.save();
  return match;
};

const restoreMatch = async (id) => {
  let match = null;
  const query = {};
  
  if (mongoose.Types.ObjectId.isValid(id)) {
    match = await Match.findOne({ _id: id, ...query });
  }
  if (!match) {
    match = await Match.findOne({ id, ...query });
  }
  
  if (!match) {
    throw Object.assign(new Error('Match not found'), { statusCode: 404 });
  }

  match.isArchived = false;
  match.isDeleted = false;
  match.isDeletedAt = null;
  await match.save();
  return match;
};

module.exports = {
  getAllMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
  getMatchMoves,
  getMatchPGN,
  getMatchFEN,
  getMatchAnalysis,
  getLatestMatches,
  getTrendingMatches,
  getRandomMatch,
  archiveMatch,
  restoreMatch,
};
