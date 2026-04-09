import type CartController from "../controller/cart-controller";

/**
 * A view for a {@link Milk}.
 */
export default class MilkView {
    #controller: CartController;
    #dialog: HTMLDialogElement;

    /**
     * Constructs a MilkView. Displays the window
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
            <label for="type">Type</label>
            <select name="type" id="type">
                <option value="Almond">Almond</option>
                <option value="Whole">Whole</option>
                <option value="Skim">Skim</option>
            </select>
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

    /**
     * Adds a milk to the cart
     */
    #addMilk() {
        let amount = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        let type = this.#dialog.querySelector<HTMLSelectElement>("#type")!.value;
        // Checks the number is a valid integer
        if (Number.isInteger(amount) && amount > 0) {
            this.#controller.addMilk(amount, type);
            document.body.removeChild(this.#dialog);
        } else {
            this.#dialog.querySelector("#error")!
                .textContent = "Amount to add must be a positive whole number, e.g. 2.";
        }
    }

    /**
     * Removes a milk from the cart
     */
    #removeMilk() {
        let amount = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        let type = this.#dialog.querySelector<HTMLSelectElement>("#type")!.value;
        // Checks the number is a valid integer
        if (Number.isInteger(amount) && amount > 0) {
            let removed = this.#controller.removeMilk(amount, type);
            if (removed) {
                document.body.removeChild(this.#dialog);
            } else {
                // Displays an error if the milk quantity was 0
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