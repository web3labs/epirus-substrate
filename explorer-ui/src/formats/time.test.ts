import { longDateTime, shortDate, shortDateTime } from "./time"

const timeIntlMock = function
(zone: string = "Europe/London",
  locale: string = "en-GB"
) {
  const DateTimeFormat = Intl.DateTimeFormat
  jest.spyOn(global.Intl, "DateTimeFormat")
    .mockImplementation((_, options) => new DateTimeFormat(
      locale, { ...options, timeZone: zone }
    ))
  jest.spyOn(Date, "now")
    .mockImplementation(() => new Date("2022-05-22T00:00:00.000Z").valueOf())
}

afterEach(() => {
  jest.restoreAllMocks()
})

test("short date time EN (GB)", () => {
  timeIntlMock()

  expect(shortDateTime(new Date("2022-01-22T22:22:22.222Z")))
    .toEqual("22/01/2022, 22:22")
})

test("short date with same day distance EN (GB)", () => {
  timeIntlMock()

  expect(shortDate(new Date("2022-05-22T01:22:22.222Z")))
    .toEqual("02:22")
})

test("short date with months distance EN (GB)", () => {
  timeIntlMock()

  expect(shortDate(new Date("2022-01-22T22:22:22.222Z")))
    .toEqual("22 Jan")
})

test("short date with years distance EN (GB)", () => {
  timeIntlMock()

  expect(shortDate(new Date("2018-01-22T22:22:22.222Z")))
    .toEqual("22 Jan 2018")
})

test("long date time EN (GB)", () => {
  timeIntlMock()

  expect(longDateTime(new Date("2022-01-22T22:22:22.222Z")))
    .toEqual("22 January 2022 at 22:22:22 GMT")
})

test("short date time ZH (TW)", () => {
  timeIntlMock("Asia/Shanghai", "zh-TW")

  expect(shortDateTime(new Date("2022-01-22T22:22:22.222Z")))
    .toEqual("2022/1/23 清晨6:22")
})

test("short date ZH (TW)", () => {
  timeIntlMock("Asia/Shanghai", "zh-TW")

  expect(shortDate(new Date("2022-01-22T22:22:22.222Z")))
    .toEqual("1月23日")
})

test("long date time ZH (TW)", () => {
  timeIntlMock("Asia/Shanghai", "zh-TW")

  expect(longDateTime(new Date("2022-01-22T22:22:22.222Z")))
    .toEqual("2022年1月23日 清晨6:22:22 [GMT+8]")
})
