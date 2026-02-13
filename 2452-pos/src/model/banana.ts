import { assert } from '../assertions.ts';

export default class Banana {
    readonly #price: number = 0.4;
    #quantity: number;

    constructor(price: number) {
        this.#price = price;
        this.#quantity = 1;
        this.#checkBanana;
    }

    #checkBanana() {
        assert(this.#price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    get price(): number {
        return this.#price;
    }

    get quantity(): number {
        return this.#quantity;
    }
}