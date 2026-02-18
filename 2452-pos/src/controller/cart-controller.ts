import Cart from "../model/cart.ts";
import type Product from "../model/product.ts";
import AppleView from "../view/apple-view.ts";
import BananaView from "../view/banana-view.ts";
import CartView from "../view/cart-view.ts";
import ChooseProductView from "../view/choose-product-view.ts";
import ReceiptController from "./receipt-controller.ts";

export default class CartController {
    #cart: Cart;
    #cartView: CartView;
    #chooseProductView?: ChooseProductView;
    #appleView?: AppleView;
    #bananaView?: BananaView;
    #receiptController?: ReceiptController;

    constructor() {
        this.#cart = new Cart();
        this.#cartView = new CartView(this.#cart, this);
    }

    showReceiptView(): void {
        if (this.#receiptController == undefined
            || this.#receiptController.receiptView == undefined) {
            this.#receiptController = new ReceiptController(this.#cart);
        }
    }

    showChooseProductView(): void {
        if (this.#chooseProductView == undefined) {
            this.#chooseProductView = new ChooseProductView(this);
        }
    }

    showAppleView(): void {
        if (this.#appleView == undefined) {
            this.#appleView = new AppleView(this);
        }
    }

    showBananaView(): void {
        if (this.#bananaView == undefined) {
            this.#bananaView = new BananaView(this);
        }
    }

    addProduct(product: Product): void {
        this.#cart.addProduct(product);
        this.hideProductViews();
    }

    removeProduct(product: Product): void {
        this.#cart.removeProduct(product);
        // check bool and print error?
        // SHOULD RETURN BOOL and view will deal with error
        this.hideProductViews();
    }

    removeViews(): void {
        this.#chooseProductView = undefined;
        this.hideProductViews();
    }

    hideProductViews(): void {
        this.#appleView = undefined;
        this.#bananaView = undefined;
    }
}