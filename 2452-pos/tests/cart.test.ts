import { expect, test } from 'vitest';
import Apple from "../src/model/apple.ts";
import Banana from "../src/model/banana.ts";
import Cart from "../src/model/cart.ts";
import Milk from '../src/model/milk.ts';

test('Can add product to cart', () => {
    let apple = new Apple("Gala");
    let cart = new Cart();

    cart.addProduct(apple, 1);

    expect(cart.products).contains(apple);
});

test('Can remove single product from cart', () => {
    let apple = new Apple("Gala");
    let cart = new Cart();

    cart.addProduct(apple, 1);
    cart.removeProduct(apple, 1);

    expect(cart.products).toHaveLength(0);
});

test('Can remove product with a higher quantity from cart', () => {
    let banana = new Banana("Cavendish");
    let cart = new Cart();

    cart.addProduct(banana, 1);
    cart.addProduct(banana, 1);
    cart.removeProduct(banana, 1);

    expect(cart.products).contains(banana);
});

test('Cart notifies listeners', () => {
    let apple = new Apple("Gala");
    let cart = new Cart();

    let notified = false;

    cart.registerListener({ notify: () => notified = true });

    cart.addProduct(apple, 1);

    expect(notified).equals(true);
});

test('Can save cart', () => {
    let cart = new Cart();
    let apple = new Apple("Gala");
    let banana = new Banana("Cavendish");
    let milk = new Milk("Almond");

    cart.addProduct(apple, 1);
    cart.addProduct(banana, 2);
    cart.addProduct(milk, 3);

    Cart.saveCart(cart);

    if (cart.id) {
        let promise = Cart.getCartById(cart.id);
        promise.then((retrieved) => {
            expect(retrieved).equals(cart);
        })
    }
});