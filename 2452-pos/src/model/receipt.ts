import { assert } from '../assertions.ts';
import Cart from "./cart.ts";

/**
 * A receipt. Contains the {@link Cart} of {@link Product} and the total price.
 */
export default class Receipt {
    #cart: Cart;
    #total: number;

    /**
     * Constructs a receipt. Initializes the cart and total
     * 
     * @param cart the cart of the receipt
     */
    constructor(cart: Cart) {
        this.#cart = cart;
        this.#total = 0;

        if (this.#cart.products.length < 1) {
            throw new InvalidEmptyCartException();
        }

        // Calculates the total from the products in the cart
        for (const product of this.#cart.products) {
            this.#total += (product.price * product.quantity);
        }

        this.#checkReceipt();
    }

    /**
     * Invariant properties for a receipt
     */
    #checkReceipt(): void {
        assert(this.#cart.products.length > 0, "Cart must have at least one "
            + " product.");
        assert(this.#total >= 0, "Total must be at least zero.");
    }

    get cart(): Cart {
        return this.#cart;
    }

    get total(): number {
        return this.#total;
    }
}

export class InvalidEmptyCartException extends Error { }