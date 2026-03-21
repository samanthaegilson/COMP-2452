import { assert } from '../assertions.ts';
import type Account from './account.ts';
import BOGO from './bogo.ts';
import Cart from "./cart.ts";
import db from './connection.ts';
import type Coupon from './coupon.ts';
import Discount from './discount.ts';
// import { Temporal } from '@js-temporal/polyfill';

/**
 * A receipt. Contains the {@link Cart} of {@link Product} and the total price.
 */
export default class Receipt {
    id?: number;
    #cart: Cart;
    #total: number;
    // #timestamp: Temporal;
    #account: Account;
    #coupons: Array<Coupon>;

    /**
     * Constructs a receipt. Initializes the cart and total
     * 
     * @param cart the cart of the receipt
     */
    constructor(cart: Cart, account: Account) {
        this.#cart = cart;
        this.#account = account;
        this.#total = 0;
        this.#coupons = new Array<Coupon>;

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

    static async saveReceipt(receipt: Receipt): Promise<Receipt> {
        let results = await db().query<{ id: number }>("insert into receipt(id, cart, total, account, timestamp) values(default, $1, $2, $3, $4) returning id",
            [receipt.cart, receipt.total, receipt.account.username, "time"]); // timestamp!!

        results.rows.forEach((row) => {
            receipt.id = row['id']
            console.log(`receipt got ID ${receipt.id}`)
        })

        receipt.#coupons.forEach((coupon) => {
            if (coupon instanceof BOGO) {
                BOGO.saveBOGO(coupon)
            } else if (coupon instanceof Discount) {
                Discount.saveDiscount(coupon);
            }
        })

        return receipt;
    }


    static async getReceiptForAccount(account: Account): Promise<Array<Receipt>> {
        let results = await db().query<
            {
                id: number,
                cart: number,
                total: number,
                account: string
                timestamp: string
            }
        >("select id, cart, total, account, timestamp from receipt where account = $1",
            [account.username])

        let allReceipts = new Array<Receipt>();

        results.rows.forEach(async (row) => {
            let carts = await Cart.getCartsForReceipt(row.id);
            let receipt = new Receipt(carts[0], account);
            receipt.id = row.id;
            allReceipts.push(receipt);
        })
        return allReceipts;
    }

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

    applyBOGO(bogo: BOGO): boolean {
        let applied = false;
        let found = false;
        let index = 0;

        while (!found && index < this.#cart.products.length) {
            if (this.#cart.products[index].constructor.name == bogo.product.constructor.name) {
                found = true;
                if (this.#cart.products[index].quantity >= 2) {
                    this.#total -= bogo.product.price;
                    this.#coupons.push(bogo);
                    applied = true;
                }
            } else {
                index++;
            }
        }

        return applied;
    }

    applyDiscount(discount: Discount): void {
        const PERCENTAGE_CONVERT = 100;
        let remove = this.#total * discount.percentage / PERCENTAGE_CONVERT;
        this.#total -= remove;
        this.#coupons.push(discount);
    }

}

export class InvalidEmptyCartException extends Error { }