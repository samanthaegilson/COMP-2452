import type ReceiptController from "../controller/receipt-controller.ts";
import type Receipt from "../model/receipt.ts";

export default class ReceiptView {
    #receipt: Receipt;
    #controller: ReceiptController;
    #cartEL: HTMLUListElement;
    #dialog: HTMLDialogElement;

    constructor(receipt: Receipt, controller: ReceiptController) {
        this.#receipt = receipt;
        this.#controller = controller;
        this.#receipt.cart.registerListener(this);

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "receipt-dialog";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="receipt">Receipt</label>
            <ul></ul>
            <span id="total"></span><br />
            <button id="done">Done</button>`

        this.#cartEL = this.#dialog.querySelector("#receipt-dialog > ul")!;

        this.#dialog.querySelector("#total")!.textContent = "Total: $"
            + this.#receipt.total;

        this.#dialog.querySelector("#done")!
            .addEventListener("click", () => this.#done());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #done() {
        this.#controller.removeView();
        document.body.removeChild(this.#dialog);
    }

    notify(): void {
        // empty the contents of the list
        this.#cartEL.replaceChildren();

        this.#receipt.cart.products.forEach((p) => {
            let prodEl = document.createElement("li");
            prodEl.innerHTML = `<strong>${"x" + p.quantity + " "
                + p.constructor.name + "\t$" + (p.price * p.quantity)}</strong>`;
            this.#cartEL.appendChild(prodEl);
        })

        this.#dialog.querySelector("#total")!.textContent = "Total: $"
            + this.#receipt.total;

        console.log("Num of prods: " + this.#receipt.cart.products[0].quantity);
    }
}