import Account from "../model/account.ts";
import Cart from "../model/cart.ts";
import CreateAccountView from "../view/create-account-view.ts";
import LoginView from "../view/login-view.ts";
import SignInView from "../view/sign-in-view.ts";
import CartController from "./cart-controller.ts";

/**
 * A controller for an {@link Account}.
 */
export default class AccountController {
    #signInView: SignInView;
    #loginView?: LoginView;
    #createAccountView?: CreateAccountView;
    #cartController?: CartController;

    /**
     * Constructs an AccountController. Initializes the sign in view
     */
    constructor() {
        this.#signInView = new SignInView(this);
    }

    /**
     * Displays the view to login
     */
    showLoginView(): void {
        if (this.#loginView == undefined) {
            this.#loginView = new LoginView(this);
        }
    }

    /**
     * Displays the view to create an account
     */
    showCreateAccountView(): void {
        if (this.#createAccountView == undefined) {
            this.#createAccountView = new CreateAccountView(this);
        }
    }

    /**
     * Displays the cart view
     * 
     * @param account the account that is signed in
     */
    showCartView(account: Account): void {
        if (this.#cartController == undefined) {
            this.#cartController = new CartController(account);
        }
    }

    /**
     * Checks the credentials of a user
     * 
     * @param username the username to check
     * @param password the password to check
     */
    checkUser(username: string, password: string): void {
        let match = false;

        // Hashes the password
        let passwordPromise = Account.getDerivedBits(username, password);

        let accountsPromise = Account.getAllAccounts();
        accountsPromise.then((allAccounts) => {
            passwordPromise.then((passwordHash) => {
                // Converts the password to a string
                let passwordHex = passwordHash.toHex();

                // Checks every account for the same username and password
                for (const account of allAccounts) {
                    if (account.username == username
                        && account.password == passwordHex) {
                        match = true;
                        this.#loginView?.cancel();
                        this.showCartView(account);
                    }
                }

                // Displays an error if no matching account
                if (!match) {
                    this.#loginView?.noMatchingAccount();
                }
            })
        })
    }

    /**
     * Creates an account
     * 
     * @param username the username of the new account
     * @param password the password of the new account
     */
    createAccount(username: string, password: string): void {
        // Hashes the password
        let passwordPromise = Account.getDerivedBits(username, password);

        passwordPromise.then((passwordHash) => {
            // Converts the password to a string
            let passwordHex = passwordHash.toHex();

            let account = new Account(username, passwordHex);
            let cartPromise = Cart.saveCart(account.cart);
            cartPromise.then(() => {
                let promise = Account.saveAccount(account);

                promise.then((acc) => {
                    // Moves to the cart view
                    this.#createAccountView?.cancel();
                    this.showCartView(acc);
                }).catch(() => {
                    // Displays an error if there is a duplicate username
                    this.#createAccountView?.duplicateUsername();
                })
            })
        })
    }

    /**
     * Hides the create account view
     */
    hideCreateAccountView() {
        this.#createAccountView = undefined;
    }

    /**
     * Hides the login view
     */
    hideLoginView() {
        this.#loginView = undefined;
    }
}