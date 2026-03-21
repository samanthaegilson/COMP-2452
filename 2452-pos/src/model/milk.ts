import { assert } from '../assertions.ts';
import Cart from './cart.ts';
import db from './connection.ts';

export default class Milk {
    readonly price: number = 2.00;
    #quantity: number;
    readonly volume: boolean = true; // Measured in litres

    constructor() {
        this.#quantity = 0;
        this.#checkMilk();
    }

    /**
     * Invariant properties for an apple
     */
    #checkMilk(): void {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    static async saveMilk(milk: Milk, cart: Cart): Promise<Milk> {
        await db().query<{ class: string }>("insert into product(class, price, quantity, volume, cart) values($1, $2, $3, $4, $5) on conflict do nothing returning class",
            [milk.constructor.name, milk.price, milk.quantity, milk.volume, cart.id])

        return milk;
    }

    get quantity(): number {
        return this.#quantity;
    }

    /**
     * Increases the quantity of the milk
     * 
     * @param amount the amount to increase by
     */
    increaseQuantity(amount: number): void {
        this.#checkMilk();
        this.#quantity += amount;
        this.#checkMilk();
    }

    /**
     * Decreases the quantity of the milk
     * 
     * @param amount the amount to decrease by
     * @returns if there was an milk to remove or not
     */
    decreaseQuantity(amount: number): boolean {
        this.#checkMilk();
        let decreased = false;
        // Only removes milk if there is enough available
        if (this.#quantity - amount > 0) {
            this.#quantity -= amount;
            decreased = true;
        }
        this.#checkMilk();
        return decreased;
    }
}