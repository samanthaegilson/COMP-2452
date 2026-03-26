import { expect, test } from 'vitest';
import Account from '../src/model/account.ts';
import Apple from '../src/model/apple.ts';
import BOGO from '../src/model/bogo.ts';
import Cart from '../src/model/cart.ts';
import Discount from '../src/model/discount.ts';
import Receipt from "../src/model/receipt.ts";

test('Can save receipt', () => {
    let apple = new Apple();
    let account = new Account("receipt", "receipt");
    account.cart.addProduct(apple, 1);

    let cartPromise = Cart.saveCart(account.cart);
    cartPromise.then(() => {
        let accountPromise = Account.saveAccount(account); // do i need to do a .then()
        accountPromise.then(() => {
            let receipt = new Receipt(account.cart, account);
            Receipt.saveReceipt(receipt);

            let promise = Receipt.getReceiptForAccount(account);
            promise.then((allReceipts) => {
                for (let retrieved of allReceipts) {
                    expect(retrieved.id).equals(receipt.id);
                    expect(retrieved.total).equals(receipt.total);
                    expect(retrieved.timestamp.toString()).equals(receipt.timestamp.toString());
                    expect(retrieved.coupons.length).equals(receipt.coupons.length);
                    expect(retrieved.account.username).equals(receipt.account.username);
                    expect(retrieved.cart.id).equals(receipt.cart.id);
                }
            })
        })
    })
});

test('Can apply discount', () => {
    let cart = new Cart();
    let apple = new Apple();
    cart.addProduct(apple, 1);
    let account = new Account("applyDiscount", "password");
    let receipt = new Receipt(cart, account);
    let discount = new Discount(receipt, 25);

    receipt.applyDiscount(discount);

    expect(receipt.coupons).contains(discount);
});

test('Can apply bogo', () => {
    let cart = new Cart();
    let apple = new Apple();
    cart.addProduct(apple, 3);
    let account = new Account("applyBOGO", "password");
    let receipt = new Receipt(cart, account);
    let bogo = new BOGO(receipt, apple);

    receipt.applyBOGO(bogo);

    expect(receipt.coupons).contains(bogo);
});