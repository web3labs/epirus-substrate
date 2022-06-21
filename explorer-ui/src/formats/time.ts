import moment from "moment"

export function formatDate (date: Date) {
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
