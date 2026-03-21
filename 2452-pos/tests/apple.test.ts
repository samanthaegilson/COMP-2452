import { expect, test } from 'vitest';
import Apple from "../src/model/apple.ts";

test('Can increase apple quantity', () => {
    let apple = new Apple();

    apple.increaseQuantity(1);

    expect(apple.quantity).equals(2);
});

test('Can decrease apple quantity', () => {
    let apple = new Apple();

    apple.increaseQuantity(1);
    apple.decreaseQuantity(1);

    expect(apple.quantity).equals(1);
});