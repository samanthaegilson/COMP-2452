import Cart from "../model/cart.ts";
import AppleView from "../view/apple-view.ts";
import BananaView from "../view/banana-view.ts";
import CartView from "../view/cart-view.ts";
import ChooseProductView from "../view/choose-product-view.ts";
import ReceiptView from "../view/receipt-view.ts";

export default class CartController {
    #cart: Cart;
    #cartView: CartView;
    #chooseProductView?: ChooseProductView;
    #receiptView?: ReceiptView;
    #appleView?: AppleView;
    #bananaView?: BananaView;

    constructor() {
        this.#cart = new Cart();
        this.#cartView = new CartView(this.#cart, this);
    }

    showChooseProductView() {
        if (this.#chooseProductView == undefined) {
            this.#chooseProductView = new ChooseProductView(this);
        }
    }

    showReceiptView() {
        if (this.#receiptView == undefined) {
            this.#receiptView = new ReceiptView(this);
        }
    }

    showAppleView() {
        if (this.#appleView == undefined) {
            this.#appleView = new AppleView(this);
        }
    }

    showBananaView() {
        if (this.#bananaView == undefined) {
            this.#bananaView = new BananaView(this);
        }
    }
}