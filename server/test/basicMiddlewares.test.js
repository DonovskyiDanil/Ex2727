const test = require('node:test');
const assert = require('node:assert/strict');
const RightsError = require('../src/errors/RightsError');
const { onlyForCustomerOrCreator } = require('../src/middlewares/basicMiddlewares');

for (const role of ['customer', 'creator']) {
  test(`${role} can load contest filter data`, () => {
    let nextCalled = false;

    onlyForCustomerOrCreator(
      { tokenData: { role } },
      {},
      (error) => {
        assert.equal(error, undefined);
        nextCalled = true;
      },
    );

    assert.equal(nextCalled, true);
  });
}

test('moderator cannot load contest filter data', () => {
  let nextError;

  onlyForCustomerOrCreator(
    { tokenData: { role: 'moderator' } },
    {},
    (error) => {
      nextError = error;
    },
  );

  assert.ok(nextError instanceof RightsError);
  assert.equal(nextError.code, 403);
});
