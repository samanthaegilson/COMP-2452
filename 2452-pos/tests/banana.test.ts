import { expect, test } from 'vitest';
import Banana from "../src/model/banana.ts";

test('Can increase banana quantity', () => {
    let banana = new Banana("Cavendish");

    banana.increaseQuantity(1);

    expect(banana.quantity).equals(1);
});

test('Can decrease banana quantity', () => {
    let banana = new Banana("Cavendish");

    banana.increaseQuantity(2);
    banana.decreaseQuantity(1);

    expect(banana.quantity).equals(1);
});