// Pagination functionality
module.exports.pagination = async (collection, p, l) => {
  let page = 1;
  limit = 12;
  if (p) page = parseInt(p);
  if (l) limit = parseInt(l);
  const skip = (page - 1) * limit;
  return await collection.skip(skip).limit(limit);
};

// Get amount of products
module.exports.getProductNum = async (collection, user, l) => {
  let productsAmount = (await collection.countDocuments({})) - (await collection.countDocuments({ hidden: true }));
  if (user && user.role === "admin") {
    productsAmount = await collection.countDocuments({});
  }
  if (!productsAmount) productsAmount = 0;
  let limit = 12;
  if (l) limit = parseInt(l);
  return await Math.ceil(productsAmount / limit);
};
