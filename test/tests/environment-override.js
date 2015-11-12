/**
 * @fileOverview
 *   Tests for environment-override
 */


/* LOAD MODULES */

var expect = require('chai').expect;
var override = require(__dirname + '/../..');
var sinon = require('sinon');

/* DEFINE THE TESTS */

var self = this;

describe('environment-override', function describeMain() {
  before(function before(done) {
    self.consoleInfoStub = sinon.stub(console, 'info');
    done();
  });
  afterEach(function afterEach(done) {
    self.consoleInfoStub.reset();
    done();
  });
  after(function after(done) {
    console.info.restore();
    done();
  });

  var showValues = [true, false];
  for (var key in showValues) {
    (function rememberScope() {
      var show = showValues[key];
      describe('without env variables', function describe() {

        it('does not override', function overrideTest(done) {
          var manifest = {
            field1: 'value1',
            field2: 'value2'
          };
          var originalManifest = JSON.parse(JSON.stringify(manifest));
          override(manifest, 'PREFIX_', show);
          expect(manifest).to.deep.equal(originalManifest);
          var output = self.consoleInfoStub.args;
          var expectedOutput = (show !== true) ? [] : [
            ['             PREFIX_FIELD1'],
            ['             PREFIX_FIELD2']
          ];
          expect(output).to.be.deep.equal(expectedOutput);
          done();
        });
      });

      describe('with env variable set to simple value', function describe() {

        before(function before(done) {
          process.env.PREFIX_FIELD1 = 'value';
          done();
        });

        after(function after(done) {
          delete process.env.PREFIX_FIELD1;
          done();
        });

        it('overrides', function overrideTest(done) {
          var manifest = {
            field1: 'value1',
            field2: 'value2'
          };
          var originalManifest = JSON.parse(JSON.stringify(manifest));
          override(manifest, 'PREFIX_', show);
          var expectedManifest = originalManifest;
          expectedManifest.field1 = process.env.PREFIX_FIELD1;
          expect(manifest).to.deep.equal(originalManifest);
          var output = self.consoleInfoStub.args;
          var expectedOutput = (show !== true) ? [] : [
            ['  overridden PREFIX_FIELD1'],
            ['             PREFIX_FIELD2']
          ];
          expect(output).to.be.deep.equal(expectedOutput);
          done();
        });

        it('overrides deeper manifest', function overrideTest(done) {
          var manifest = {
            field1: 'value1',
            field2: {
              field3: 'value3',
              field4: 'value4'
            }
          };
          var originalManifest = JSON.parse(JSON.stringify(manifest));
          override(manifest, 'PREFIX_', show);
          var expectedManifest = originalManifest;
          expectedManifest.field1 = process.env.PREFIX_FIELD1;
          expect(manifest).to.deep.equal(originalManifest);
          var output = self.consoleInfoStub.args;
          var expectedOutput = (show !== true) ? [] : [
            ['  overridden PREFIX_FIELD1'],
            ['             PREFIX_FIELD2'],
            ['             PREFIX_FIELD2_FIELD3'],
            ['             PREFIX_FIELD2_FIELD4']
          ];
          expect(output).to.be.deep.equal(expectedOutput);
          done();
        });
      });

      describe('with env variable set to object', function describe() {

        before(function before(done) {
          process.env.PREFIX_FIELD2 = '{"field4": "value4", "field5": "value5"}';
          done();
        });

        after(function after(done) {
          delete process.env.PREFIX_FIELD2;
          done();
        });

        it('overrides deeper manifest', function overrideTest(done) {
          var manifest = {
            field1: 'value1',
            field2: {
              field3: 'value3',
              field4: 'value4'
            }
          };
          var originalManifest = JSON.parse(JSON.stringify(manifest));
          override(manifest, 'PREFIX_', show);
          var expectedManifest = originalManifest;
          expectedManifest.field2 = JSON.parse(process.env.PREFIX_FIELD2);
          expect(manifest).to.deep.equal(originalManifest);
          var output = self.consoleInfoStub.args;
          var expectedOutput = (show !== true) ? [] : [
            ['             PREFIX_FIELD1'],
            ['  overridden PREFIX_FIELD2']
          ];
          expect(output).to.be.deep.equal(expectedOutput);
          done();
        });
      });

      describe('with env variable remove field', function describe() {

        before(function before(done) {
          process.env.PREFIX_FIELD1 = 'OVERRIDE_REMOVE_DATA';
          done();
        });

        after(function after(done) {
          delete process.env.PREFIX_FIELD1;
          done();
        });

        it('removes', function overrideTest(done) {
          var manifest = {
            field1: 'value1',
            field2: 'value2'
          };
          var originalManifest = JSON.parse(JSON.stringify(manifest));
          override(manifest, 'PREFIX_', show);
          var expectedManifest = originalManifest;
          delete expectedManifest.field1;
          expect(manifest).to.deep.equal(originalManifest);
          var output = self.consoleInfoStub.args;
          var expectedOutput = (show !== true) ? [] : [
            ['     removed PREFIX_FIELD1'],
            ['             PREFIX_FIELD2']
          ];
          expect(output).to.be.deep.equal(expectedOutput);
          done();
        });
      });
    })();
  }
});
