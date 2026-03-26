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
            <label for="amount">Amount</label>
            <input type="number" id="amount"/>
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
        let amount = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        // Checks the number is a valid integer
        if (Number.isInteger(amount) && amount > 0) {
            this.#controller.addBanana(amount);
            document.body.removeChild(this.#dialog);
        } else {
            this.#dialog.querySelector("#error")!
                .textContent = "Amount to add must be a positive whole number, e.g. 2.";
        }
    }

    /**
     * Removes a banana from the cart
     */
    #removeBanana() {
        let amount = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        // Checks the number is a valid integer
        if (Number.isInteger(amount) && amount > 0) {
            let removed = this.#controller.removeBanana(amount);
            if (removed) {
                document.body.removeChild(this.#dialog);
            } else {
                // Displays an error if the banana quantity was 0
                this.#dialog.querySelector("#error")!
                    .textContent = "Cannot remove a product with a quantity of 0.";
            }
        } else {
            this.#dialog.querySelector("#error")!
                .textContent = "Amount to remove must be a positive whole number, e.g. 2.";
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