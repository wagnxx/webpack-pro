const { merge } = require('webpack-merge');

const a = {
  x: {
    num: 1,
    value: 3,
    obj: {
      value: 4
    }
  },
  y: null
};

const options = {
  y: 3,
  x: {
    num: 20,
    value: undefined,
    obj: {
      num: 40
    }
  }
};

const mergeR = merge(a, options);
const assignR = Object.assign(a,options)

console.log('merge results : ', mergeR);
console.log('assign result : ',assignR)
