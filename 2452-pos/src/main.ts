import ddl from '../create-tables.sql?raw';
import AccountController from "./controller/account-controller";
import db from './model/connection.ts';

db().exec(ddl);

new AccountController();