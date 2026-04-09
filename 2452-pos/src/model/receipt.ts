import { Temporal } from '@js-temporal/polyfill';
import { assert } from '../assertions.ts';
import Account from './account.ts';
import BOGO from './bogo.ts';
import Cart from "./cart.ts";
import db from './connection.ts';
import type Coupon from './coupon.ts';
import Discount from './discount.ts';

/**
 * A receipt. Contains the {@link Cart} of {@link Product} and the total price.
 */
export default class Receipt {
    id?: number;
    #cart: Cart;
    #total: number;
    #timestamp: Temporal.PlainDateTime;
    #account: Account;
    #coupons: Array<Coupon>;

    /**
     * Constructs a receipt. Initializes the cart and total
     * 
     * @param cart the cart of the receipt
     * @param account the account of the receipt
     */
    constructor(cart: Cart, account: Account) {
        this.#cart = cart;
        this.#account = account;
        this.#total = 0;
        this.#coupons = new Array<Coupon>;
        this.#timestamp = Temporal.Now.plainDateTimeISO();

        if (this.#cart.products.length < 1) {
            throw new InvalidEmptyCartException();
        }

        // Calculates the total from the products in the cart
        for (const product of this.#cart.products) {
            this.#total += (product.price * product.quantity);
        }

        this.#account.addReceipt(this);

        this.#checkReceipt();
    }

    /**
     * Invariant properties for a receipt
     */
    #checkReceipt(): void {
        assert(this.#cart.products.length > 0, "Cart must have at least one "
            + " product.");
        assert(this.#account != null, "Account should never be null.");
        assert(this.#total >= 0, "Total must be at least zero.");
        assert(this.#coupons != null, "Coupons should never be null.");

        for (const coupon of this.#coupons) {
            assert(coupon != null, "Coupons in coupons should not be null.");
        }
    }

    /**
     * Saves a receipt to the database
     * 
     * @param receipt the receipt to save
     * @returns the receipt
     */
    static async saveReceipt(receipt: Receipt): Promise<Receipt> {
        if (!receipt.id) {
            // Inserts the receipt if not already in the database
            let results = await db().query<{ id: number }>
                ("insert into receipt(id, cart, total, account, timestamp) values(default, $1, $2, $3, $4) returning id",
                    [receipt.cart.id, receipt.total, receipt.account.username, receipt.timestamp.toString()]);

            results.rows.forEach((row) => {
                receipt.id = row['id']
                console.log(`receipt got ID ${receipt.id}`)
            })
        } else {
            // Updates the quantity if the receipt is already in the database
            await db().query<{ id: number }>("update receipt set total = ($1) where id = ($2)",
                [receipt.total, receipt.id])
        }

        // Saves all coupons of the receipt
        receipt.#coupons.forEach((coupon) => {
            if (!coupon.id) {
                if (coupon instanceof BOGO) {
                    BOGO.saveBOGO(coupon)
                } else if (coupon instanceof Discount) {
                    Discount.saveDiscount(coupon);
                }
            }
        })

        return receipt;
    }

    /**
     * Loads all the receipts of a specific account from the database
     * 
     * @param account the account of the receipt
     * @returns the receipts of the account
     */
    static async getReceiptForAccount(account: Account): Promise<Array<Receipt>> {
        let results = await db().query<
            {
                id: number,
                cart: number,
                total: number,
                timestamp: string
            }
        >("select id, cart, total, timestamp from receipt where account = $1",
            [account.username])

        let allReceipts = new Array<Receipt>();

        // Sets the properties of every receipt
        for (let row of results.rows) {
            let cart = await Cart.getCartById(row.cart);
            let receipt = new Receipt(cart, account);
            receipt.id = row.id;
            receipt.timestamp = Temporal.PlainDateTime.from(row.timestamp);

            // Gets the coupons if the receipt
            let discounts = await Discount.getDiscountForReceipt(receipt);
            let bogos = await BOGO.getBOGOForReceipt(receipt);

            for (let discount of discounts) {
                receipt.applyDiscount(discount);
            }

            for (let bogo of bogos) {
                receipt.applyBOGO(bogo);
            }

            allReceipts.push(receipt);
        }
        return allReceipts;
    }

    // Getters
    get cart(): Cart {
        return this.#cart;
    }

    get total(): number {
        return this.#total;
    }

    get account(): Account {
        return this.#account;
    }

    get coupons(): Array<Coupon> {
        return this.#coupons;
    }

    get timestamp(): Temporal.PlainDateTime {
        return this.#timestamp;
    }

    // Setter
    set timestamp(time: Temporal.PlainDateTime) {
        this.#timestamp = time;
    }

    /**
     * Applies a BOGO coupon to the receipt
     * 
     * @param bogo the BOGO to apply
     * @returns if the BOGO has applied or not
     */
    applyBOGO(bogo: BOGO): boolean {
        this.#checkReceipt();
        let applied = false;
        let found = false;
        let index = 0;

        // Checks there are enough of the product to apply a BOGO
        while (!found && index < this.#cart.products.length) {
            if (this.#cart.products[index].constructor.name == bogo.product.constructor.name
                && this.#cart.products[index].type == bogo.product.type) {
                found = true;
                if (this.#cart.products[index].quantity >= 2) {
                    // Removes the prices of 1 instace/litre of the product
                    this.#total -= bogo.product.price;
                    this.#coupons.push(bogo);
                    applied = true;
                }
            } else {
                index++;
            }
        }

        this.#checkReceipt();
        return applied;
    }

    /**
     * Applies a discount coupon to the receipt
     * 
     * @param discount the discount to apply
     */
    applyDiscount(discount: Discount): void {
        this.#checkReceipt();
        const PERCENTAGE_CONVERT = 100;
        let remove = this.#total * discount.percentage / PERCENTAGE_CONVERT;
        this.#total -= remove;
        this.#coupons.push(discount);
        this.#checkReceipt();
    }

}

export class InvalidEmptyCartException extends Error { }