import { assert } from '../assertions.ts';
import Apple from './apple.ts';
import Banana from './banana.ts';
import db from './connection.ts';
import type Listener from './listener.ts';
import Milk from './milk.ts';
import type Product from './product.ts';

/**
 * A cart. Can hold {@link Product}s.
 */
export default class Cart {
    id?: number;
    #products: Array<Product>;
    #listeners: Array<Listener>;

    /**
     * Constructs a cart. Initializes the list of products
     */
    constructor() {
        this.#products = new Array<Product>();
        this.#listeners = new Array<Listener>();
        this.#checkCart();
    }

    /**
     * Invariant properties for a cart
     */
    #checkCart(): void {
        assert(this.#products != null, "Products should never be null.");

        for (const product of this.#products) {
            assert(product != null, "Products in products should not be null.")
        }
    }

    /**
     * Loads a cart with a specific id from the database
     * 
     * @param cartId the cart id of the cart to find
     * @returns the cart with the id
     */
    static async getCartById(cartId: number): Promise<Cart> {
        let cart = new Cart();
        cart.id = cartId;

        // Loads each product
        let apples = await Apple.getAppleForCart(cart);
        let bananas = await Banana.getBananaForCart(cart);
        let milks = await Milk.getMilkForCart(cart);

        for (let apple of apples) {
            cart.products.push(apple);
        }

        for (let banana of bananas) {
            cart.products.push(banana);
        }

        for (let milk of milks) {
            cart.products.push(milk);
        }

        return cart;
    }

    /**
     * Saves a cart to the database
     * 
     * @param cart the cart to save
     * @returns the cart
     */
    static async saveCart(cart: Cart): Promise<Cart> {
        if (!cart.id) {
            // Only saves the cart if it is not already in the database 
            let results = await db().query<{ id: number }>
                ("insert into cart(id) values(default) returning id")

            results.rows.forEach((row) => {
                cart.id = row['id']
                console.log(`cart got ID ${cart.id}`)
            })
        }

        // Saves all the products of the cart
        cart.products.forEach((product) => {
            if (product instanceof Apple) {
                Apple.saveApple(product, cart);
            } else if (product instanceof Banana) {
                Banana.saveBanana(product, cart);
            } else if (product instanceof Milk) {
                Milk.saveMilk(product, cart);
            }
        })

        return cart;
    }

    /**
     * Deletes a product from the database
     * 
     * @param product the product to delete 
     * @returns the product
     */
    static async deleteProduct(product: Product): Promise<Product> {
        // Deletes a product from the database
        await db().query<{ id: number }>("delete from product where id = $1",
            [product.id])

        return product;
    }

    get products(): Array<Product> {
        return this.#products;
    }

    /**
     * Adds a product to the cart
     * 
     * @param product the product to add
     * @param amount the amount of the product to add
     */
    addProduct(product: Product, amount: number): void {
        this.#checkCart();
        let found = false;
        let index = 0;

        // Checks if the product is in the cart already
        while (!found && index < this.#products.length) {
            if (product.constructor === this.#products[index].constructor) {
                // If the product is in the cart, increases the quantity
                this.#products[index].increaseQuantity(amount);
                found = true;
            }
            index++;
        }

        // If not in the cart, adds a new instance of the product to the cart
        if (!found) {
            product.increaseQuantity(amount);
            this.#products.push(product);
        }

        this.#notifyAll();
        this.#checkCart();
    }

    /**
     * Removes a product from the cart
     * 
     * @param product the product to remove
     * @param amount the amount of the product to remove
     * @returns if the product was removed or not
     */
    removeProduct(product: Product, amount: number): boolean {
        this.#checkCart();
        let removed = false;
        let found = false;
        let index = 0;

        // Checks if the product is in the cart
        while (!found && index < this.#products.length) {
            if (product.constructor === this.#products[index].constructor) {
                found = true;
                // Decreases the quantity of the product
                if (this.#products[index].decreaseQuantity(amount)) {
                    removed = true;
                }

                // Removes product from the list if quantity is 0
                if (this.#products[index].quantity == 0) {
                    Cart.deleteProduct(this.#products[index]);
                    this.#products.splice(index, 1);
                }
            }
            index++;
        }

        this.#notifyAll();
        this.#checkCart();
        return removed;
    }

    autoShop(amount: number): void {
        this.#checkCart();

        // 1. generate random number between 0 and 1
        // 2. iterate over row (outgoing edges) & keep a sum of the numbers
        // 3. check if the sum is bigger than or equal to the random number, 
        // that's the transition

        // subtract price of product from total, if the total is below 0 stop, 
        // if not, add that product to the cart

        this.#notifyAll();
        this.#checkCart();
    }

    /**
     * Notifies listeners of changes
     */
    #notifyAll(): void {
        this.#checkCart();
        this.#listeners.forEach((l) => l.notify());
        this.#checkCart();
    }

    /**
     * Adds a listener
     * 
     * @param listener the listener to add
     */
    registerListener(listener: Listener) {
        this.#checkCart();
        this.#listeners.push(listener);
        this.#checkCart();
    }
}