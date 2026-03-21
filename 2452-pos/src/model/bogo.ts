import { assert } from "../assertions";
import db from './connection.ts';
import type Product from "./product";
import type Receipt from "./receipt";

export default class BOGO {
    #receipt: Receipt;
    #product: Product;

    constructor(receipt: Receipt, product: Product) {
        this.#receipt = receipt;
        this.#product = product;
        this.#checkBOGO();
    }

    #checkBOGO() {
        assert(this.#product != null, "Product should never be null.");
        assert(this.#receipt != null, "Cart should never be null.");
    }

    static async saveBOGO(bogo: BOGO): Promise<BOGO> {
        await db().query<{ class: string }>("insert into coupon(class, percentage, product, receipt) values($1, $2, $3, $4) on conflict do nothing returning class",
            [bogo.constructor.name, -1, bogo.product.constructor.name, bogo.receipt.id])

        return bogo;
    }

    get receipt(): Receipt {
        return this.#receipt;
    }

    get product(): Product {
        return this.#product;
    }
}