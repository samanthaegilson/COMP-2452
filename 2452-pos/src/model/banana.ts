import { assert } from '../assertions.ts';

export default class Banana {
    #price: number;
    #quantity: number;

    constructor(price: number) {
        this.#price = price;
        this.#quantity = 1;
        this.#checkBanana;
    }

    #checkBanana() {
        assert(this.#price >= 0, "Price must be greater than zero.");
        assert(this.#quantity >= 0, "Quantity must be greater than zero.");
    }

    get price(): number {
        return this.#price;
    }

    get quantity(): number {
        return this.#quantity;
    }

    addProduct(): void {
        this.#quantity++;
        this.#checkBanana();
    }

    removeProduct(): boolean {
        let removed = false;
        if (this.#quantity - 1 >= 0) {
            this.#quantity--;
            removed = true;
        }
        this.#checkBanana();
        return removed;
    }
}