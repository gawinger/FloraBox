module.exports.createCreator = (src) => {
  const creatorData = [];
  // into creator data push object with category name and options
  for (let i = 1; i <= src.creatorAmount; i++) {
    const keys = Object.keys(src);
    const optionAmount = keys.filter((key) => key.includes(`creator${i}Option`)).length / 2;
    const optionData = {};
    // add category name to optionData object
    optionData.categoryName = src[`creatorCategory${i}`];
    // iterate throught all options and add them to optionData object
    for (let j = 1; j <= optionAmount; j++) {
      // if priceChange value is not provided set it to 0
      if (src[`creator${i}Option${j}Change`] === "") {
        src[`creator${i}Option${j}Change`] = 0;
      }
      optionData["option" + j] = {
        optionName: src[`creator${i}Option${j}`],
        priceChange: src[`creator${i}Option${j}Change`],
      };
    }
    // push option data into creator data
    creatorData.push(optionData);
  }
  return creatorData;
};
