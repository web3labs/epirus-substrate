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
  const d = moment(date)
  const now = moment()

  if (now.isSame(d, "day")) {
    return dtf(sameDayFormatOpts).format(date)
  } else if (now.isSame(d, "year")) {
    return dtf(sameYearFormatOpts).format(date)
  } else {
    return dtf(distantFormatOpts).format(date)
  }
}

export function longDateTime (date: Date) {
  // XXX date needs to be re-instantiated
  return dtf(longFormat).format(new Date(date))
}

export function shortDateTime (date: Date) {
  // XXX date needs to be re-instantiated
  return dtf(shortFormat).format(new Date(date))
}
