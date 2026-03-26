import type AccountController from "../controller/account-controller";

/**
 * A view to sign in to an existing {@link Account}.
 */
export default class LoginView {
    #controller: AccountController;
    #dialog: HTMLDialogElement;

    /**
     * Constructor for LoginView. Displays the window
     * 
     * @param controller the controller of the view
     */
    constructor(controller: AccountController) {
        this.#controller = controller;

        this.#dialog = document.createElement("dialog");
        this.#dialog.id = "login-dialog";
        this.#dialog.innerHTML = `
            <span id="error"></span><br />
            <label for="username">Enter username</label>
            <input type="text" id="username"/>
            <label for="password">Enter password</label>
            <input type="text" id="password"/>
            <button id="login">Login</button>
            <button id="cancel">Cancel</button>`

        this.#dialog.querySelector("#login")!
            .addEventListener("click", () => this.#login());

        this.#dialog.querySelector("#cancel")!
            .addEventListener("click", () => this.cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    /**
     * Logs into an account
     */
    #login() {
        let username = this.#dialog.querySelector<HTMLInputElement>("#username")!.value;
        let password = this.#dialog.querySelector<HTMLInputElement>("#password")!.value;

        this.#controller.checkUser(username, password);
    }

    /**
     * Displays an error if no account with that username and password exists
     */
    noMatchingAccount() {
        this.#dialog.querySelector("#error")!
            .textContent = "No account with this username and password "
            + " exist. Please try entering again.";
    }

    /**
     * Removes the view
     */
    cancel() {
        this.#controller.hideLoginView();
        document.body.removeChild(this.#dialog);
    }
}