const rewire = require('rewire');
const expect = require('chai').expect;
const basket = rewire('../lib/basket');
const {
  add,
  empty,
  getTotal,
} = basket;

describe('Basket module: ', () => {
  let basketMap;

  beforeEach(() => {
    basketMap = basket.__get__('basket');
  });

  afterEach(() => {
    basketMap.clear();
  });

  describe('when adding items to the basket', () => {

    it('should handle invalid inputs and ignore them', () => {
      expect(add()).to.be.false;
      expect(add([])).to.be.false;
      expect(basketMap.size).to.equal(0);
    });

    it('should store how many of each item was added', () => {
      const items = ['Apple', 'Apple', 'Apple', 'Orange'];

      expect(add(items)).to.be.true;
      expect(basketMap).to.eql(
        new Map([
          ['apple', 3],
          ['orange', 1],
        ])
      );
    });

    it('should allow a single product as a string', () => {
      expect(add('Apple')).to.be.true;
      expect(basketMap).to.eql(
        new Map([
          ['apple', 1],
        ])
      );
    });

  });

  describe('when emptying the basket', () => {

    it('should remove all items', () => {
      add('Apple');
      empty();

      expect(basketMap).to.eql(new Map());
    });

  });


  describe('when getting the total items in the basket', () => {

    it('should return all the items in the correct format', () => {
      add([
        'Papaya',
        'Papaya',
        'Papaya',
        'Garlic',
        'Garlic',
        'Apple',
        'Orange',
        'Orange',
      ]);
      const expected = {
        items: [
          {name: 'Papaya', quantity: 3, price: '£1.00', discount: '£0.50'},
          {name: 'Garlic', quantity: 2, price: '£0.30'},
          {name: 'Apple', quantity: 1, price: '£0.25'},
          {name: 'Orange', quantity: 2, price: '£0.60'},
        ],
        totalPrice: '£2.15',
        totalItems: 8,
      };
      const result = getTotal();
      expect(result).to.eql(JSON.stringify(expected));
    });

    it('should handle an empty basket', () => {
      expect(getTotal()).to.equal('{"items":[],"totalPrice":"£0.00","totalItems":0}');
    });

    it('should ignore products that do not exist', () => {
      add(['Apple', 'Pear', 'Plum', 'Apple']);
      expect(
        getTotal()
      ).to.equal('{"items":[{"name":"Apple","quantity":2,"price":"£0.50"}],"totalPrice":"£0.50","totalItems":2}');
    });

    it('should ignore offers that do not exist', () => {
      const products = {
        'apple': {price: 25, offer: 'fakeOffer'},
      };
      const revert = basket.__set__('products', products);

      add([
        'Apple',
        'Apple',
      ]);
      expect(
        getTotal()
      ).to.equal('{"items":[{"name":"Apple","quantity":2,"price":"£0.50"}],"totalPrice":"£0.50","totalItems":2}');

      revert();
    });

  });

});
