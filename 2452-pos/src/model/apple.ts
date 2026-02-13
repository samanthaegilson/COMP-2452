import { assert } from '../assertions.ts';

export default class Apple {
    readonly #price: number = 1.5;
    #quantity: number;

    constructor(price: number) {
        this.#price = price;
        this.#quantity = 1;
        this.#checkApple;
    }

    #checkApple() {
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