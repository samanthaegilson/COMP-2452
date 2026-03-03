create table if not exists cart (
    id serial unique not null,
    receipt integer,
    foreign key (receipt) references receipt(id)
);

create table if not exists receipt (
    cart integer not null,
    total integer not null,
    account varchar(255) not null,
    timestamp varchar(255) not null,
    foreign key (cart) references cart(id)
    foreign key (account) references account(username)
        on delete cascade
);

create table if not exists account (
    username varchar(255) unique not null,
    password varchar(255) not null,
);

create table if not exists coupon (
    class varchar(255) not null,
    discount integer not null,
    product varchar(255) not null,
    receipt integer not null,
    foreign key (product) references product(class)
    foreign key (receipt) references receipt(id)
        on delete cascade
);

create table if not exists product (
    class varchar(255) not null,
    price integer not null,
    quantity integer not null,
    volume boolean not null,
    cart integer not null,
    foreign key (cart) references cart(id)
);