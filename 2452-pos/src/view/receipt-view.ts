import type ReceiptController from "../controller/receipt-controller.ts";
import type Receipt from "../model/receipt.ts";

/**
 * A view for a {@link Receipt}.
 */
export default class ReceiptView {
    #receipt: Receipt;
    #controller: ReceiptController;
    #cartEL: HTMLUListElement;
    #dialog: HTMLDialogElement;

    /**
     * Constructs a ReceiptView. Displays the window
     * 
     * @param receipt the receipt of the view
     * @param controller the controller of the view
     */
    constructor(receipt: Receipt, controller: ReceiptController) {
        this.#receipt = receipt;
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "receipt-dialog";
        this.#dialog.innerHTML = `
            <label for="receipt">Receipt</label>
            <ul></ul>
            <span id="total"></span><br />
            <button id="done">Done</button>`

        this.#cartEL = this.#dialog.querySelector("#receipt-dialog > ul")!;

        // Adds each product of the cart to the list
        this.#receipt.cart.products.forEach((p) => {
            let prodEl = document.createElement("li");
            prodEl.innerHTML = `<strong>${"x" + p.quantity + " "
                + p.constructor.name + "\t$" + (p.price * p.quantity)}</strong>`;
            this.#cartEL.appendChild(prodEl);
        })

        // Adds the total to the display
        this.#dialog.querySelector("#total")!.textContent = "Total: $"
            + this.#receipt.total;

        this.#dialog.querySelector("#done")!
            .addEventListener("click", () => this.#done());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Removes the view
     */
    #done() {
        this.#controller.removeView();
        document.body.removeChild(this.#dialog);
    }
}