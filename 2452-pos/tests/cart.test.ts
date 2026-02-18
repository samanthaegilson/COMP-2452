import { expect, test } from 'vitest';
import Apple from "../src/model/apple.ts";
import Cart from "../src/model/cart.ts";

test('Can add product to cart', () => {
    let apple = new Apple();
    let cart = new Cart();

    cart.addProduct(apple);

    expect(cart.products).contains(apple);
});

test('Can remove product from cart', () => {
    let apple = new Apple();
    let cart = new Cart();

    cart.addProduct(apple);
    cart.removeProduct(apple);

    expect(cart.products).contains(!apple); // does this mean what i think it means?
});

test('Cart notifies listeners', () => {
    let apple = new Apple();
    let cart = new Cart();

    let notified = false;

    cart.registerListener({ notify: () => notified = true });

    cart.addProduct(apple);

    expect(notified).equals(true);
});