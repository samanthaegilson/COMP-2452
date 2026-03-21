import type CartController from "../controller/cart-controller";

/**
 * A view to choose a {@link Product} to add to the {@link Cart}.
 */
export default class ChooseProductView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    /**
     * Constructs a ChooseProductView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "choose-product-dialog";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="productOptions">Product Options</label>
            <button id="apple">Apple</button>
            <button id="banana">Banana</button>
            <button id="milk">Milk</button>
            <button id="cancel">Cancel</button>`

        // Open the view of an apple
        this.#dialog.querySelector("#apple")!
            .addEventListener("click", () => this.#controller.showAppleView());

        // Open the view of a banana
        this.#dialog.querySelector("#banana")!
            .addEventListener("click", () => this.#controller.showBananaView());

        // Open the view of milk
        this.#dialog.querySelector("#milk")!
            .addEventListener("click", () => this.#controller.showMilkView());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Removes the view
     */
    #cancel() {
        this.#controller.removeViews();
        document.body.removeChild(this.#dialog);
    }
}