import { assert } from "../assertions";
import db from './connection.ts';
import type Receipt from "./receipt";

export default class Discount {
    #receipt: Receipt;
    #percentage: number;

    constructor(receipt: Receipt, percentage: number) {
        const MAX = 100;
        this.#receipt = receipt;
        this.#percentage = percentage;

        if (this.#percentage <= 0 || this.#percentage > MAX) {
            throw new InvalidPercentage();
        }

        this.#checkDiscount();
    }

    #checkDiscount() {
        assert(this.#receipt != null, "Cart should never be null.");
        assert(this.#percentage > 0, "Percentage should be bigger than 0.");
        assert(this.#percentage <= 100, "Percentage should not be bigger than 100.");
    }

    static async saveDiscount(discount: Discount): Promise<Discount> {
        await db().query<{ class: string }>("insert into coupon(class, percentage, product, receipt) values($1, $2, $3, $4) on conflict do nothing returning class",
            [discount.constructor.name, discount.percentage, -1, discount.receipt.id])

        return discount;
    }

    get receipt(): Receipt {
        return this.#receipt;
    }

    get percentage(): number {
        return this.#percentage;
    }
}

export class InvalidPercentage extends Error { }