import { assert } from '../assertions.ts';

export default class Apple {
    readonly price: number = 1.5;
    #quantity: number; // static??

    constructor() {
        this.#quantity = 1;
        this.#checkApple;
    }

    #checkApple() {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    get quantity(): number {
        return this.#quantity;
    }

    increaseQuantity(): void {
        this.#quantity++;
        this.#checkApple();
    }

    decreaseQuantity(): boolean {
        let decreased = false;
        if (this.#quantity > 1) {
            this.#quantity--;
            decreased = true;
        }
        this.#checkApple();
        return decreased;
    }
}