import type ReceiptController from "../controller/receipt-controller";

export default class CouponView {
    #controller: ReceiptController;
    #dialog: HTMLDialogElement;

    constructor(controller: ReceiptController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "coupon-dialog";
        this.#dialog.innerHTML = `
            <label for="type">Type of coupon</label>
            <button id="discount">Discount</button>
            <button id="bogo">BOGO</button>
            <button id="done">Done</button>`

        this.#dialog.querySelector("#discount")!
            .addEventListener("click", () => this.#controller.showDiscountView());

        this.#dialog.querySelector("#bogo")!
            .addEventListener("click", () => this.#controller.showBOGOView());

        this.#dialog.querySelector("#done")!
            .addEventListener("click", () => this.#done());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #done() {
        this.#controller.doneCoupons();
        document.body.removeChild(this.#dialog);
    }
}