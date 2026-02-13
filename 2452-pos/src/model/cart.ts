import { assert } from '../assertions.ts';
import Apple from './apple.ts';
import type Listener from './listener.ts';
import type Product from './product.ts';

export default class Cart {
    #products: Product[];
    #listeners: Array<Listener>;

    constructor() {
        this.#products = new Array<Product>();
        this.#listeners = new Array<Listener>();
    }

    #checkCart(): void {
        // do I need this?
        // if so i need to add the loop for every product in products
        assert(this.#products != null, "Products should never be null.");
    }

    get products() {
        return this.#products;
    }

    addProduct(product: Product): void {
        // should get the one from the array??

        if (product instanceof Apple) {
            // increment apple quantity
        } else {
            // increment banana quantity
        }
    }

    removeProduct(product: Product): void {
        if (product instanceof Apple) {
            // decrement apple quantity
        } else {
            // decrement banana quantity
        }
    }

    #notifyAll() {
        this.#listeners
            .forEach((l) => l.notify());
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }
}