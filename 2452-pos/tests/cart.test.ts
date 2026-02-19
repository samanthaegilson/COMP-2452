import { expect, test } from 'vitest';
import Apple from "../src/model/apple.ts";
import Banana from "../src/model/banana.ts";
import Cart from "../src/model/cart.ts";

test('Can add product to cart', () => {
    let apple = new Apple();
    let cart = new Cart();

    cart.addProduct(apple);

    expect(cart.products).contains(apple);
});

test('Can remove single product from cart', () => {
    let apple = new Apple();
    let cart = new Cart();

    cart.addProduct(apple);
    cart.removeProduct(apple);

    expect(cart.products).toHaveLength(0);
});

test('Can remove product with a higher quantity from cart', () => {
    let banana = new Banana();
    let cart = new Cart();

    cart.addProduct(banana);
    cart.addProduct(banana);
    cart.removeProduct(banana);

    expect(cart.products).contains(banana);
});

test('Can empty contents of cart', () => {
    let apple = new Apple();
    let cart = new Cart();

    cart.addProduct(apple);
    cart.emptyContents();

    expect(cart.products).toHaveLength(0);
});

test('Cart notifies listeners', () => {
    let apple = new Apple();
    let cart = new Cart();

    let notified = false;

    cart.registerListener({ notify: () => notified = true });

    cart.addProduct(apple);

    expect(notified).equals(true);
});