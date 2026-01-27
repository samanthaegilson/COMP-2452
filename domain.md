---
title: Domain model for 2452-pos
author: Samantha egilson (egilsons@myumanitoba.ca)
date: Winter 2026
---

# Domain model

```mermaid
classDiagram
  class Inventory {
    -Array~Products~ products

    +addProduct(Product product) void
    +removeProduct(Product product) void
  }
  Inventory --* Product

  note for Inventory "Class invariants:  <ul>
    <li> products != null
    <li> loop: no products are null in products
    </ul>"

  class Product {
    <<interface>>
    +addProduct() void
    +removeProduct() void
  }

  class Apple {
    -number price
    -number quantity

    +addProduct() void
    +removeProduct() void
  }
  Apple ..|> Product

  note for Apple "Class invariants:  <ul>
    <li> price >= 0
    <li> quantity >= 0
    </ul>"

  class Banana {
    -number price
    -number quantity

    +addProduct() void
    +removeProduct() void
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
  }
  Cart --o Product

  note for Cart "Class invariants:  <ul>
    <li> products != null
    <li> loop: no products are null in products
    </ul>"

  class Receipt {
    -Array~Product~ products
    -number total
  }
  Receipt --o Product

  note for Receipt "Class invariants:  <ul>
    <li> products != null
    <li> total >= 0
    <li> loop: no products are null in products
    </ul>"
```