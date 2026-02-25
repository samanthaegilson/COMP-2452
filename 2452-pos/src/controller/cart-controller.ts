import Apple from "../model/apple.ts";
import Banana from "../model/banana.ts";
import Cart from "../model/cart.ts";
import type Product from "../model/product.ts";
import AppleView from "../view/apple-view.ts";
import BananaView from "../view/banana-view.ts";
import CartView from "../view/cart-view.ts";
import ChooseProductView from "../view/choose-product-view.ts";
import ReceiptController from "./receipt-controller.ts";

/**
 * A controller for the {@link Cart}.
 */
export default class CartController {
    #cart: Cart;
    #cartView: CartView;
    #chooseProductView?: ChooseProductView;
    #appleView?: AppleView;
    #bananaView?: BananaView;
    #receiptController?: ReceiptController;

    /**
     * Constructs a CartController. Initializes the cart and cart view
     */
    constructor() {
        this.#cart = new Cart();
        this.#cartView = new CartView(this.#cart, this);
    }

    /**
     * Creates a new ReceiptController to show the receipt
     */
    showReceiptView(): void {
        if (this.#receiptController == undefined
            || this.#receiptController.receiptView == undefined) {
            this.#receiptController = new ReceiptController(this.#cart);
            this.#cart.emptyContents();
        }
    }

    /**
     * Displays the window to choose a product from
     */
    showChooseProductView(): void {
        if (this.#chooseProductView == undefined) {
            this.#chooseProductView = new ChooseProductView(this);
        }
    }

    /**
     * Displays the window to add an apple from
     */
    showAppleView(): void {
        if (this.#appleView == undefined) {
            this.#appleView = new AppleView(this);
        }
    }

    /**
     * Displays the window to add a banana from
     */
    showBananaView(): void {
        if (this.#bananaView == undefined) {
            this.#bananaView = new BananaView(this);
        }
    }

    /**
     * Adds an apple to the cart
     */
    addApple(): void {
        this.#cart.addProduct(new Apple());
        this.hideProductViews();
    }

    /**
     * Adds a banana to the cart
     */
    addBanana(): void {
        this.#cart.addProduct(new Banana());
        this.hideProductViews();
    }

    /**
     * Removes a product from the cart
     * 
     * @param product the product to remove
     * @returns if the product was successfully removed or not
     */
    removeProduct(product: Product): boolean {
        let removed = this.#cart.removeProduct(product);
        if (removed) {
            this.hideProductViews();
        }
        return removed;
    }

    /**
     * Hides all the pop up views
     */
    removeViews(): void {
        this.#chooseProductView = undefined;
        this.hideProductViews();
    }

    /**
     * Hides the product windows
     */
    hideProductViews(): void {
        this.#appleView = undefined;
        this.#bananaView = undefined;
    }
}