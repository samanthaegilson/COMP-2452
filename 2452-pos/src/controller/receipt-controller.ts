import Cart from "../model/cart.ts";
import Receipt from "../model/receipt.ts";
import ReceiptView from "../view/receipt-view.ts";

export default class ReceiptController {
    #receipt: Receipt;
    #receiptView?: ReceiptView;

    constructor(cart: Cart) {
        this.#receipt = new Receipt(cart);
        this.#receiptView = new ReceiptView(this.#receipt, this);
    }

    get receiptView() {
        return this.#receiptView;
    }

    removeView() {
        this.#receiptView = undefined;
    }
}