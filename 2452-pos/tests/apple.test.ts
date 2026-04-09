import { expect, test } from 'vitest';
import Apple from "../src/model/apple.ts";

test('Can increase apple quantity', () => {
    let apple = new Apple("Gala");

    apple.increaseQuantity(1);

    expect(apple.quantity).equals(1);
});

test('Can decrease apple quantity', () => {
    let apple = new Apple("Gala");

    apple.increaseQuantity(2);
    apple.decreaseQuantity(1);

    expect(apple.quantity).equals(1);
});