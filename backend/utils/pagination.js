const paginate = (query, totalCount) => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(30000, Math.max(1, parseInt(query.limit) || 10));
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalCount / limit);
  return { page, limit, skip, totalPages, totalCount };
};

const cursorPaginate = (query) => {
  const limit = Math.min(30000, Math.max(1, parseInt(query.limit) || 10));
  const cursor = query.cursor ? parseInt(query.cursor, 10) : 0;
  return { limit, cursor };
};

module.exports = { paginate, cursorPaginate };
