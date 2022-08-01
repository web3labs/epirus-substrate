/* eslint-disable no-tabs */

import { classNames, stripNonPrintable } from "./strings"

test("strip non-printable empty string", () => {
  expect(stripNonPrintable("")).toBe("")
})

test("strip non-printable string", () => {
  expect(stripNonPrintable("See what's hidden in your string…	or be​hind﻿"))
    .toBe("See what's hidden in your string…or behind")
})

test("empty concat", () => {
  expect(classNames()).toBe("")
})

test("empty string concat", () => {
  expect(classNames("")).toBe("")
})

test("single string concat", () => {
  expect(classNames("a")).toBe("a")
})

test("two strings concat", () => {
  expect(classNames("a", "b")).toBe("a b")
})

test("four strings concat", () => {
  expect(classNames("a", "b", "c", "d")).toBe("a b c d")
})

test("free strings concat", () => {
  expect(classNames("ab c", "", "b")).toBe("ab c b")
})
