console.log('spa index');
import {sync} from './sync/index'

import(/* webpackChunkName:"async-test" */ './async/index').then((_) => {
  _.default.init();
});

 