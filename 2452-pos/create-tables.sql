create table if not exists cart (
    id serial unique not null
);

create table if not exists account (
    username varchar(255) unique not null,
    password varchar(255) not null,
    cart integer not null,
    foreign key (cart) references cart(id)
);

create table if not exists product (
    id serial unique not null,
    class varchar(255) not null,
    price numeric(4, 2) not null,
    quantity integer not null,
    volume boolean not null,
    cart integer not null,
    foreign key (cart) references cart(id)
);

create table if not exists receipt (
    id serial unique not null,
    cart integer not null,
    total numeric(10, 2) not null,
    account varchar(255) not null,
    timestamp varchar(255) not null,
    foreign key (cart) references cart(id),
    foreign key (account) references account(username)
        on delete cascade
);

create table if not exists coupon (
    id serial unique not null,
    class varchar(255) not null,
    percent integer not null,
    product_type varchar(255) not null,
    receipt integer not null,
    foreign key (receipt) references receipt(id)
        on delete cascade
);