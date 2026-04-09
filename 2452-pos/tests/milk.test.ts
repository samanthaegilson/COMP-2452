import { expect, test } from 'vitest';
import Milk from '../src/model/milk.ts';

test('Can increase milk quantity', () => {
    let milk = new Milk("Almond");

    milk.increaseQuantity(1);

    expect(milk.quantity).equals(1);
});

test('Can decrease milk quantity', () => {
    let milk = new Milk("Almond");

    milk.increaseQuantity(2);
    milk.decreaseQuantity(1);

    expect(milk.quantity).equals(1);
});