import type CartController from "../controller/cart-controller.ts";
import Banana from "../model/banana.ts";

export default class BananaView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "banana-info";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="bananaView">Banana</label>
            <button id="addBanana">Add Banana</button>
            <button id="removeBanana">Remove Banana</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#addBanana")!
            .addEventListener("click", () => this.#addBanana());

        this.#dialog.querySelector("#removeBanana")!
            .addEventListener("click", () => this.#removeBanana());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #addBanana() {
        this.#controller.addProduct(new Banana());
        document.body.removeChild(this.#dialog);
    }

    #removeBanana() {
        this.#controller.removeProduct(new Banana());
        // should return a boolean and output error message if false
        document.body.removeChild(this.#dialog);
    }

    #cancel() {
        this.#controller.hideProductViews();
        document.body.removeChild(this.#dialog);
    }
}