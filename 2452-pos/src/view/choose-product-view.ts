import type CartController from "../controller/cart-controller";

export default class ChooseProductView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "choose-product-dialog";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="productOptions">Product Options</label>
            <button id="apple">Apple</button>
            <button id="banana">Banana</button>`

        this.#dialog.querySelector("#apple")!
            .addEventListener("click", () => this.#controller.showReceiptView())
    }
}