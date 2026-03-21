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

    static async saveCart(cart: Cart): Promise<Cart> {
        if (!cart.id) {
            let results = await db().query<{ id: number }>("insert into cart(id) values(default) returning id")

            results.rows.forEach((row) => {
                cart.id = row['id']
                console.log(`cart got ID ${cart.id}`)
            })
        }

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

    static async getCartsForReceipt(receiptId: number): Promise<Array<Cart>> {
        let results = await db()
            .query<{ id: number }>("select id from cart where receipt = $1",
                [receiptId])

        let allCarts = new Array<Cart>();

        results.rows.forEach((row) => {
            let cart = new Cart();
            // GET PRODUCTS

            allCarts.push(cart);
        })
        return allCarts;
    }

    get products(): Array<Product> {
        return this.#products;
    }

    /**
     * Adds a product to the cart
     * 
     * @param product the product to add
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
                if (!this.#products[index].decreaseQuantity(amount)) {
                    // Removes product from the list if quantity is 0
                    this.#products.splice(index, 1);
                }
                removed = true;
            }
            index++;
        }

        this.#notifyAll();
        this.#checkCart();
        return removed;
    }

    /**
     * Empties the products list
     */
    emptyContents(): void {
        this.#checkCart();
        this.#products.length = 0;
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