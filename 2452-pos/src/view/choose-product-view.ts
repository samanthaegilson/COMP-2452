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
            <button id="banana">Banana</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#apple")!
            .addEventListener("click", () => this.#controller.showAppleView());

        this.#dialog.querySelector("#banana")!
            .addEventListener("click", () => this.#controller.showBananaView());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #cancel() {
        this.#controller.removeViews();
        document.body.removeChild(this.#dialog);
    }
}