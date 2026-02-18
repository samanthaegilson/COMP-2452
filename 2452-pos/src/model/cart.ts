import { assert } from '../assertions.ts';
import Apple from './apple.ts';
import Banana from './banana.ts';
import type Listener from './listener.ts';
import type Product from './product.ts';

export default class Cart {
    #products: Array<Product>;
    #listeners: Array<Listener>;

    constructor() {
        this.#products = new Array<Product>();
        this.#listeners = new Array<Listener>();
        this.#checkCart();
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
        let found = false;
        let index = 0;

        while (!found && index < this.#products.length) {
            if (product.constructor === this.#products[index].constructor) {
                this.#products[index].increaseQuantity();
                found = true;
            }
            index++;
        }

        if (!found) {
            if (product instanceof Apple) {
                this.#products.push(new Apple());
            } else {
                this.#products.push(new Banana());
            }
        }

        this.#notifyAll();
    }

    removeProduct(product: Product): boolean {
        let removed = false;
        let found = false;
        let index = 0;

        while (!found && index < this.#products.length) {
            if (product.constructor === this.#products[index].constructor) {
                found = true;
                if (!this.#products[index].decreaseQuantity()) {
                    this.#products.splice(index, 1);
                }
                removed = true;
            }
            index++;
        }

        this.#notifyAll();
        return removed;
    }

    #notifyAll() {
        this.#listeners.forEach((l) => l.notify());
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener);
    }
}