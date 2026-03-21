import type Account from "../model/account.ts";
import Apple from "../model/apple.ts";
import Banana from "../model/banana.ts";
import BOGO from "../model/bogo.ts";
import Cart from "../model/cart.ts";
import Discount from "../model/discount.ts";
import Milk from "../model/milk.ts";
import type Product from "../model/product.ts";
import Receipt from "../model/receipt.ts";
import BOGOView from "../view/bogo-view.ts";
import CouponView from "../view/coupon-view.ts";
import DiscountView from "../view/discount-view.ts";
import ReceiptView from "../view/receipt-view.ts";

/**
 * A controller for the {@link Receipt}.
 */
export default class ReceiptController {
    #receipt: Receipt;
    #receiptView?: ReceiptView;
    #couponView?: CouponView;
    #discountView?: DiscountView;
    #bogoView?: BOGOView;

    /**
     * Constructs a ReceiptController. Initializes the receipt and the receipt 
     * view
     * 
     * @param cart the cart of the receipt
     */
    constructor(cart: Cart, account: Account) {
        this.#receipt = new Receipt(cart, account);
        this.#couponView = new CouponView(this);
    }

    get receiptView() {
        return this.#receiptView;
    }

    showReceiptView(): void {
        if (this.#receiptView == undefined) {
            this.#receiptView = new ReceiptView(this.#receipt, this);
        }
    }

    showDiscountView(): void {
        if (this.#discountView == undefined) {
            this.#discountView = new DiscountView(this);
        }
    }

    showBOGOView(): void {
        if (this.#bogoView == undefined) {
            this.#bogoView = new BOGOView(this);
        }
    }

    showCouponView(): void {
        if (this.#couponView == undefined) {
            this.#couponView = new CouponView(this);
        }
    }

    applyDiscount(percentage: number): void {
        let discount = new Discount(this.#receipt, percentage);
        Receipt.saveReceipt(this.#receipt);
        this.#receipt.applyDiscount(discount);
    }

    bogoApple(): boolean {
        return this.applyBOGO(new Apple());
    }

    bogoBanana(): boolean {
        return this.applyBOGO(new Banana());
    }

    bogoMilk(): boolean {
        return this.applyBOGO(new Milk());
    }

    applyBOGO(product: Product): boolean {
        let bogo = new BOGO(this.#receipt, product);
        Receipt.saveReceipt(this.#receipt);
        return this.#receipt.applyBOGO(bogo);
    }

    doneCoupons(): void {
        this.hideCouponView();
        this.showReceiptView();
    }

    /**
     * Hides the receipt view
     */
    hideReceiptView(): void {
        this.#receiptView = undefined;
    }

    hideCouponView(): void {
        this.#couponView = undefined;
    }

    hideBOGOView(): void {
        this.#bogoView = undefined;
    }

    hideDiscountView(): void {
        this.#discountView = undefined;
    }
}