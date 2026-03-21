import type AccountController from "../controller/account-controller";

export default class SignInView {
    #controller: AccountController;

    constructor(controller: AccountController) {
        this.#controller = controller;

        document.querySelector("#app")!.innerHTML =
            `<div id='sign-in'>
                <button id="login">Login</button>
                <button id="create-account">Create Account</button>
                <span id="error"></span><br />
            </div>`

        document.querySelector("#login")!
            .addEventListener("click", () => this.#controller.showLoginView())

        document.querySelector("#create-account")!
            .addEventListener("click", () => this.#controller.showCreateAccountView())
    }
}