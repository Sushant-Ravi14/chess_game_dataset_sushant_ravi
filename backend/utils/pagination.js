const paginate = (query, totalCount) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);
  return { page, limit, skip, totalPages, totalCount };
};

module.exports = { paginate };
