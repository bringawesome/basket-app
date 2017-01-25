# Basket app (test)

## Assumptions

* Items are presented sequentially in an array or as a string
* One offer per item (this could be extended to support an array of offers)
* Products and offers are known in advance (these could be stored elsewhere)

## Installation

1. Clone the repo
1. `yarn` or `npm install`
1. `yarn test` or `npm test`

> Requires node 6.0.0+ for ES6 compatibility

## Usage

### `add`

Accepts string or array of strings and returns true if successful

```js
basket.add(['Apple', 'Orange']);
basket.add('Apple');
```

### `empty`

Removes all items from the basket

```js
basket.empty();
```

### `getTotal`

Returns the contents of the basket in JSON which is suitable for rendering by a
view layer like React

```js
basket.getTotal();
```

```json
{
  "items": [
    {
      "name": "Papaya",
      "quantity": 3,
      "price": "£1.00",
      "discount": "£0.50"
    },
    {
      "name": "Garlic",
      "quantity": 2,
      "price": "£0.30"
    },
    {
      "name": "Apple",
      "quantity": 1,
      "price": "£0.25"
    },
    {
      "name": "Orange",
      "quantity": 2,
      "price": "£0.60"
    }
  ],
  "totalPrice": "£2.15",
  "totalItems": 8
}
```

## Adding offers

Offers are just functions that receive the `quantity`, `price`, and `total`. The
value returned is used as the discounted price.

Add new offers to `offers.js`:

```js
module.exports = {
  someNewOffer(quantity, price, total) {
    // return a value
  },
};
```

The function name is used by the product in `products.js`

```js
{
  'pears': {price: 25, offer: 'someNewOffer'},
}
```

Offers can be added to every product

## TODO

Adding `remove`
