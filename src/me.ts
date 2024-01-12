
import {groupBy} from "lodash";

import data from "./me.json" assert {type: "json"};




const grade6 = data["6"]


const class6 = groupBy(grade6, x => x.Column6)
// 6: Column7 = van | Column8 = toan | Column9 = anh

const class6A = class6["6A"]
const length = class6A.length

console.log({length})


for (let i = 0; i <= 9; i++) {
  const res = class6A
    .filter(item => item.Column7 !== undefined)
    .filter(item => {
      const value = item.Column7 as number
      return value >= i && value < (i + 1)
    })
  console.log(`${i} <= x < ${i + 1}`, res.length)
}
