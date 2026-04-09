import seedrandom from 'seedrandom';
import ddl from '../create-tables.sql?raw';
import modelData from '../training/model.csv?raw';
import AccountController from "./controller/account-controller";
import Cart from './model/cart.ts';
import db from './model/connection.ts';

var rng = seedrandom("hi");
// these values should be the same sequence every time we refresh the page.
console.log(rng());
console.log(rng());
console.log(rng());
console.log(rng());
console.log(rng());

db().exec(ddl);
// import csv of trained model to cart
const lines = modelData.split("\n");
let model: number[][] = [];
for (let i = 0; i < lines.length; i++) {
    let data = lines[i].split(",");
    model[i] = [];
    for (let j = 0; j < data.length; j++) {
        model[i][j] = Number(data[j]);
    }
}
// pass to cart static method
Cart.model = model;

new AccountController();