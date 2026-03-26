import { assert } from "../assertions";
import db from './connection.ts';
import type Receipt from "./receipt";

/**
 * A discount. A type of {@link Coupon} to apply to a {@link Receipt}.
 */
export default class Discount {
    id?: number;
    #receipt: Receipt;
    #percentage: number;

    /**
    * Constructs a discount. Sets the receipt and percentage
    * 
    * @param receipt the receipt the discount applies to
    * @param percentage the percentage of the price to remove
    */
    constructor(receipt: Receipt, percentage: number) {
        const MAX = 100;
        this.#receipt = receipt;
        this.#percentage = percentage;

        // Checks the percentage is within the proper range
        if (this.#percentage <= 0 || this.#percentage > MAX) {
            throw new InvalidPercentage();
        }

        this.#checkDiscount();
    }

    /**
     * Invariant properties for a discount
     */
    #checkDiscount() {
        assert(this.#receipt != null, "Cart should never be null.");
        assert(this.#percentage > 0, "Percentage should be bigger than 0.");
        assert(this.#percentage <= 100, "Percentage should not be bigger than 100.");
    }

    /**
     * Loads the discounts in the database in a specific receipt
     * 
     * @param receipt the receipt of the discount
     * @returns all the discounts of the receipt
     */
    static async getDiscountForReceipt(receipt: Receipt): Promise<Array<Discount>> {
        const allDiscounts = new Array<Discount>();

        let results = await db().query<
            {
                id: number,
                percent: number
            }
        >("select id, percent from coupon where class = 'Discount' and receipt = $1",
            [receipt.id]);

        // Sets the properties of every discount
        for (let row of results.rows) {
            let discount = new Discount(receipt, row.percent);
            discount.id = row.id;
            allDiscounts.push(discount);
        }

        return allDiscounts;
    }

    /**
     * Saves a discount to the database
     * 
     * @param discount the discount to save
     * @returns the discount
     */
    static async saveDiscount(discount: Discount): Promise<Discount> {
        let results = await db().query<{ id: number }>
            ("insert into coupon(id, class, percent, product_type, receipt) values(default, $1, $2, $3, $4) on conflict do nothing returning id",
                [discount.constructor.name, discount.percentage, "", discount.receipt.id])

        results.rows.forEach((row) => {
            discount.id = row['id']
            console.log(`discount got ID ${discount.id}`)
        })

        return discount;
    }

    // Getters
    get receipt(): Receipt {
        return this.#receipt;
    }

    get percentage(): number {
        return this.#percentage;
    }
}

export class InvalidPercentage extends Error { }