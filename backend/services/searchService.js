const Match = require('../models/Match');
const { paginate } = require('../utils/pagination');

// Escape regex special characters to prevent ReDoS attacks
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
  const regex = new RegExp(escapeRegex(q), 'i');
  
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
  const regex = new RegExp(escapeRegex(q), 'i');

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
  const regex = new RegExp(escapeRegex(q), 'i');

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

const advancedSearch = async (params, query) => {
  const filter = { isDeleted: { $ne: true } };

  if (params.rated) {
    const isRated = params.rated === 'true';
    filter.rated = isRated ? { $in: ['TRUE', 'True'] } : { $in: ['FALSE', 'False'] };
  }

  if (params.winner) {
    filter.winner = params.winner.toLowerCase();
  }

  if (params.opening_eco) {
    filter.opening_eco = params.opening_eco.toUpperCase();
  }

  if (params.victory_status) {
    filter.victory_status = params.victory_status.toLowerCase();
  }

  const andExprs = [];
  if (params.min_rating) {
    andExprs.push({ $gte: [{ $toInt: "$white_rating" }, parseInt(params.min_rating, 10)] });
    andExprs.push({ $gte: [{ $toInt: "$black_rating" }, parseInt(params.min_rating, 10)] });
  }

  if (params.max_rating) {
    andExprs.push({ $lte: [{ $toInt: "$white_rating" }, parseInt(params.max_rating, 10)] });
    andExprs.push({ $lte: [{ $toInt: "$black_rating" }, parseInt(params.max_rating, 10)] });
  }

  if (andExprs.length > 0) {
    filter.$expr = { $and: andExprs };
  }

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const searchByRating = async (rating, query) => {
  const r = parseInt(rating, 10);
  const min = r - 50;
  const max = r + 50;

  const filter = {
    isDeleted: { $ne: true },
    $expr: {
      $or: [
        { $and: [{ $gte: [{ $toInt: "$white_rating" }, min] }, { $lte: [{ $toInt: "$white_rating" }, max] }] },
        { $and: [{ $gte: [{ $toInt: "$black_rating" }, min] }, { $lte: [{ $toInt: "$black_rating" }, max] }] }
      ]
    }
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const searchByDateRange = async (from, to, query) => {
  const fromMs = new Date(from).getTime();
  const toMs = new Date(to).getTime();

  const filter = {
    isDeleted: { $ne: true },
    $expr: {
      $and: [
        { $gte: [{ $toDouble: "$created_at" }, fromMs] },
        { $lte: [{ $toDouble: "$created_at" }, toMs] }
      ]
    }
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const searchOpeningFamily = async (family, query) => {
  const regex = new RegExp(family, 'i');
  const filter = {
    isDeleted: { $ne: true },
    opening_name: regex
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const searchCheckmatePatterns = async (q, query) => {
  const regex = new RegExp(escapeRegex(q), 'i');
  const filter = {
    isDeleted: { $ne: true },
    victory_status: 'mate',
    opening_name: regex
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
};

const searchEndgames = async (q, query) => {
  const regex = new RegExp(escapeRegex(q), 'i');
  const filter = {
    isDeleted: { $ne: true },
    opening_name: regex,
    $expr: { $gte: [{ $toInt: "$turns" }, 60] }
  };

  const totalCount = await Match.countDocuments(filter);
  const meta = paginate(query, totalCount);

  const matches = await Match.find(filter)
    .skip(meta.skip)
    .limit(meta.limit);

  return { data: matches, meta };
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
  getPopularSearches,
  advancedSearch,
  searchByRating,
  searchByDateRange,
  searchOpeningFamily,
  searchCheckmatePatterns,
  searchEndgames
};
