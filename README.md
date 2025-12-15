# Hierarchy

**Hierarchy** is an application that implements the concepts defined in [list.md](https://github.com/raitucarp/list.md).

It provides a structured way to view, navigate, and work with deeply nested list-based data written in plain Markdown. The goal of Hierarchy is to turn Markdown lists into a first-class hierarchical interface rather than treating them as flat text.

This project focuses on readability, structural clarity, and preserving the original Markdown source without imposing a proprietary format.

---

## Features

* Native support for `.list.md` files
* Visual representation of deeply nested Markdown lists
* Vertical, hierarchy-oriented layout
* Plain Markdown remains the source of truth
* Designed to scale with large and complex list structures

## Screenshots

Hierarchy provides multiple visualization modes to explore the same underlying .list.md structure from different perspectives. Each view is designed to emphasize a particular way of thinking about hierarchy, whether linear, spatial, or structural, while keeping the Markdown source intact.

Currently supported and planned views include:

- Vertical View. A linear, depth-oriented representation optimized for reading and scrolling
- Horizontal View. A side-by-side expansion of hierarchy levels
- Card View. Modular, block-based representation for grouping and rearranging ideas
- Tree View. Explicit parent–child visualization of the list structure

### Vertical View

Plain Markdown list:

![List in plain markdown](docs/screenshoots/list-raw.png)

Rendered in Hierarchy:

![Opened \*.list.md in Hierarchy](docs/screenshoots/hierarchy-list.png)

---

## Status

Work in progress.
The core ideas and layout are functional, but features and stability are still evolving.

---

## Related Project

* **list.md** — Core idea and format specification
  [https://github.com/raitucarp/list.md](https://github.com/raitucarp/list.md)

---

## License

MIT License
Copyright (c) raitucarp
