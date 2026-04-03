import type CartController from "../controller/cart-controller";

export default class AutoShopperView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    constructor(controller: CartController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "choose-product-dialog";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="autoShopper">Auto Shopper</label>
            <label for="amount">Amount of money to shop with</label>
            <input type="number" id="amount"/>
            <button id="shop">Start Auto Shopper</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#shop")!
            .addEventListener("click", () => this.#autoShop());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #autoShop() {
        let amount = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        if (Number.isInteger(amount) && amount > 0) {
            this.#controller.startAutoShopper(amount);
            this.#cancel();
        } else {
            this.#dialog.querySelector("#error")!
                .textContent = "Amount to shop with must be a positive whole number, e.g. 20.";
        }
    }

    /**
     * Removes the view
     */
    #cancel() {
        this.#controller.hideAutoShopperView();
        document.body.removeChild(this.#dialog);
    }
}