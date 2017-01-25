'use strict';

module.exports = {
  threeForTwo(quantity, price, total) {
    const offerAmount = 3;
    if (quantity < offerAmount) {return total;}

    const timesToApplyOffer = Math.floor(quantity / offerAmount);
    return total - (price * timesToApplyOffer);
  },
};
