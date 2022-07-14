import moment from "moment"

export function shortDate (date: Date) {
  const d = moment(date)
  const now = moment()
  if (now.isSame(d, "day")) {
    return d.format("h:mm a")
  } else if (now.isSame(d, "year")) {
    return d.format("DD MMM")
  } else {
    return d.format("DD MMM YYYY")
  }
}

interface DateTimeFormat {
  dateStyle?: "full" | "long" | "medium" | "short" | undefined,
  timeStyle?: "full" | "long" | "medium" | "short" | undefined
}

const longFormat: DateTimeFormat = {
  dateStyle: "long", timeStyle: "long"
}
const shortFormat: DateTimeFormat = {
  dateStyle: "short", timeStyle: "short"
}

const dtf = (format: DateTimeFormat) => {
  return new Intl.DateTimeFormat("default", format)
}

export function longDateTime (date: Date) {
  // XXX date needs to be re-instantiated
  return dtf(longFormat).format(new Date(date))
}

export function shortDateTime (date: Date) {
  // XXX date needs to be re-instantiated
  return dtf(shortFormat).format(new Date(date))
}
