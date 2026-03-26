import { assert } from "../assertions";
import Cart from "./cart.ts";
import db from './connection.ts';
import Receipt from "./receipt";

/**
 * An account. Can access a {@link Cart} and keeps a list of {@link Receipt}.
 */
export default class Account {
    #username: string;
    #password: string;
    #receipts: Array<Receipt>;
    #cart: Cart;

    /**
     * Constructs an account. Sets the username and password and initializes the
     * receipt and cart
     * 
     * @param username the username of the account
     * @param password the hashed password of the account
     */
    constructor(username: string, password: string) {
        this.#username = username;
        this.#password = password;
        this.#receipts = new Array<Receipt>();
        this.#cart = new Cart();
        this.#checkAccount();
    }

    /**
     * Invariant properties for an account
     */
    #checkAccount() {
        assert(this.#username.length > 0, "Username should have at least one "
            + " character.");
        assert(this.#password.length > 0, "Username should have at least one "
            + " character.");
        assert(this.#receipts != null, "Receipts should never be null.");
        assert(this.#cart != null, "Receipts should never be null.");

        for (const receipt of this.#receipts) {
            assert(receipt != null, "Receipts in receipts should not be null.");
        }
    }

    /**
     * Loads all the accounts from the database
     * 
     * @returns the array of accounts
     */
    static async getAllAccounts(): Promise<Array<Account>> {
        const allAccounts = new Array<Account>();

        let results = await db().query<
            {
                username: string
                password: string
                cart: number
            }
        >("select username, password, cart from account");

        // Gets the properties for each account
        for (let row of results.rows) {
            let account = new Account(row.username, row.password)
            account.#receipts = await Receipt.getReceiptForAccount(account)
            account.#cart = await Cart.getCartById(row.cart);
            allAccounts.push(account);
        }

        return allAccounts;
    }

    /**
     * Saves an account to the database
     * 
     * @param account the account to save
     * @returns the account
     */
    static async saveAccount(account: Account): Promise<Account> {
        await db().query<{ username: string }>
            ("insert into account(username, password, cart) values($1, $2, $3) returning username",
                [account.username, account.password, account.cart.id]);

        account.receipts.forEach((receipt) => {
            // Only receipts that haven't already been saved to the datase will
            // have an empty/null/undefined id value.
            if (!receipt.id) {
                Receipt.saveReceipt(receipt)
            }
        })

        return account;
    }

    /**
     * Updates the cart associated with the account
     * 
     * @param account the account with the new cart
     * @returns the account
     */
    static async updateCart(account: Account): Promise<Account> {
        let cartPromise = Cart.saveCart(account.cart);
        cartPromise.then(async (cart) => {
            await db().query<{ username: string }>
                ("update account set cart = $1 where username = $2",
                    [cart.id, account.username]);
        })

        return account;
    }

    /**
     * Get some key material to use as input to the deriveBits method.
     * The key material is a password supplied by the user.
     * 
     * @param password the password to hash
     * @returns the key material of the hash
     */
    static getKeyMaterial(password: string): Promise<CryptoKey> {
        const enc = new TextEncoder();
        return window.crypto.subtle.importKey(
            "raw",
            enc.encode(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"],
        );
    }

    /**
     * Derive some bits from a password supplied by the user.
     * 
     * @param username the username of the account
     * @param password the password to hash
     * @returns the hashed password
     */
    static async getDerivedBits(username: string, password: string) {
        const keyMaterial = await this.getKeyMaterial(password);

        const enc = new TextEncoder();
        let salt = enc.encode(username);

        const derivedBits = await window.crypto.subtle.deriveBits(
            {
                name: "PBKDF2",
                salt,
                iterations: 100000,
                hash: "SHA-256",
            },
            keyMaterial,
            256,
        );

        const buffer = new Uint8Array(derivedBits, 0, 5);

        return buffer;
    }

    // Getters
    get username(): string {
        return this.#username;
    }

    get password(): string {
        return this.#password;
    }

    get receipts(): Array<Receipt> {
        return this.#receipts;
    }

    get cart(): Cart {
        return this.#cart;
    }

    // Setter
    set cart(cart: Cart) {
        this.#cart = cart;
    }

    /**
     * Adds a receipt to the account
     * 
     * @param receipt the receipt to add
     */
    addReceipt(receipt: Receipt): void {
        this.#receipts.push(receipt);
        this.#checkAccount();
    }
}