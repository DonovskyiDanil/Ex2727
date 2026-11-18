const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const archiveLogs = require('../src/errorLogging/logArchiver');

test('archives reduced log records and clears the active file', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ex2727-log-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const logFile = path.join(directory, 'errors.json');
  fs.writeFileSync(logFile, JSON.stringify([
    { message: 'failure', code: 500, time: 123, stackTrace: { frames: ['private detail'] } },
  ]));

  const archiveFile = archiveLogs(logFile, 456);

  assert.equal(path.basename(archiveFile), 'logs_456.json');
  assert.deepEqual(JSON.parse(fs.readFileSync(archiveFile, 'utf8')), [
    { message: 'failure', code: 500, time: 123 },
  ]);
  assert.deepEqual(JSON.parse(fs.readFileSync(logFile, 'utf8')), []);
});

test('does not create an archive for an empty log', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ex2727-log-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const logFile = path.join(directory, 'errors.json');
  fs.writeFileSync(logFile, '[]');

  assert.equal(archiveLogs(logFile, 789), null);
  assert.deepEqual(fs.readdirSync(directory), ['errors.json']);
});

test('preserves the source file when its JSON is invalid', (t) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'ex2727-log-test-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const logFile = path.join(directory, 'errors.json');
  const invalidContent = '{invalid';
  fs.writeFileSync(logFile, invalidContent);

  assert.throws(() => archiveLogs(logFile, 987), SyntaxError);
  assert.equal(fs.readFileSync(logFile, 'utf8'), invalidContent);
});
