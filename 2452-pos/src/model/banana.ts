import { assert } from '../assertions.ts';

export default class Banana {
    readonly price: number = 0.4;
    #quantity: number;

    constructor() {
        this.#quantity = 1;
        this.#checkBanana;
    }

    #checkBanana() {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    get quantity(): number {
        return this.#quantity;
    }

    increaseQuantity(): void {
        this.#quantity++;
        this.#checkBanana();
    }

    decreaseQuantity(): boolean {
        let decreased = false;
        if (this.#quantity > 1) {
            this.#quantity--;
            decreased = true;
        }
        this.#checkBanana();
        return decreased;
    }
}