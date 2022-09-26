import { TripleCheckOptions, tripleCheck } from "~/src"

export const checkAppNameOptions: TripleCheckOptions<string> = {
  precheck(name) {
    if (name.length < 3) {
      return "Name must be at least 3 characters long"
    }
  },
  check(name) {
    if (name.length === 0) return
    if (name.match(" ")) {
      return "Name may not contain spaces"
    }
    if (!name.match(/^[a-z]/)) {
      return "Name must start with a lowercase letter"
    }
    if (name.match(/[^a-z0-9-]/)) {
      return "Name may only contain letters, numbers and dashes"
    }
  },
  async asyncCheck(name) {
    const response = await new Promise<string | void>((resolve) => {
      if (name === "duplicate") {
        resolve("Name already exists")
      } else {
        resolve(undefined)
      }
    })
    return response
  },
}

describe("tripleCheck on server", () => {
  it("should pass all checks", async () => {
    const result = await tripleCheck("abracadabra", checkAppNameOptions)
    expect(result).toMatchObject({ status: "pass" })
  })

  it("should fail precheck", async () => {
    const result = await tripleCheck("a", checkAppNameOptions)
    expect(result).toMatchObject({
      status: "fail",
      message: expect.stringMatching(/must be at least/i),
    })
  })

  it("should fail regular check", async () => {
    const result = await tripleCheck("abc$", checkAppNameOptions)
    expect(result).toMatchObject({
      status: "fail",
      message: expect.stringMatching(/may only contain/i),
    })
  })

  it("should fail async check", async () => {
    const result = await tripleCheck("duplicate", checkAppNameOptions)
    expect(result).toMatchObject({
      status: "fail",
      message: expect.stringMatching(/name already exists/i),
    })
  })
})
