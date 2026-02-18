import { assert } from '../assertions.ts';
import Cart from "./cart.ts";

export default class Receipt {
    #cart: Cart;
    #total: number;

    constructor(cart: Cart) {
        this.#cart = cart;
        this.#total = 0;
        for (const product of this.#cart.products) {
            this.#total += (product.price * product.quantity);
        }
        this.#checkReceipt();
    }

    #checkReceipt() {
        assert(this.#cart != null, "Cart must never be null.");
        assert(this.#total >= 0, "Total must be at least zero.");
    }

    get cart() {
        return this.#cart;
    }

    get total() {
        return this.#total;
    }
}