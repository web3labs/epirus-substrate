import moment from "moment"

const sameYearFormatOpts : Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
const sameDayFormatOpts : Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric" }
const distantFormatOpts : Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric" }

const longFormat: Intl.DateTimeFormatOptions = {
  dateStyle: "long", timeStyle: "long"
}
const shortFormat: Intl.DateTimeFormatOptions = {
  dateStyle: "short", timeStyle: "short"
}

const dtf = (format: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat("default", format)
}

export function shortDate (date: Date) {
  // FIX: weird issue with
  // "Uncaught RangeError: date value is not finite in DateTimeFormat.format()"
  const nDate = new Date(date)
  const d = moment(nDate)
  const now = moment()

  if (now.isSame(d, "day")) {
    return dtf(sameDayFormatOpts).format(nDate)
  } else if (now.isSame(d, "year")) {
    return dtf(sameYearFormatOpts).format(nDate)
  } else {
    return dtf(distantFormatOpts).format(nDate)
  }
}

export function longDateTime (date: Date) {
  // FIX: see shortDate comment
  return dtf(longFormat).format(new Date(date))
}

export function shortDateTime (date: Date) {
  // FIX: see shortDate comment
  return dtf(shortFormat).format(new Date(date))
}
