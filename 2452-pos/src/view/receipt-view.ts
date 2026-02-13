import type CartController from "../controller/cart-controller.ts";

export default class ReceiptView {
    #controller: CartController;

    constructor(controller: CartController) {
        this.#controller = controller;
    }
}