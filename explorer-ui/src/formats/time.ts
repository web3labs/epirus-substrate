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

const dtf = new Intl.DateTimeFormat(undefined, {
  dateStyle: "full", timeStyle: "long"
})

export function fullDateTime (date: Date) {
  // XXX date needs to be re-instantiated
  return dtf.format(new Date(date))
}
