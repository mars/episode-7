const test = require('ava');
const Episode7 = require('.');

test('Run a generator yielding promises from side-effects', t => {
  t.plan(4);

  function* fortuneTeller(question, subject) {
    let fortune = [];
    fortune = fortune.concat( yield Episode7.call(customerAsks, question, subject) );
    fortune = fortune.concat( yield Episode7.call(readerSays, '🔮') );
    fortune = fortune.concat( yield Episode7.call(crystalProjects, '💰') );
    return Promise.resolve(fortune);
  }

  function customerAsks(...v) {
    t.deepEqual(['📡', '👽'], v)
    return Promise.resolve(v);
  }

  function readerSays(v) {
    t.is('🔮', v)
    return Promise.resolve(v);
  }

  function crystalProjects(v) {
    t.is('💰', v)
    return Promise.resolve(v);
  }

  return Episode7.run(fortuneTeller, '📡', '👽')
    .then( fortune => t.deepEqual(['📡', '👽', '🔮', '💰'], fortune) );
});

test('Run a generator yielding plain return values from side-effects', t => {
  t.plan(4);

  function* fortuneTeller(question, subject) {
    let fortune = [];
    fortune = fortune.concat( yield Episode7.call(customerAsks, question, subject) );
    fortune = fortune.concat( yield Episode7.call(readerSays, '🔮') );
    fortune = fortune.concat( yield Episode7.call(crystalProjects, '💰') );
    return fortune;
  }

  function customerAsks(...v) {
    t.deepEqual(['📡', '👽'], v)
    return v;
  }

  function readerSays(v) {
    t.is('🔮', v)
    return v;
  }

  function crystalProjects(v) {
    t.is('💰', v)
    return v;
  }

  return Episode7.run(fortuneTeller, '📡', '👽')
    .then( fortune => t.deepEqual(['📡', '👽', '🔮', '💰'], fortune) );
});

test('Run a generator yielding to nested generators for side-effects', t => {
  t.plan(3);

  function* fortuneTeller() {
    let fortune = [];
    fortune = fortune.concat( yield Episode7.call(readerSays, '🔮') );
    fortune = fortune.concat( yield Episode7.call(crystalProjects, '💰') );
    return fortune;
  }

  function* readerSays(v) {
    t.is('🔮', v)
    return yield Episode7.call(valuePromise, v);
  }

  function* crystalProjects(v) {
    t.is('💰', v)
    return yield Episode7.call(valuePromise, v);
  }

  function valuePromise(v) {
    return Promise.resolve(v)
  }

  return Episode7.run(fortuneTeller)
    .then( fortune => t.deepEqual(['🔮', '💰'], fortune) );
});

test('Calls side-effect functions with `this` arg', t => {
  t.plan(1);

  function* revealInnerSecret() {
    let contents = { secret: '💎' }
    return yield Episode7.call([contents, openUp]);
  }

  function openUp() {
    let secret = this.secret;
    return secret;
  }

  return Episode7.run(revealInnerSecret)
    .then( secret => t.is('💎', secret) );
});

test('Clearly present side-effect errors', t => {
  t.plan(1);

  const fortunesFoolError = new Error('🚑');

  function* fortuneTeller() {
    let fortune = [];
    fortune.push( yield Episode7.call(readerSays, '🔮') );
    fortune.push( yield Episode7.call(crystalProjects, '💰') );
  }

  function readerSays(v) {
    return Promise.resolve(v);
  }

  function crystalProjects(v) {
    throw fortunesFoolError;
    return Promise.resolve(v);
  }

  return Episode7.run(fortuneTeller)
    .catch( error => t.is(error, fortunesFoolError) );
});

test('Clearly describe missing `Episode7.call` ', t => {
  t.plan(1);

  function* naughtyGenerator() {
    yield noBueno('🚷');
  }

  function noBueno(v) {
    return Promise.resolve(v);
  }

  return Episode7.run(naughtyGenerator)
    .catch( error => t.regex(error.message, /requires using `Episode7\.call`/) );
});

test('Easily test yielded calls, mock their return values', t => {
  t.plan(4);

  function* emojiPoem(v1) {
    let v2 = yield Episode7.call(iPromise, v1)
    let v3 = yield Episode7.call(iPromise, v2)
    yield Episode7.call(iPromise, v3)
  }

  function iPromise(v) {
    t.fail('the tapped function should not run');
    resolve(v);
  }

  // Inital generator args may be passed in from constructor
  let reading = emojiPoem('🔋');
  let it;
  // First `next` does not provide a value, because nothing has yet been yielded
  it = reading.next();
  t.deepEqual({ fn: iPromise, args: ['🔋'] }, it.value);

  // Mock return value from previous yield by passing arg to `next`
  it = reading.next('💡');
  t.deepEqual({ fn: iPromise, args: ['💡'] }, it.value);

  it = reading.next('🎛');
  t.deepEqual({ fn: iPromise, args: ['🎛'] }, it.value);

  it = reading.next();
  t.true(it.done);
});
