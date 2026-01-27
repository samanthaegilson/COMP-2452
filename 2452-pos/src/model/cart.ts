import { assert } from '../assertions.ts';
import type Product from './product.ts';

export default class Cart {
    #products: Product[];

    constructor() {
        this.#products = [];
    }

    #checkCart(): void {
        // do I need this?
        // if so i need to add the loop for every product in products
        assert(this.#products != null, "Products should never be null.");
    }

    addProduct(product: Product): void {
        // how to find the correct product?
    }
}