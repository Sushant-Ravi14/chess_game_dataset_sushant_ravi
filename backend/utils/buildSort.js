const buildSort = (sortStr) => {
  if (!sortStr) return { created_at: -1 };

  let desc = false;
  let field = sortStr.trim();

  if (field.startsWith('-')) {
    desc = true;
    field = field.substring(1);
  }

  const fieldMapping = {
    createdAt: 'created_at',
    created_at: 'created_at',
    turns: 'turns',
    white_rating: 'white_rating',
    black_rating: 'black_rating',
    winner: 'winner',
    time_control: 'increment_code',
    opening_name: 'opening_name',
  };

  const dbField = fieldMapping[field] || 'created_at';
  return { [dbField]: desc ? -1 : 1 };
};

module.exports = buildSort;
