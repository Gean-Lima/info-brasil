export const splitByComma = (data) => {
  return new Promise((resolve) => {
    let splitted = data.split(',')
    splitted = splitted.map((item) => item.trim())
    resolve(splitted)
  })
}