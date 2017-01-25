const expect = require('chai').expect;
const offers = require('../lib/offers');
const {
  threeForTwo,
} = offers;

describe('Offers module: ', () => {

  describe('threeForTwo', () => {

    it('should return the price for items that are valid', () => {
      expect(threeForTwo(5, 15, 75)).to.equal(60);
      expect(threeForTwo(10, 30, 300)).to.equal(210);
      expect(threeForTwo(7, 25, 175)).to.equal(125);
    });

    it('should just return the total if the items are less than three', () => {
      expect(threeForTwo(2, 30, 60)).to.equal(60);
    });

  });

});
