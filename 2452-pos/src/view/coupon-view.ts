import type ReceiptController from "../controller/receipt-controller";

/**
 * A view for a {@link Coupon}.
 */
export default class CouponView {
    #controller: ReceiptController;
    #dialog: HTMLDialogElement;

    /**
     * Constructs a CouponView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: ReceiptController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "coupon-dialog";
        this.#dialog.innerHTML = `
            <label for="type">Type of coupon</label>
            <button id="discount">Discount</button>
            <button id="bogo">BOGO</button>
            <button id="done">Done</button>`

        // Opens the view to apply a discount
        this.#dialog.querySelector("#discount")!
            .addEventListener("click", () => this.#controller.showDiscountView());

        // Opens the view to apply a BOGO
        this.#dialog.querySelector("#bogo")!
            .addEventListener("click", () => this.#controller.showBOGOView());

        this.#dialog.querySelector("#done")!
            .addEventListener("click", () => this.#done());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Removes the view
     */
    #done() {
        this.#controller.doneCoupons();
        document.body.removeChild(this.#dialog);
    }
}