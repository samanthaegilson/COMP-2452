import { expect, test } from 'vitest';
import Banana from "../src/model/banana.ts";

test('Can increase banana quantity', () => {
    let banana = new Banana();

    banana.increaseQuantity();

    expect(banana.quantity).equals(2);
});

test('Can decrease banana quantity', () => {
    let banana = new Banana();

    banana.increaseQuantity();
    banana.decreaseQuantity();

    expect(banana.quantity).equals(1);
});