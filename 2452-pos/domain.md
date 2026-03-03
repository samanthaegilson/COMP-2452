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
    -number price
    -number quantity
    -Cart cart

    +increaseQuantity() void
    +decreaseQuantity() boolean
  }

  class Apple {
    -number price
    -number quantity
    -boolean volume
    -Cart cart

    +increaseQuantity() void
    +decreaseQuantity() boolean
  }
  Apple ..|> Product

  note for Apple "Class invariants:  <ul>
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Banana {
    -number price
    -number quantity
    -boolean volume
    -Cart cart

    +increaseQuantity() void
    +decreaseQuantity() boolean
  }
  Banana ..|> Product

  note for Banana "Class invariants:  <ul>
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Milk {
    -number price
    -number quantity
    -boolean volume
    -Cart cart

    +increaseQuantity() void
    +decreaseQuantity() boolean
  }
  Milk ..|> Product

  note for Milk "Class invariants:  <ul>
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Cart {
    -~number id
    -Array~Product~ products
    -Array~Coupon~ coupons
    -?Receipt receipt

    +addProduct(Product product) void
    +removeProduct(Product product) boolean
    +emptyContents() void
    +addCoupon(Coupon coupon) void
  }
  Cart "1" o--o "*" Product
  Cart "1" o--* "*" Coupon

  note for Cart "Class invariants:  <ul>
    <li> products != null
    <li> loop: no products are null in products
    <li> coupons != null
    <li> loop: no coupons are null in coupons
    </ul>"

  class Receipt {
    -~number id
    -Cart cart
    -number total
    -Temporal timestamp
    -Account account
  }
  Receipt "1" o--o "1" Cart
  Receipt "*" *--o "1" Account 

  note for Receipt "Class invariants:  <ul>
    <li> cart.products.length > 0
    <li> total >= 0
    </ul>"

  class Account {
    -~String username
    -String password
    -Array~Receipt~ receipts
  }

  note for Account "Class invariants:  <ul>
    <li> username.length() > 0
    <li> password.length() > 0
    <li> receipts != null
    <li> loop: no receipts are null in receipts
    </ul>"

  class Coupon {
    <<interface>>
    -Cart cart
  }

  class BOGO {
    -Product product
    -Cart cart
  }
  BOGO ..|> Coupon
  BOGO --o "1" Product

  note for BOGO "Class invariants:  <ul>
    <li> product != null
    <li> cart != null
    </ul>"

  class Discount {
    -number percentage
    -Cart cart
  }
  Discount ..|> Coupon

  note for Discount "Class invariants:  <ul>
    <li> percentage > 0
    <li> cart != null
    </ul>"
```

# Changes since phase 1

* I added an Account class to represent cashiers.
* A added a Coupon interface and 2 children: Discount for coupons that apply to the entire purchase and BOGO for a buy-one-get-one coupon.
* I added a timestamp and an account to the Receipt class.
* I added a coupon array to the cart class and a method to add a coupon as well.
* I added a Milk class, which is a third Product. Milk is measured in volumed instead of physical instances, so I added a boolean to the product classes to indicate if they are measured in volume or physical instances.
* I also added a Cart property to the Product classes and a Receipt property to the Cart class to have a bidirectional relationship.
* I added bidirectional relationships to the diagram and indicated the cardinality.
* I added an id to the Cart and the Receipt class to have a way to reference them.