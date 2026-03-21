import Account from "../model/account.ts";
import CreateAccountView from "../view/create-account-view.ts";
import LoginView from "../view/login-view.ts";
import SignInView from "../view/sign-in-view.ts";
import CartController from "./cart-controller.ts";

export default class AccountController {
    #signInView: SignInView;
    #loginView?: LoginView;
    #createAccountView?: CreateAccountView;
    #cartController?: CartController;

    constructor() {
        this.#signInView = new SignInView(this);
    }

    showLoginView(): void {
        if (this.#loginView == undefined) {
            this.#loginView = new LoginView(this);
        }
    }

    showCreateAccountView(): void {
        if (this.#createAccountView == undefined) {
            this.#createAccountView = new CreateAccountView(this);
        }
    }

    showCartView(account: Account): void {
        if (this.#cartController == undefined) {
            this.#cartController = new CartController(account);
        }
    }

    checkUser(username: string, password: string): boolean {
        let match = false;

        let accountsPromise = Account.getAllAccounts();
        accountsPromise.then((allAccounts) => {
            for (let account of allAccounts) {
                if (account.username == username && account.password == password) {
                    match = true;
                    this.showCartView(account);
                }
            }
        })

        return match;
    }

    createAccount(username: string, password: string): boolean {
        let created = true;

        let accountsPromise = Account.getAllAccounts();
        accountsPromise.then((allAccounts) => {
            for (const acc of allAccounts) {
                if (acc.username == username) {
                    created = false;
                }
            }
        })

        if (created) {
            let account = new Account(username, password);
            Account.saveAccount(account);
            this.showCartView(account);
        }

        return created;
    }

    hideCreateAccountView() {
        this.#createAccountView = undefined;
    }

    hideLoginView() {
        this.#loginView = undefined;
    }
}