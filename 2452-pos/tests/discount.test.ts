import { expect, test } from 'vitest';
import Account from '../src/model/account.ts';
import Apple from '../src/model/apple.ts';
import Cart from '../src/model/cart.ts';
import Discount from '../src/model/discount.ts';
import Receipt from "../src/model/receipt.ts";

test('Can save discount', () => {
    let apple = new Apple("Gala");
    let account = new Account("discount", "discount");
    account.cart.addProduct(apple, 1);

    let cartPromise = Cart.saveCart(account.cart);
    cartPromise.then(() => {
        let accountPromise = Account.saveAccount(account);
        accountPromise.then(() => {
            let receipt = new Receipt(account.cart, account);
            let receiptPromise = Receipt.saveReceipt(receipt);
            receiptPromise.then(() => {
                let discount = new Discount(receipt, 25);
                Discount.saveDiscount(discount);

                let promise = Discount.getDiscountForReceipt(receipt);
                promise.then((allDiscounts) => {
                    for (let retrieved of allDiscounts) {
                        expect(retrieved.id).equals(discount.id);
                        expect(retrieved.percentage).equals(discount.percentage);
                        expect(retrieved.receipt).equals(discount.receipt);
                    }
                })
            })
        })
    })
});