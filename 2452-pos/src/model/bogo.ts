import { assert } from "../assertions";
import Apple from "./apple.ts";
import Banana from "./banana.ts";
import db from './connection.ts';
import Milk from "./milk.ts";
import type Product from "./product";
import type Receipt from "./receipt";

/**
 * A BOGO. A type of {@link Coupon} to apply to a {@link Receipt}.
 */
export default class BOGO {
    id?: number;
    #receipt: Receipt;
    #product: Product;

    /**
     * Constructs a BOGO. Sets the receipt and product
     * 
     * @param receipt the receipt the BOGO applies to
     * @param product the product the BOGO applies to
     */
    constructor(receipt: Receipt, product: Product) {
        this.#receipt = receipt;
        this.#product = product;
        this.#checkBOGO();
    }

    /**
     * Invariant properties for BOGO
     */
    #checkBOGO() {
        assert(this.#product != null, "Product should never be null.");
        assert(this.#receipt != null, "Cart should never be null.");
    }

    /**
     * Loads the BOGOs in the database in a specific receipt
     * 
     * @param receipt the receipt of the BOGO
     * @returns all the BOGOs of the receipt
     */
    static async getBOGOForReceipt(receipt: Receipt): Promise<Array<BOGO>> {
        const allBOGOs = new Array<BOGO>();
        const APPLE = "Apple";
        const BANANA = "Banana";

        let results = await db().query<
            {
                id: number,
                product_class: string,
                product_type: string
            }
        >("select id, product_class, product_type from coupon where class = 'BOGO' and receipt = $1",
            [receipt.id]);

        // Determines what kind of product the productType is
        for (let row of results.rows) {
            let product = undefined;
            if (row.product_class == APPLE) {
                product = new Apple(row.product_type);
            } else if (row.product_class == BANANA) {
                product = new Banana(row.product_type);
            } else {
                product = new Milk(row.product_type);
            }

            let bogo = new BOGO(receipt, product);
            bogo.id = row.id;
            allBOGOs.push(bogo);
        }

        return allBOGOs;
    }

    /**
     * Saves a BOGO to the database
     * 
     * @param bogo the BOGO to save
     * @returns the BOGO 
     */
    static async saveBOGO(bogo: BOGO): Promise<BOGO> {
        let results = await db().query<{ id: number }>
            ("insert into coupon(id, class, percent, product_class, product_type, receipt) values(default, $1, $2, $3, $4, $5) on conflict do nothing returning id",
                [bogo.constructor.name, -1, bogo.product.constructor.name, bogo.product.type, bogo.receipt.id])

        results.rows.forEach((row) => {
            bogo.id = row['id']
            console.log(`bogo got ID ${bogo.id}`)
        })

        return bogo;
    }

    // Getters
    get receipt(): Receipt {
        return this.#receipt;
    }

    get product(): Product {
        return this.#product;
    }
}