---
title: Domain model for 2452-pos
author: Samantha egilson (egilsons@myumanitoba.ca)
date: Winter 2026
---

# Domain model

```mermaid
classDiagram
  class Product {
    <<interface>>
    -~number id
    -string type
    -number price
    -number quantity
    -boolean volume

    +increaseQuantity(number amount) void
    +decreaseQuantity(number amount) boolean
  }

  class Apple {
    -~number id
    -string type
    -number price
    -number quantity
    -boolean volume

    +increaseQuantity(number amount) void
    +decreaseQuantity(number amount) boolean
  }
  Apple ..|> Product

  note for Apple "Class invariants:  <ul>
    <li> type.length() > 0
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Banana {
    -~number id
    -string type
    -number price
    -number quantity
    -boolean volume

    +increaseQuantity(number amount) void
    +decreaseQuantity(number amount) boolean
  }
  Banana ..|> Product

  note for Banana "Class invariants:  <ul>
    <li> type.length() > 0
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Milk {
    -~number id
    -string type
    -number price
    -number quantity
    -boolean volume

    +increaseQuantity(number amount) void
    +decreaseQuantity(number amount) boolean
  }
  Milk ..|> Product

  note for Milk "Class invariants:  <ul>
    <li> type.length() > 0
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Cart {
    -~number id
    -Array~Product~ products
    -Array~Array~number~~ model

    +addProduct(Product product) void
    +removeProduct(Product product) boolean
    +autoShop(number amount) void
  }
  Cart "1" o--o "*" Product
  Cart "1" o--o "1" Account

  note for Cart "Class invariants:  <ul>
    <li> id >= 0
    <li> products != null
    <li> loop: no products are null in products
    </ul>"

  class Receipt {
    -~number id
    -Cart cart
    -number total
    -Temporal.PlainDateTime timestamp
    -Account account
    -Array~Coupon~ coupons

    +applyBOGO(BOGO bogo) boolean
    +applyDiscount(Discount discount) void
  }
  Receipt "1" o--o "1" Cart
  Receipt "*" *--o "1" Account 
  Receipt "1" o--* "*" Coupon

  note for Receipt "Class invariants:  <ul>
    <li> id >= 0
    <li> cart.products.length > 0
    <li> total >= 0
    <li> timestamp != null
    <li> account != null
    <li> coupons != null
    <li> loop: no coupons are null in coupons
    </ul>"

  class Account {
    -~String username
    -String password
    -Array~Receipt~ receipts
    -Cart cart

    +addReceipt(Receipt receipt) void
  }

  note for Account "Class invariants:  <ul>
    <li> username.length() > 0
    <li> password.length() > 0
    <li> receipts != null
    <li> cart != null
    <li> loop: no receipts are null in receipts
    </ul>"

  class Coupon {
    <<interface>>
    -~number id
    -Receipt receipt
  }

  class BOGO {
    -~number id
    -Product product
    -Receipt receipt
  }
  BOGO ..|> Coupon
  BOGO --o "1" Product

  note for BOGO "Class invariants:  <ul>
    <li> product != null
    <li> receipt != null
    </ul>"

  class Discount {
    -~number id
    -number percentage
    -Receipt receipt
  }
  Discount ..|> Coupon

  note for Discount "Class invariants:  <ul>
    <li> percentage > 0 && percentage <= 100
    <li> receipt != null
    </ul>"
```

# Changes since phase 3 design
* I added a static variable model to the Cart class to represent the Markov model.
* I added an autoShop method to the Cart class.

# Changes since phase 2
* I added a type attribute to the Product classes for the inventory.

# Changes since phase 2 design
* I added ids to the Product classes and to the Coupon classes to identify them in the database.
* I added an amount parameter to the Product increaseQuantity and decreaseQuantity methods.
* I removed the emptyContents method from Cart since I did not use it anymore.
* I added a cart to Account to be able to persist.
* I removed the cart property from the Product classes.
* I added an addReceipt method to the Account class.
* I changed the addCoupon method in the Receipt class to an applyBOGO and a applyDiscount method.

# Changes since phase 1

* I added an Account class to represent cashiers.
* A added a Coupon interface and 2 children: Discount for coupons that apply to the entire purchase and BOGO for a buy-one-get-one coupon.
* I added a timestamp, an account and a list of coupons to the Receipt class as well as method to add a coupon.
* I added a Milk class, which is a third Product. Milk is measured in volumed instead of physical instances, so I added a boolean to the product classes to indicate if they are measured in volume or physical instances.
* I also added a Cart property to the Product classes and a Receipt property to the Cart class to have a bidirectional relationship.
* I added bidirectional relationships to the diagram and indicated the cardinality.
* I added an id property to the Cart and the Receipt class to have a way to reference them.