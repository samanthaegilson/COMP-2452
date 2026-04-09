---
title: 2452-pos
author: Samantha Egilson (8038373) (egilsons@umanitoba.ca)
date: Winter 2026
---

# Overview

2452-pos is an implementation of of a "Point of Sale" system for COMP 2452 in
Winter 2026. This system currently has two products that can be added or removed
from a cart. The POS system can then check out to make a receipt.

# Running

This project is a Node.js project using Vite. You can run it on the command
line using `npx`:

```bash
npx vite
```

And then open your web browser and go to the address printed out by Vite.

You can also run the file to train the Markov model on the command line using
`npx`:

```bash
npx tsx training/training.ts
```

The output will be in a file named `model.csv` which is also located in the 
folder called `training`. `model.csv` contains an adjacency matrix with raw 
probabilities between [0,1].

# Tests
You can run the tests with Vitest:

```bash
npx vitest
```

# Domain model and flow diagrams

* You can find my domain model in `domain.md`.
* You can find my flow diagrams in `flows.md`.

# UI Assessment

The screenshots for `ui.assessment.md` can be found in the folder `screenshots`
at the root of the project.