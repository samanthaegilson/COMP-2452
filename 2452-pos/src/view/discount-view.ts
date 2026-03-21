import type ReceiptController from "../controller/receipt-controller";
import { InvalidPercentage } from "../model/discount";

export default class DiscountView {
    #controller: ReceiptController;
    #dialog: HTMLDialogElement;

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

    #applyDiscount() {
        let percentage = this.#dialog.querySelector<HTMLInputElement>("input[type='number']")!.valueAsNumber;
        try {
            this.#controller.applyDiscount(percentage);
            this.#controller.hideDiscountView();
            document.body.removeChild(this.#dialog);
        } catch (e: any) {
            if (e instanceof InvalidPercentage) {
                document.querySelector("#error")!
                    .textContent = "Invalid percentage. Percentage must be "
                    + "between 0 and 100 (e.g., 10).";
            } else {
                console.log("unexpected error " + e);
            }
        }
    }

    #cancel() {
        this.#controller.hideDiscountView();
        document.body.removeChild(this.#dialog);
    }
}