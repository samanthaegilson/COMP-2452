import { assert } from '../assertions.ts';
import Cart from './cart.ts';
import db from './connection.ts';

/**
 * Milk. A {@link Product} that can be added to the {@link Cart}.
 */
export default class Milk {
    id?: number;
    readonly price: number = 2.00;
    #quantity: number;
    readonly volume: boolean = true; // Measured in litres
    #type: string;

    /**
     * Constructs a milk. Sets the initial quantity
     */
    constructor(type: string) {
        this.#quantity = 0;
        this.#type = type;
        this.#checkMilk();
    }

    /**
     * Invariant properties for a milk
     */
    #checkMilk(): void {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
        assert(this.#type.length > 0, "Product type must have at least one character.");
    }

    /**
     * Loads the milks from the database in a specific cart
     * 
     * @param cart the cart of the milks
     * @returns the milks in the cart
     */
    static async getMilkForCart(cart: Cart): Promise<Array<Milk>> {
        const allMilks = new Array<Milk>();

        let results = await db().query<
            {
                id: number,
                type: string,
                quantity: number,
                cart: number
            }
        >("select id, type, quantity, cart from product where class = 'Milk' and cart = $1",
            [cart.id]);

        // Sets the properties of every milk
        for (let row of results.rows) {
            let milk = new Milk(row.type);
            milk.id = row.id;
            milk.increaseQuantity(row.quantity);
            allMilks.push(milk);
        }

        return allMilks;
    }

    /**
     * Saves the milk to the database
     * 
     * @param milk the milk to save
     * @param cart the cart holding the milk
     * @returns the milk
     */
    static async saveMilk(milk: Milk, cart: Cart): Promise<Milk> {
        if (!milk.id) {
            // Inserts the milk if not already in the database
            let results = await db().query<{ id: number }>
                ("insert into product(id, class, type, price, quantity, volume, cart) values(default, $1, $2, $3, $4, $5, $6) on conflict do nothing returning id",
                    [milk.constructor.name, milk.type, milk.price, milk.quantity, milk.volume, cart.id])

            results.rows.forEach((row) => {
                milk.id = row['id']
                console.log(`milk got ID ${milk.id}`)
            })
        } else {
            // Updates the quantity if the milk is already in the database
            await db().query<{ class: string }>("update product set quantity = ($1) where id = ($2)",
                [milk.quantity, milk.id])
        }

        return milk;
    }

    get quantity(): number {
        return this.#quantity;
    }

    get type(): string {
        return this.#type;
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
     * @returns if there was enough milks to remove or not
     */
    decreaseQuantity(amount: number): boolean {
        this.#checkMilk();
        let decreased = false;
        // Only removes milk if there is enough available
        if (this.#quantity - amount >= 0) {
            this.#quantity -= amount;
            decreased = true;
        }
        this.#checkMilk();
        return decreased;
    }
}