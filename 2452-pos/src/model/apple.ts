import { assert } from '../assertions.ts';
// import db from './connection.ts';

/**
 * An apple. A {@link Product} that can be added to the {@link Cart}.
 */
export default class Apple {
    readonly price: number = 1.5;
    #quantity: number;

    /**
     * Constructs an apple. Sets the initial quantity
     */
    constructor() {
        this.#quantity = 1;
        this.#checkApple();
    }

    /**
     * Invariant properties for an apple
     */
    #checkApple(): void {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    // static async saveApple(apple: Apple): Promise<Apple> {
    //     let result = await db().exec("insert in");
    // }

    get quantity(): number {
        return this.#quantity;
    }

    /**
     * Increments the quantity of the apple
     */
    increaseQuantity(): void {
        this.#checkApple();
        this.#quantity++;
        this.#checkApple();
    }

    /**
     * Decrements the quantity of the apple
     * 
     * @returns if there was an apple to remove or not
     */
    decreaseQuantity(): boolean {
        this.#checkApple();
        let decreased = false;
        // Only removes an apple if there is one available
        if (this.#quantity > 1) {
            this.#quantity--;
            decreased = true;
        }
        this.#checkApple();
        return decreased;
    }
}