const test = require('ava');
const Episode7 = require('.');

test('Run a generator yielding promises of side-effects', t => {
  t.plan(4);

  function* fortuneTeller() {
    let fortune = [];
    fortune.push( yield Episode7.call(readerSays, '🔮') );
    fortune.push( yield Episode7.call(crystalProjects, '💰') );
    t.deepEqual(['🔮', '💰'], fortune);
    return Promise.resolve(fortune);
  }

  function readerSays(v) {
    t.is('🔮', v)
    return Promise.resolve(v);
  }

  function crystalProjects(v) {
    t.is('💰', v)
    return Promise.resolve(v);
  }

  return Episode7.run(fortuneTeller)
    .then( fortune => t.deepEqual(['🔮', '💰'], fortune) );
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
  let doer = emojiPoem('🔋');
  let it;
  // First `next` does not provide a value, because nothing has yet been yielded
  it = doer.next();
  t.deepEqual({ fn: iPromise, args: ['🔋'] }, it.value);

  // Mock return value from previous yield by passing arg to `next`
  it = doer.next('💡');
  t.deepEqual({ fn: iPromise, args: ['💡'] }, it.value);

  it = doer.next('🎛');
  t.deepEqual({ fn: iPromise, args: ['🎛'] }, it.value);

  it = doer.next();
  t.true(it.done);
});
