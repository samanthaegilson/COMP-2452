import type ReceiptController from "../controller/receipt-controller";
import { InvalidPercentage } from "../model/discount";

/**
 * A view to apply a {@link Discount} to a {@link Receipt}.
 */
export default class DiscountView {
    #controller: ReceiptController;
    #dialog: HTMLDialogElement;

    /**
     * Constructor for DiscountView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: ReceiptController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "coupon-dialog";
        this.#dialog.innerHTML = `
                <span id="error"></span><br />
                <label for="percentage">Enter percentage</label>
                <input type="number" id="percentage" />
                <button id="apply">Apply</button>
                <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#apply")!
            .addEventListener("click", () => this.#applyDiscount());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Applies a discount to the receipt
     */
    #applyDiscount() {
        let percentage = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        if (Number.isInteger(percentage)) {
            try {
                this.#controller.applyDiscount(percentage);
                this.#cancel();
            } catch (e: any) {
                // Prints an error if an invalid percentage is entered
                if (e instanceof InvalidPercentage) {
                    this.#dialog.querySelector("#error")!
                        .textContent = "Invalid percentage. Percentage must be "
                        + "between 0 and 100 (e.g., 10).";
                } else {
                    console.log("unexpected error " + e);
                }
            }
        } else {
            this.#dialog.querySelector("#error")!
                .textContent = "Invalid percentage. Percentage must be "
                + "a whole number between 0 and 100 (e.g., 10).";
        }
    }

    /**
     * Removes the view
     */
    #cancel() {
        this.#controller.hideDiscountView();
        document.body.removeChild(this.#dialog);
    }
}