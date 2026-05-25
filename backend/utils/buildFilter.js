const buildFilter = (query) => {
  const filter = { isDeleted: { $ne: true } }; // Default soft-delete filter

  if (query.rated !== undefined && query.rated !== '') {
    const isRated = query.rated === 'true';
    filter.rated = isRated ? { $in: ['TRUE', 'True'] } : { $in: ['FALSE', 'False'] };
  }

  if (query.time_control) {
    filter.increment_code = query.time_control;
  }

  if (query.winner) {
    filter.winner = query.winner.toLowerCase();
  }

  const andExprs = [];
  if (query.min_rating || query.max_rating) {
    const min = query.min_rating ? parseInt(query.min_rating, 10) : 0;
    const max = query.max_rating ? parseInt(query.max_rating, 10) : 9999;
    andExprs.push({
      $or: [
        { $and: [{ $gte: [{ $toInt: "$white_rating" }, min] }, { $lte: [{ $toInt: "$white_rating" }, max] }] },
        { $and: [{ $gte: [{ $toInt: "$black_rating" }, min] }, { $lte: [{ $toInt: "$black_rating" }, max] }] }
      ]
    });
  }

  if (query.from_date || query.to_date) {
    if (query.from_date) {
      const fromMs = new Date(query.from_date).getTime();
      if (!isNaN(fromMs)) andExprs.push({ $gte: [{ $toDouble: "$created_at" }, fromMs] });
    }
    if (query.to_date) {
      const toMs = new Date(query.to_date).getTime();
      if (!isNaN(toMs)) andExprs.push({ $lte: [{ $toDouble: "$created_at" }, toMs] });
    }
  }

  if (andExprs.length > 0) {
    filter.$expr = { $and: andExprs };
  }

  return filter;
};

module.exports = buildFilter;
