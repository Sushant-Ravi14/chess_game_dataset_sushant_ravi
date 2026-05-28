const Match = require('../models/Match');
const { paginate } = require('../utils/pagination');

let recentSearches = [];
const popularSearchesMap = new Map();

const trackSearch = (q) => {
  if (!q || q.trim() === '') return;
  const term = q.trim().toLowerCase();

  recentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 10);

  popularSearchesMap.set(term, (popularSearchesMap.get(term) || 0) + 1);
};

const searchMatches = async (q, query) => {
  trackSearch(q);
  const regex = new RegExp(q, 'i');
  
  const filter = {
    isDeleted: { $ne: true },
    $or: [
      { opening_name: regex },
      { white_id: regex },
      { black_id: regex },
      { opening_eco: regex }
    ]
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .sort({ created_at: -1 })
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const searchPlayers = async (q, query) => {
  trackSearch(q);
  const regex = new RegExp(q, 'i');

  const filter = {
    isDeleted: { $ne: true },
    $or: [
      { white_id: regex },
      { black_id: regex }
    ]
  };

  const usernames = await Match.aggregate([
    { $match: filter },
    { $project: { players: ["$white_id", "$black_id"] } },
    { $unwind: "$players" },
    { $match: { players: regex } },
    { $group: { _id: "$players" } },
    { $project: { username: "$_id", _id: 0 } }
  ]);

  const totalCount = usernames.length;
  const meta = paginate(query, totalCount);

  const paginatedUsernames = usernames.slice(meta.skip, meta.skip + meta.limit);

  return { data: paginatedUsernames, meta };
};

const searchOpenings = async (q, query) => {
  trackSearch(q);
  const regex = new RegExp(q, 'i');

  const filter = {
    isDeleted: { $ne: true },
    opening_name: regex
  };

  const openings = await Match.aggregate([
    { $match: filter },
    {
      $group: {
        _id: "$opening_eco",
        eco: { $first: "$opening_eco" },
        name: { $first: "$opening_name" },
        totalGames: { $sum: 1 }
      }
    },
    { $project: { eco: "$_id", name: 1, totalGames: 1, _id: 0 } },
    { $sort: { totalGames: -1 } }
  ]);

  const totalCount = openings.length;
  const meta = paginate(query, totalCount);
  const paginatedOpenings = openings.slice(meta.skip, meta.skip + meta.limit);

  return { data: paginatedOpenings, meta };
};

const searchByEco = async (q) => {
  trackSearch(q);
  const regex = new RegExp(`^${q}`, 'i');

  return await Match.aggregate([
    { $match: { isDeleted: { $ne: true }, opening_eco: regex } },
    {
      $group: {
        _id: "$opening_eco",
        eco: { $first: "$opening_eco" },
        name: { $first: "$opening_name" },
        totalGames: { $sum: 1 }
      }
    },
    { $project: { eco: "$_id", name: 1, totalGames: 1, _id: 0 } },
    { $sort: { totalGames: -1 } }
  ]);
};

const searchMoveSequence = async (moves, query) => {
  const normalizedMoves = moves.replace(/,/g, ' ').trim();
  trackSearch(normalizedMoves);
  const filter = {
    isDeleted: { $ne: true },
    moves: { $regex: new RegExp(`^${normalizedMoves}`, 'i') }
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const fuzzySearch = async (q) => {
  trackSearch(q);
  const regex = new RegExp(q.split('').join('.*'), 'i');

  const filter = {
    isDeleted: { $ne: true },
    $or: [
      { opening_name: regex },
      { white_id: regex },
      { black_id: regex },
      { opening_eco: regex }
    ]
  };

  return await Match.find(filter).limit(10);
};

const autocomplete = async (q) => {
  if (!q || q.trim() === '') return [];
  const regex = new RegExp(`^${q}`, 'i');

  const users = await Match.aggregate([
    {
      $match: {
        isDeleted: { $ne: true },
        $or: [{ white_id: regex }, { black_id: regex }]
      }
    },
    { $project: { players: ["$white_id", "$black_id"] } },
    { $unwind: "$players" },
    { $match: { players: regex } },
    { $group: { _id: "$players" } },
    { $limit: 4 }
  ]);

  const openings = await Match.aggregate([
    { $match: { isDeleted: { $ne: true }, opening_name: regex } },
    { $group: { _id: "$opening_name" } },
    { $limit: 4 }
  ]);

  const suggestions = [
    ...users.map(u => ({ type: 'player', text: u._id })),
    ...openings.map(o => ({ type: 'opening', text: o._id }))
  ].slice(0, 8);

  return suggestions;
};

const getRecentSearches = async () => {
  return recentSearches;
};

const getPopularSearches = async () => {
  const sorted = [...popularSearchesMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(entry => entry[0]);
  return sorted;
};

module.exports = {
  searchMatches,
  searchPlayers,
  searchOpenings,
  searchByEco,
  searchMoveSequence,
  fuzzySearch,
  autocomplete,
  getRecentSearches,
  getPopularSearches
};
