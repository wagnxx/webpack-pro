// import { a } from './sync/index.js';

const sync = function () {
  console.log('sync:', a);

  fetch('/api/test')
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    });
};

export { sync };
