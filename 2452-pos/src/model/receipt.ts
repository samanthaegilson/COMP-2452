import { assert } from '../assertions.ts';
// import type Listener from "./listener.ts";
import Cart from "./cart.ts";

export default class Receipt {
    #cart: Cart;
    #total: number;

    constructor(cart: Cart) {
        this.#cart = cart;
        this.#total = 0;
        for (const product of this.#cart.products) {
            this.#total += product.price();
        }
    }

    #checkReceipt() {
        assert(this.#cart != null, "Cart must never be null.");
        assert(this.#total >= 0, "Total must be at least zero.");
    }
}