import type CartController from "../controller/cart-controller.ts";
import Banana from "../model/banana.ts";

/**
 * A view for a {@link Banana}.
 */
export default class BananaView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    /**
     * Constructs a BananaView. Displays the window
     * 
     * @param controller the controller of the view
     */
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

    /**
     * Adds a banana to the cart
     */
    #addBanana() {
        this.#controller.addBanana();
        document.body.removeChild(this.#dialog);
    }

    /**
     * Removes a banana from the cart
     */
    #removeBanana() {
        let removed = this.#controller.removeProduct(new Banana());
        if (removed) {
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if the banana quantity was 0
            this.#dialog.querySelector("#error")!
                .textContent = "Cannot remove a product with a quantity of 0.";
        }
    }

    /**
     * Removes the view
     */
    #cancel() {
        this.#controller.hideProductViews();
        document.body.removeChild(this.#dialog);
    }
}