import { assert } from '../assertions.ts';
import Cart from './cart.ts';
import db from './connection.ts';

/**
 * A banana. A {@link Product} that can be added to the {@link Cart}.
 */
export default class Banana {
    readonly price: number = 0.4;
    #quantity: number;
    readonly volume: boolean = false;

    /**
     * Constructs an apple. Sets the initial quantity
     */
    constructor() {
        this.#quantity = 0;
        this.#checkBanana();
    }

    /**
     * Invariant properties for a banana
     */
    #checkBanana(): void {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    static async saveBanana(banana: Banana, cart: Cart): Promise<Banana> {
        await db().query<{ class: string }>("insert into product(class, price, quantity, volume, cart) values($1, $2, $3, $4, $5) on conflict do nothing returning class",
            [banana.constructor.name, banana.price, banana.quantity, banana.volume, cart.id])

        return banana;
    }

    get quantity(): number {
        return this.#quantity;
    }

    /**
     * Increments the quantity of the banana
     */
    increaseQuantity(amount: number): void {
        this.#checkBanana();
        this.#quantity += amount;
        this.#checkBanana();
    }

    /**
     * Decrements the quantity of the banana
     * 
     * @returns if there was a banana to remove or not
     */
    decreaseQuantity(amount: number): boolean {
        this.#checkBanana();
        let decreased = false;
        // Only removes a banana if there is one available
        if (this.#quantity - amount > 0) {
            this.#quantity -= amount;
            decreased = true;
        }
        this.#checkBanana();
        return decreased;
    }
}