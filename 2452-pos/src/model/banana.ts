import { assert } from '../assertions.ts';

/**
 * A banana. A {@link Product} that can be added to the {@link Cart}.
 */
export default class Banana {
    readonly price: number = 0.4;
    #quantity: number;

    /**
     * Constructs an apple. Sets the initial quantity
     */
    constructor() {
        this.#quantity = 1;
        this.#checkBanana;
    }

    /**
     * Invariant properties for a banana
     */
    #checkBanana(): void {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    get quantity(): number {
        return this.#quantity;
    }

    /**
     * Increments the quantity of the banana
     */
    increaseQuantity(): void {
        this.#quantity++;
        this.#checkBanana();
    }

    /**
     * Decrements the quantity of the banana
     * 
     * @returns if there was a banana to remove or not
     */
    decreaseQuantity(): boolean {
        let decreased = false;
        // Only removes a banana if there is one available
        if (this.#quantity > 1) {
            this.#quantity--;
            decreased = true;
        }
        this.#checkBanana();
        return decreased;
    }
}