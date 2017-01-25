'use strict';

const reduce = require('lodash/fp/reduce');
const map = require('lodash/fp/map');
const isFunction = require('lodash/fp/isFunction');
const flow = require('lodash/fp/flow');
const isEmpty = require('lodash/fp/isEmpty');
const castArray = require('lodash/fp/castArray');
const capitalize = require('lodash/fp/capitalize');
const currencyFormatter = require('currency-formatter');

let products = require('./products');
let offers = require('./offers');

function formatPrice(price) {
  return currencyFormatter.format((price / 100).toFixed(2), {code: 'GBP'});
}

const formatItems = map(({name, quantity, price, discount}) => {
  const item = {
    name,
    quantity,
    price: formatPrice(price),
  };
  if (discount) {
    item.discount = formatPrice(discount);
  }
  return item;
});

const calculateTotalItems = reduce((total, {quantity}) => {
  total += quantity;
  return total;
});

function formatReceipt(receipt) {
  receipt.items = formatItems(receipt.items);
  receipt.totalPrice = formatPrice(receipt.totalPrice);
  receipt.totalItems = calculateTotalItems(receipt.totalItems, receipt.items);
  return receipt;
}

function buildReceipt(basketItems) {
  const result = {
    items: [],
    totalPrice: 0,
    totalItems: 0,
  };

  for (let [item, quantity] of basketItems) {
    const product = products[item];
    if (!product) {break;}

    const {price, offer} = product;
    const totalPriceOfItems = price * quantity;

    const receiptItem = {
      name: capitalize(item),
      quantity,
    };

    if (offer && isFunction(offers[offer])) {
      const discountedPrice = offers[offer](quantity, price, totalPriceOfItems);
      receiptItem.price = discountedPrice;
      receiptItem.discount = totalPriceOfItems - discountedPrice;
    } else {
      receiptItem.price = totalPriceOfItems;
    }

    result.items.push(receiptItem);
    result.totalPrice += receiptItem.price;
  }

  return result;
}

const basket = new Map();

const addItemsToBasket = reduce((map, item) => {
  const key = item.toLowerCase();
  if (map.has(key)) {
    map.set(key, map.get(key) + 1);
  } else {
    map.set(key, 1);
  }
  return map;
});

function add(items) {
  if (isEmpty(items)) {return false;}
  addItemsToBasket(basket, castArray(items));
  return true;
}

function getTotal() {
  return flow(
    buildReceipt,
    formatReceipt,
    JSON.stringify
  )(basket);
}

function empty() {
  basket.clear();
}

module.exports = {
  add,
  empty,
  getTotal,
};
