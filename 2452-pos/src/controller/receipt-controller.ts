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
        Receipt.saveReceipt(this.#receipt);
        this.#couponView = new CouponView(this);
    }

    get receiptView() {
        return this.#receiptView;
    }

    /**
     * Displays the view of the receipt
     */
    showReceiptView(): void {
        if (this.#receiptView == undefined) {
            this.#receiptView = new ReceiptView(this.#receipt, this);
        }
    }

    /**
     * Displays the view to add a discount
     */
    showDiscountView(): void {
        if (this.#discountView == undefined) {
            this.#discountView = new DiscountView(this);
        }
    }

    /**
     * Displays the view to add a BOGO
     */
    showBOGOView(): void {
        if (this.#bogoView == undefined) {
            this.#bogoView = new BOGOView(this);
        }
    }

    /**
     * Displays the view to add a coupon
     */
    showCouponView(): void {
        if (this.#couponView == undefined) {
            this.#couponView = new CouponView(this);
        }
    }

    /**
     * Applies a discount coupon to the receipt
     * 
     * @param percentage the percentage to remove from the total
     */
    applyDiscount(percentage: number): void {
        let discount = new Discount(this.#receipt, percentage);
        this.#receipt.applyDiscount(discount);
        Receipt.saveReceipt(this.#receipt);
    }

    /**
     * Applies a BOGO for an apple
     * 
     * @returns if the BOGO was applied successfully
     */
    bogoApple(): boolean {
        return this.applyBOGO(new Apple());
    }

    /**
     * Applies a BOGO for a banana
     * 
     * @returns if the BOGO was applied successfully
     */
    bogoBanana(): boolean {
        return this.applyBOGO(new Banana());
    }

    /**
     * Applies a BOGO for a milk
     * 
     * @returns if the BOGO was applied successfully
     */
    bogoMilk(): boolean {
        return this.applyBOGO(new Milk());
    }

    /**
     * Applies a BOGO to the receipt
     * 
     * @param product the product to apply the BOGO to
     * @returns if the BOGO was successfully applied
     */
    applyBOGO(product: Product): boolean {
        let bogo = new BOGO(this.#receipt, product);
        let applied = this.#receipt.applyBOGO(bogo);
        Receipt.saveReceipt(this.#receipt);
        return applied;
    }

    /**
     * Hides coupon view and shows the receipt view
     */
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

    /**
     * Hides the coupon view
     */
    hideCouponView(): void {
        this.#couponView = undefined;
    }

    /**
     * Hides the BOGO view
     */
    hideBOGOView(): void {
        this.#bogoView = undefined;
    }

    /**
     * Hides the discount view
     */
    hideDiscountView(): void {
        this.#discountView = undefined;
    }
}