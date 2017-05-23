'use strict';

const Emittie = require('./');
const emittie = new Emittie();


emittie.on('something', (error, payload, meta) => {
  console.log('on something handler');
  console.log('Is Error', !!error);
  console.log('Payload', payload);
  console.log('Meta', meta);
  console.log('\n\n');
});

emittie.once('something')
.then(payload => {
  console.log('once something .then');
  console.log('Payload', payload);
  console.log('\n\n');
});


emittie.next('something')
.then(payload => {
  console.log('First next', payload);
  console.log('\n\n');
});


emittie.next('something')
.then(payload => {
  console.log('Second next', payload);
  console.log('\n\n');
});


emittie.trigger('something', null, {name: 'Tomas'});
emittie.trigger('something', null, {name: 'Matt'});
