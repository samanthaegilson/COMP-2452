import type AccountController from "../controller/account-controller";

export default class LoginView {
    #controller: AccountController;
    #dialog: HTMLDialogElement;

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
            .addEventListener("click", () => this.#cancel());

        document.body.appendChild(this.#dialog);
        this.#dialog.show();
    }

    #login() {
        let username = this.#dialog.querySelector<HTMLInputElement>("#username")!.value;
        let password = this.#dialog.querySelector<HTMLInputElement>("#password")!.value;

        if (this.#controller.checkUser(username, password)) {
            this.#controller.hideLoginView();
            document.body.removeChild(this.#dialog);
        } else {
            // Displays an error if an account with that username already exists
            this.#dialog.querySelector("#error")!
                .textContent = "No account with this username and password "
                + " exist. Please try entering again.";
        }
    }

    /**
     * Removes the view
     */
    #cancel() {
        this.#controller.hideCreateAccountView();
        document.body.removeChild(this.#dialog);
    }
}