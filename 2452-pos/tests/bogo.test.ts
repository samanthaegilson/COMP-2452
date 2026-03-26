import { expect, test } from 'vitest';
import Account from '../src/model/account.ts';
import Apple from '../src/model/apple.ts';
import BOGO from '../src/model/bogo.ts';
import Cart from '../src/model/cart.ts';
import Receipt from "../src/model/receipt.ts";

test('Can save discount', () => {
    let apple = new Apple();
    let account = new Account("bogo", "bogo");
    account.cart.addProduct(apple, 1);

    let cartPromise = Cart.saveCart(account.cart);
    cartPromise.then(() => {
        let accountPromise = Account.saveAccount(account);
        accountPromise.then(() => {
            let receipt = new Receipt(account.cart, account);
            let receiptPromise = Receipt.saveReceipt(receipt);
            receiptPromise.then(() => {
                let bogo = new BOGO(receipt, apple);
                BOGO.saveBOGO(bogo);

                let promise = BOGO.getBOGOForReceipt(receipt);
                promise.then((allBOGOs) => {
                    for (let retrieved of allBOGOs) {
                        expect(retrieved.id).equals(bogo.id);
                        expect(retrieved.product.constructor.name)
                            .equals(bogo.product.constructor.name);
                        expect(retrieved.receipt).equals(bogo.receipt);
                    }
                })
            })
        })
    })
});