import type CartController from "../controller/cart-controller.ts";

export default class BananaView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "banana-info";
    }
}