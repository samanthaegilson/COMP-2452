import type CartController from "../controller/cart-controller";

export default class MilkView {
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
                <label for="milkView">Milk</label>
                <label for="volume">Volume</label>
                <input type="number" id="volume"/>
                <button id="addMilk">Add Milk</button>
                <button id="removeMilk">Remove Milk</button>
                <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#addMilk")!
            .addEventListener("click", () => this.#addMilk());

        this.#dialog.querySelector("#removeMilk")!
            .addEventListener("click", () => this.#removeMilk());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #addMilk() {
        // CHECK AMOUNT IS POSITIVE
        let amount = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        this.#controller.addMilk(amount);
        document.body.removeChild(this.#dialog);
    }

    #removeMilk() {
        let amount = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        let removed = this.#controller.removeMilk(amount);
        if (removed) {
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if the milk quantity was 0
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