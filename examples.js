'use strict';

const Emittie = require('./');
const emittie = new Emittie();


emittie.on('something', (payload, meta) => {
  console.log('on something handler');
  console.log('Payload', payload);
  console.log('Meta', meta);
});

emittie.once('something')
.then(payload => {
  console.log('once something .then');
  console.log('Payload', payload);
});


emittie.trigger('something', {name: 'Tomas'});
emittie.trigger('something', {name: 'Matt'});
