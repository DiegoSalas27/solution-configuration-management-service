/**
 * Creates a formatted timestamp of the form yyyy-mm-dd hh:mm:ss.mmmmmm.
 * @returns A timestamp such as 2023-01-13 11:30:11.050000
 */
export function getFormattedTimeStamp(): string {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')

  const milliseconds = String(now.getMilliseconds()).padStart(3, '0') + '000' // .050000 format

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`
}
