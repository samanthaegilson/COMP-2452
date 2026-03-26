import { assert } from '../assertions.ts';
import Cart from './cart.ts';
import db from './connection.ts';
import type Product from './product.ts';

/**
 * A banana. A {@link Product} that can be added to the {@link Cart}.
 */
export default class Banana {
    id?: number;
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

    /**
     * Loads the bananas from the database in a specific cart
     * 
     * @param cart the cart of the bananas
     * @returns the bananas in the cart
     */
    static async getBananaForCart(cart: Cart): Promise<Array<Banana>> {
        const allBananas = new Array<Banana>();

        let results = await db().query<
            {
                id: number,
                quantity: number,
                cart: number
            }
        >("select id, quantity, cart from product where class = 'Banana' and cart = $1",
            [cart.id]);

        // Sets the properties of every banana
        for (let row of results.rows) {
            let banana = new Banana();
            banana.id = row.id;
            banana.increaseQuantity(row.quantity);
            allBananas.push(banana);
        }

        return allBananas;
    }

    /**
     * Saves the banana to the database
     * 
     * @param banana the banana to save
     * @param cart the cart holding the banana
     * @returns the banana
     */
    static async saveBanana(banana: Banana, cart: Cart): Promise<Banana> {
        if (!banana.id) {
            // Inserts the banana if not already in the database
            let results = await db().query<{ id: number }>
                ("insert into product(id, class, price, quantity, volume, cart) values(default, $1, $2, $3, $4, $5) on conflict do nothing returning id",
                    [banana.constructor.name, banana.price, banana.quantity, banana.volume, cart.id])

            results.rows.forEach((row) => {
                banana.id = row['id']
                console.log(`banana got ID ${banana.id}`)
            })
        } else {
            // Updates the quantity if the banana is already in the database
            await db().query<{ class: string }>("update product set quantity = ($1) where id = ($2)",
                [banana.quantity, banana.id])
        }

        return banana;
    }

    get quantity(): number {
        return this.#quantity;
    }

    /**
     * Increases the quantity of the banana
     * 
     * @param amount the amount to increase by
     */
    increaseQuantity(amount: number): void {
        this.#checkBanana();
        this.#quantity += amount;
        this.#checkBanana();
    }

    /**
     * Decreases the quantity of the banana
     * 
     * @param amount the amount to decrease by
     * @returns if there was enough bananas to remove or not
     */
    decreaseQuantity(amount: number): boolean {
        this.#checkBanana();
        let decreased = false;
        // Only removes a banana if there is one available
        if (this.#quantity - amount >= 0) {
            this.#quantity -= amount;
            decreased = true;
        }
        this.#checkBanana();
        return decreased;
    }
}