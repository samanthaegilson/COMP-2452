---
title: Domain model for 2452-pos
author: Samantha egilson (egilsons@myumanitoba.ca)
date: Winter 2026
---

# Changes

* I added increaseQuantity and decreaseQuantity methods to the products
* I added price and quantity variables to the Product interface
* I changed an invariant property for the Receipt class from cart != null to
  cart.products.length > 0
* I added an emptyContents method to the Cart class

# Domain model

```mermaid
classDiagram
  class Product {
    <<interface>>
    -number price
    -number quantity

    +increaseQuantity() void
    +decreaseQuantity() boolean
  }

  class Apple {
    -number price
    -number quantity

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

    +increaseQuantity() void
    +decreaseQuantity() boolean
  }
  Banana ..|> Product

  note for Banana "Class invariants:  <ul>
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Cart {
    -Array~Product~ products

    +addProduct(Product product) void
    +removeProduct(Product product) boolean
    +emptyContents() void
  }
  Cart --o Product

  note for Cart "Class invariants:  <ul>
    <li> products != null
    <li> loop: no products are null in products
    </ul>"

  class Receipt {
    -Cart cart
    -number total
    -Temporal timestamp
  }
  Receipt --o Cart

  note for Receipt "Class invariants:  <ul>
    <li> cart.products.length > 0
    <li> total >= 0
    </ul>"

  class Account {
    -number employeeNumber
    -String name
    -String password
    -Array~Receipt~ receipts
  }

  class Coupon {
    <<interface>>
    -number discount
  }

  class BOGO {

  }
  BOGO ..|> Coupon
```