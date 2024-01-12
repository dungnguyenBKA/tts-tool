import _ from "lodash";

import data from "./me.json" assert {type: "json"};

console.log();

Object.keys(data).filter(item => {
  return item !== "undefined"
}).forEach(key => {
  // @ts-ignore
  const grade = data[key]
  const classes = _.groupBy(grade, x => x.Column6)
  Object.keys(classes)
    .filter(item => {
      return item !== "undefined"
    })
    .forEach(item => {
      console.log(`\n---\nLớp ${item}`)
      genData(classes[item])
    })
})

function percent(a: number, b: number) {
  return `${((100 * a)/b).toFixed(2)}%`
}

function getAvg(iClass: any[], key: string) {
  let total = 0

  iClass.forEach((stu) => {
    if (!isNaN(stu[key])) {
      total += Number(stu[key])
    }
  })

  return (total/(iClass.length)).toFixed(2)
}

function genData(iClass: any[]) {
  const length = iClass.length
  console.log("Sĩ số lớp", length)

  // for Văn:

  console.log("Văn:")

  console.log("TB:", getAvg(iClass, "Column7"))

  const fiveToTen = iClass
    .filter(item => item.Column7 !== undefined)
    .filter(item => {
      const value = item.Column7 as number
      return value >= 5 && value <= 10
    })
  console.log(`Khoảng (5 <= x <= 10):`, fiveToTen.length, percent(fiveToTen.length, length))

  for (let i = 0; i <= 9; i++) {
    const res = iClass
      .filter(item => item.Column7 !== undefined)
      .filter(item => {
        const value = item.Column7 as number
        if (i == 9) {
          return value >= 9 && value <= 10
        }
        return value >= i && value < (i + 1)
      })
    console.log(`${i} <= x < ${i + 1}`, res.length)
  }

  // for Anh:
  console.log("Anh:")
  console.log("TB:", getAvg(iClass, "Column9"))
  const fiveToTen2 = iClass
    .filter(item => item.Column9 !== undefined)
    .filter(item => {
      const value = item.Column9 as number
      return value >= 5 && value <= 10
    })
  console.log(`5 <= x <= 10`, fiveToTen2.length, percent(fiveToTen2.length, length))

  for (let i = 0; i <= 9; i++) {
    const res = iClass
      .filter(item => item.Column9 !== undefined)
      .filter(item => {
        const value = item.Column9 as number
        return value >= i && value < (i + 1)
      })
    console.log(`${i} <= x < ${i + 1}`, res.length)
  }
}
