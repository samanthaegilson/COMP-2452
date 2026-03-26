import { expect, test } from 'vitest';
import Account from "../src/model/account.ts";
import Cart from '../src/model/cart.ts';
import Milk from '../src/model/milk.ts';
import Receipt from "../src/model/receipt.ts";

test('Can hash password', () => {
    let username = "username";
    let password = "password";

    let passwordPromise = Account.getDerivedBits(username, password);
    passwordPromise.then((passwordHash) => {
        let passwordHex = passwordHash.toHex();
        expect(passwordHex).not.equals(password);
    })
});

test('Can save account', () => {
    let account = new Account("save", "account");
    let cartPromise = Cart.saveCart(account.cart);
    cartPromise.then(() => {
        Account.saveAccount(account);

        let promise = Account.getAllAccounts();
        promise.then((allAccounts) => {
            for (let retrieved of allAccounts) {
                expect(retrieved.username).equals(account.username);
                expect(retrieved.password).equals(account.password);
                expect(retrieved.cart.id).equals(account.cart.id);
            }
        })
    })
});

test('Can add receipt', () => {
    let cart = new Cart();
    let milk = new Milk();
    cart.addProduct(milk, 1);
    let account = new Account("add", "receipt");
    let receipt = new Receipt(cart, account);

    account.addReceipt(receipt);

    expect(account.receipts).contains(receipt);
});