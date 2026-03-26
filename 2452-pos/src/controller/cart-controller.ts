import Account from "../model/account.ts";
import Apple from "../model/apple.ts";
import Banana from "../model/banana.ts";
import Cart from "../model/cart.ts";
import Milk from "../model/milk.ts";
import AppleView from "../view/apple-view.ts";
import BananaView from "../view/banana-view.ts";
import CartView from "../view/cart-view.ts";
import ChooseProductView from "../view/choose-product-view.ts";
import MilkView from "../view/milk-view.ts";
import ReceiptController from "./receipt-controller.ts";

/**
 * A controller for the {@link Cart}.
 */
export default class CartController {
    #cart: Cart;
    #account: Account;
    #cartView: CartView;
    #chooseProductView?: ChooseProductView;
    #appleView?: AppleView;
    #bananaView?: BananaView;
    #milkView?: MilkView;

    /**
     * Constructs a CartController. Initializes the cart and cart view
     */
    constructor(account: Account) {
        this.#account = account;
        this.#cart = account.cart;
        this.#cartView = new CartView(this.#account, this);
    }

    /**
     * Creates a new ReceiptController to show the receipt
     */
    showReceiptView(): void {
        new ReceiptController(this.#cart, this.#account);
        this.#account.cart = new Cart();
        this.#cart = this.#account.cart;
        this.#cartView = new CartView(this.#account, this);
        Account.updateCart(this.#account);
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
     * Displays the window to add milk from
     */
    showMilkView(): void {
        if (this.#milkView == undefined) {
            this.#milkView = new MilkView(this);
        }
    }

    /**
     * Adds an apple to the cart
     * 
     * @param amount the amount of apples to remove
     */
    addApple(amount: number): void {
        this.#cart.addProduct(new Apple(), amount);
        this.#appleView = undefined;
        Cart.saveCart(this.#cart);
    }

    /**
     * Adds a banana to the cart
     * 
     * @param amount the amount of bananas to remove
     */
    addBanana(amount: number): void {
        this.#cart.addProduct(new Banana(), amount);
        this.#bananaView = undefined;
        Cart.saveCart(this.#cart);
    }

    /**
     * Adds milk to the cart
     * 
     * @param amount the amount of milk to remove
     */
    addMilk(amount: number): void {
        this.#cart.addProduct(new Milk(), amount);
        this.#milkView = undefined;
        Cart.saveCart(this.#cart);
    }

    /**
     * Removes an apple from the cart
     * 
     * @param amount the amount of apples to remove
     * @returns if the apple was successfully removed or not
     */
    removeApple(amount: number): boolean {
        let removed = this.#cart.removeProduct(new Apple(), amount);
        if (removed) {
            this.#appleView = undefined;
        }
        Cart.saveCart(this.#cart);
        return removed;
    }

    /**
     * Removes a banana from the cart
     * 
     * @param amount the amount of bananas to remove
     * @returns if the banana was successfully removed or not
     */
    removeBanana(amount: number): boolean {
        let removed = this.#cart.removeProduct(new Banana(), amount);
        if (removed) {
            this.#bananaView = undefined;
        }
        Cart.saveCart(this.#cart);
        return removed;
    }

    /**
     * Removes a milk from the cart
     * 
     * @param amount the amount of milk to remove
     * @returns if the milk was successfully removed or not
     */
    removeMilk(amount: number) {
        let removed = this.#cart.removeProduct(new Milk(), amount);
        if (removed) {
            this.#milkView = undefined;
        }
        Cart.saveCart(this.#cart);
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