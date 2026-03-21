import { assert } from "../assertions";
import db from './connection.ts';
import Receipt from "./receipt";

export default class Account {
    #username: string;
    #password: string;
    #receipts: Array<Receipt>;

    constructor(username: string, password: string) {
        this.#username = username;
        this.#password = password;
        this.#receipts = new Array<Receipt>();
        this.#checkAccount();
    }

    #checkAccount() {
        assert(this.#username.length > 0, "Username should have at least one "
            + " character.");
        assert(this.#password.length > 0, "Username should have at least one "
            + " character.");
        assert(this.#receipts != null, "Receipts should never be null.");

        for (const receipt of this.#receipts) {
            assert(receipt != null, "Receipts in receipts should not be null.");
        }
    }

    static async getAllAccounts(): Promise<Array<Account>> {
        const allAccounts = new Array<Account>();

        let results = await db().query<
            {
                username: string
                password: string
            }
        >("select username, password from account");

        for (let row of results.rows) {
            let account = new Account(row.username, row.password)
            account.#receipts = await Receipt.getReceiptForAccount(account)
            allAccounts.push(account);
        }

        return allAccounts;
    }

    static async saveAccount(account: Account): Promise<Account> {
        await db().query<{ username: string }>("insert into account(username, password) values($1, $2) on conflict do nothing returning username",
            [account.username, account.password]);

        console.log("user: " + account.username);
        console.log("pass: " + account.password);

        account.receipts.forEach((receipt) => {
            // only receipts that haven't already been saved to the datase will
            // have an empty/null/undefined id value.
            if (!receipt.id) {
                Receipt.saveReceipt(receipt)
            }
        })

        return account;
    }


    get username(): string {
        return this.#username;
    }

    get password(): string {
        return this.#password;
    }

    get receipts(): Array<Receipt> {
        return this.#receipts;
    }

    addReceipt(receipt: Receipt): void {
        this.#receipts.push(receipt);
        Account.saveAccount(this);
        this.#checkAccount();
    }
}

export class InvalidUsernameException extends Error { }
export class InvalidPasswordException extends Error { }