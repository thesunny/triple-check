import { add } from ".."

describe("test add", () => {
  it("should add", async () => {
    expect(add(1, 2)).toEqual(3)
  })
})
