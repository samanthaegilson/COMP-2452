import { assert } from '../assertions.ts';
import type Cart from './cart.ts';
import db from './connection.ts';
import type Product from './product.ts';

/**
 * An apple. A {@link Product} that can be added to the {@link Cart}.
 */
export default class Apple {
    id?: number;
    readonly price: number = 1.5;
    #quantity: number;
    readonly volume: boolean = false;
    #type: string;

    /**
     * Constructs an apple. Sets the initial quantity
     */
    constructor(type: string) {
        this.#quantity = 0;
        this.#type = type;
        this.#checkApple();
    }

    /**
     * Invariant properties for an apple
     */
    #checkApple(): void {
        assert(this.price >= 0, "Price must be at least zero.");
        assert(this.#quantity >= 0, "Quantity must be at least zero.");
        assert(this.#type.length > 0, "Product type must have at least one character.");
    }

    /**
     * Loads the apples from the database in a specific cart
     * 
     * @param cart the cart of the apples
     * @returns the apples in the cart
     */
    static async getAppleForCart(cart: Cart): Promise<Array<Apple>> {
        const allApples = new Array<Apple>();

        let results = await db().query<
            {
                id: number,
                type: string,
                quantity: number,
                cart: number
            }
        >("select id, type, quantity, cart from product where class = 'Apple' and cart = $1",
            [cart.id]);

        // Sets the properties of every apple
        for (let row of results.rows) {
            console.log("type: " + row.type);
            let apple = new Apple(row.type);
            apple.id = row.id;
            apple.increaseQuantity(row.quantity);
            allApples.push(apple);
        }

        return allApples;
    }

    /**
     * Saves the apple to the database
     * 
     * @param apple the apple to save
     * @param cart the cart holding the apple
     * @returns the apple
     */
    static async saveApple(apple: Apple, cart: Cart): Promise<Apple> {
        if (!apple.id) {
            // Inserts the apple if not already in the database
            let results = await db().query<{ id: number }>
                ("insert into product(id, class, type, price, quantity, volume, cart) values(default, $1, $2, $3, $4, $5, $6) on conflict do nothing returning id",
                    [apple.constructor.name, apple.type, apple.price, apple.quantity, apple.volume, cart.id])

            results.rows.forEach((row) => {
                apple.id = row['id']
                console.log(`apple got ID ${apple.id}`)
            })
        } else {
            // Updates the quantity if the apple is already in the database
            await db().query<{ class: string }>("update product set quantity = ($1) where id = ($2)",
                [apple.quantity, apple.id])
        }

        return apple;
    }

    get quantity(): number {
        return this.#quantity;
    }

    get type(): string {
        return this.#type;
    }

    /**
     * Increases the quantity of the apple
     * 
     * @param amount the amount to increase by
     */
    increaseQuantity(amount: number): void {
        this.#checkApple();
        this.#quantity += amount;
        this.#checkApple();
    }

    /**
     * Decreases the quantity of the apple
     * 
     * @param amount the amount to decrease by
     * @returns if there was enough apples to remove or not
     */
    decreaseQuantity(amount: number): boolean {
        this.#checkApple();
        let decreased = false;
        // Only removes the apples if there is enough available
        if (this.#quantity - amount >= 0) {
            this.#quantity -= amount;
            decreased = true;
        }
        this.#checkApple();
        return decreased;
    }
}