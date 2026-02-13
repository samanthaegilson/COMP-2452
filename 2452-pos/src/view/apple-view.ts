import type CartController from "../controller/cart-controller.ts";

export default class AppleView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "apple-info";
    }
}