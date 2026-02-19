import Cart from "../model/cart.ts";
import Receipt from "../model/receipt.ts";
import ReceiptView from "../view/receipt-view.ts";

/**
 * A controller for the {@link Receipt}.
 */
export default class ReceiptController {
    #receipt: Receipt;
    #receiptView?: ReceiptView;

    /**
     * Constructs a ReceiptController. Initializes the receipt and the receipt 
     * view
     * 
     * @param cart the cart of the receipt
     */
    constructor(cart: Cart) {
        this.#receipt = new Receipt(cart);
        this.#receiptView = new ReceiptView(this.#receipt, this);
    }

    get receiptView() {
        return this.#receiptView;
    }

    /**
     * Hides the receipt view
     */
    removeView(): void {
        this.#receiptView = undefined;
    }
}