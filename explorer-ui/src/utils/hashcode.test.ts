import objectHash from "./hashcode"

test("object serialization is non-deterministic", () => {
  expect(objectHash({
    a: 1,
    b: true
  })).not.toEqual(objectHash({
    b: true,
    a: 1
  }))
})

test("hash should be the same for equal objects", () => {
  expect(objectHash({
    a: 1,
    b: true,
    c: "ABC"
  })).toEqual(objectHash({
    a: 1,
    b: true,
    c: "ABC"
  }))
})

test("hash should be different for a numeric change", () => {
  expect(objectHash({
    a: 1,
    b: true,
    c: "ABC"
  })).not.toEqual(objectHash({
    a: 2,
    b: true,
    c: "ABC"
  }))
})

test("functions should be ignored", () => {
  expect(objectHash({
    a: 1,
    b: () => { return "1" }
  })).toEqual(objectHash({
    a: 1,
    b: () => { return "2" }
  }))
})

test("emoji should work", () => {
  expect(objectHash({
    emo: "🦄🌈"
  })).toEqual(objectHash({
    emo: "🦄🌈"
  }))
})

test("empty object should produce the same hash", () => {
  expect(objectHash({})).toEqual(objectHash({}))
})
