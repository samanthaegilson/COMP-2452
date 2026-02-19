import type CartController from "../controller/cart-controller.ts";
import Apple from "../model/apple.ts";

/**
 * A view for an {@link Apple}.
 */
export default class AppleView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    /**
     * Constructs an AppleView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "apple-info";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="appleView">Apple</label>
            <button id="addApple">Add Apple</button>
            <button id="removeApple">Remove Apple</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#addApple")!
            .addEventListener("click", () => this.#addApple());

        this.#dialog.querySelector("#removeApple")!
            .addEventListener("click", () => this.#removeApple());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Adds an apple to the cart
     */
    #addApple() {
        this.#controller.addProduct(new Apple());
        document.body.removeChild(this.#dialog);
    }

    /**
     * Removes an apple from the cart
     */
    #removeApple() {
        let removed = this.#controller.removeProduct(new Apple());
        if (removed) {
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if the apple quantity was 0
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