import { assert } from '../assertions.ts';
import type Cart from './cart.ts';
import db from './connection.ts';
import type Product from './product.ts';

/**
 * An apple. A {@link Product} that can be added to the {@link Cart}.
 */
export default class Apple {
    readonly price: number = 1.5;
    #quantity: number;
    readonly volume: boolean = false;

    /**
     * Constructs an apple. Sets the initial quantity
     */
    constructor() {
        this.#quantity = 0;
        this.#checkApple();
    }

    /**
     * Invariant properties for an apple
     */
    #checkApple(): void {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
    }

    static async getAllApples(): Promise<Array<Apple>> {
        const allApples = new Array<Apple>();

        let results = await db().query<
            {
                quantity: number,
                cart: number
            }
        >("select quantity, cart from product where class = apple");

        for (let row of results.rows) {
            let apple = new Apple();
            // set quantity
            allApples.push(apple);
        }

        return allApples;
    }

    static async saveApple(apple: Apple, cart: Cart): Promise<Product> {
        await db().query<{ class: string }>("insert into product(class, price, quantity, volume, cart) values($1, $2, $3, $4, $5) on conflict do nothing returning class",
            [apple.constructor.name, apple.price, apple.quantity, apple.volume, cart.id])

        return apple;
    }

    get quantity(): number {
        return this.#quantity;
    }

    /**
     * Increments the quantity of the apple
     */
    increaseQuantity(amount: number): void {
        this.#checkApple();
        this.#quantity += amount;
        this.#checkApple();
    }

    /**
     * Decrements the quantity of the apple
     * 
     * @returns if there was an apple to remove or not
     */
    decreaseQuantity(amount: number): boolean {
        this.#checkApple();
        let decreased = false;
        // Only removes an apple if there is one available
        if (this.#quantity - amount > 0) {
            this.#quantity -= amount;
            decreased = true;
        }
        this.#checkApple();
        return decreased;
    }
}