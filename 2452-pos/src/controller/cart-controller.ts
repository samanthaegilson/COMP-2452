import Account from "../model/account.ts";
import Apple from "../model/apple.ts";
import Banana from "../model/banana.ts";
import Cart from "../model/cart.ts";
import Milk from "../model/milk.ts";
import AppleView from "../view/apple-view.ts";
import AutoShopperView from "../view/auto-shopper-view.ts";
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
    #autoShopperView?: AutoShopperView;

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
     * Displays the window to start the auto shopper from
     */
    showAutoShopper() {
        if (this.#autoShopperView == undefined) {
            this.#autoShopperView = new AutoShopperView(this);
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
     * @param amount the amount of apples to add
     * @param type the type of apple to add
     */
    addApple(amount: number, type: string): void {
        this.#cart.addProduct(new Apple(type), amount);
        this.#appleView = undefined;
        Cart.saveCart(this.#cart);
    }

    /**
     * Adds a banana to the cart
     * 
     * @param amount the amount of bananas to add
     * @param type the type of banana to add
     */
    addBanana(amount: number, type: string): void {
        this.#cart.addProduct(new Banana(type), amount);
        this.#bananaView = undefined;
        Cart.saveCart(this.#cart);
    }

    /**
     * Adds milk to the cart
     * 
     * @param amount the amount of milk to add
     * @param type the type of milk to add
     */
    addMilk(amount: number, type: string): void {
        this.#cart.addProduct(new Milk(type), amount);
        this.#milkView = undefined;
        Cart.saveCart(this.#cart);
    }

    /**
     * Removes an apple from the cart
     * 
     * @param amount the amount of apples to remove
     * @param type the type of apple to remove
     * @returns if the apple was successfully removed or not
     */
    removeApple(amount: number, type: string): boolean {
        let removed = this.#cart.removeProduct(new Apple(type), amount);
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
     * @param type the type of banana to remove
     * @returns if the banana was successfully removed or not
     */
    removeBanana(amount: number, type: string): boolean {
        let removed = this.#cart.removeProduct(new Banana(type), amount);
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
     * @param type the type of milk to remove
     * @returns if the milk was successfully removed or not
     */
    removeMilk(amount: number, type: string) {
        let removed = this.#cart.removeProduct(new Milk(type), amount);
        if (removed) {
            this.#milkView = undefined;
        }
        Cart.saveCart(this.#cart);
        return removed;
    }

    /**
     * Places items in the cart for the user
     * 
     * @param amount the amount to spend on products
     */
    startAutoShopper(amount: number): void {
        this.#cart.autoShop(amount);
        Cart.saveCart(this.#cart);
    }

    /**
     * Hides all the product pop up views
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

    /**
     * Hides the auto shopper window
     */
    hideAutoShopperView(): void {
        this.#autoShopperView = undefined;
    }
}