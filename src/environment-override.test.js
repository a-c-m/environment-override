/**
 * @fileOverview
 *   Tests for environment-override
 */
/* global describe, before, afterEach, after, it */
import 'babel-polyfill';
import { expect } from 'chai';
import sinon from 'sinon';
import override from './environment-override';

const clone = obj => JSON.parse(JSON.stringify(obj));

const stubs = {};

describe('environment-override', () => {
  before((done) => {
    stubs.consoleInfo = sinon.stub(console, 'info');

    done();
  });

  afterEach((done) => {
    stubs.consoleInfo.reset();

    done();
  });

  after((done) => {
    console.info.restore();

    done();
  });

  const showValues = [true, false];
  showValues.forEach((show) => {
    describe(`without env variables and show:${show}`, () => {
      it('does not override', (done) => {
        const manifest = {
          field1: 'value1',
          field2: 'value2',
        };

        const originalManifest = clone(manifest);
        override(manifest, 'PREFIX_', show);

        expect(manifest).to.deep.equal(originalManifest);

        const output = stubs.consoleInfo.args;
        const expectedOutput = (show !== true) ? [] : [
          ['             PREFIX_FIELD1'],
          ['             PREFIX_FIELD2'],
        ];
        expect(output).to.be.deep.equal(expectedOutput);

        done();
      });
    });

    describe(`with env variable set to simple value and show:${show}`, () => {
      before((done) => {
        process.env.PREFIX_FIELD1 = 'value';

        done();
      });

      after((done) => {
        delete process.env.PREFIX_FIELD1;

        done();
      });

      it('overrides', (done) => {
        const manifest = {
          field1: 'value1',
          field2: 'value2',
        };

        const originalManifest = clone(manifest);
        override(manifest, 'PREFIX_', show);

        originalManifest.field1 = process.env.PREFIX_FIELD1;
        expect(manifest).to.deep.equal(originalManifest);

        const output = stubs.consoleInfo.args;
        const expectedOutput = (show !== true) ? [] : [
          ['  overridden PREFIX_FIELD1'],
          ['             PREFIX_FIELD2'],
        ];

        expect(output).to.be.deep.equal(expectedOutput);

        done();
      });

      it('overrides deeper manifest', (done) => {
        const manifest = {
          field1: 'value1',
          field2: {
            field3: 'value3',
            field4: 'value4',
          },
        };

        const originalManifest = clone(manifest);
        override(manifest, 'PREFIX_', show);
        originalManifest.field1 = process.env.PREFIX_FIELD1;
        expect(manifest).to.deep.equal(originalManifest);

        const output = stubs.consoleInfo.args;
        const expectedOutput = (show !== true) ? [] : [
          ['  overridden PREFIX_FIELD1'],
          ['             PREFIX_FIELD2'],
          ['             PREFIX_FIELD2_FIELD3'],
          ['             PREFIX_FIELD2_FIELD4'],
        ];

        expect(output).to.be.deep.equal(expectedOutput);

        done();
      });
    });

    describe(`with env variable set to object and show:${show}`, () => {
      before((done) => {
        process.env.PREFIX_FIELD2 = '{"field4": "value4", "field5": "value5"}';

        done();
      });

      after((done) => {
        delete process.env.PREFIX_FIELD2;

        done();
      });

      it('overrides deeper manifest', (done) => {
        const manifest = {
          field1: 'value1',
          field2: {
            field3: 'value3',
            field4: 'value4',
          },
        };

        const originalManifest = clone(manifest);
        override(manifest, 'PREFIX_', show);
        originalManifest.field2 = JSON.parse(process.env.PREFIX_FIELD2);

        expect(manifest).to.deep.equal(originalManifest);

        const output = stubs.consoleInfo.args;
        const expectedOutput = (show !== true) ? [] : [
          ['             PREFIX_FIELD1'],
          ['  overridden PREFIX_FIELD2'],
        ];

        expect(output).to.be.deep.equal(expectedOutput);
        done();
      });
    });

    describe(`with env variable remove field and show:${show}`, () => {
      before((done) => {
        process.env.PREFIX_FIELD1 = 'OVERRIDE_REMOVE_DATA';

        done();
      });

      after((done) => {
        delete process.env.PREFIX_FIELD1;

        done();
      });

      it('removes', (done) => {
        const manifest = {
          field1: 'value1',
          field2: 'value2',
        };

        const originalManifest = clone(manifest);
        override(manifest, 'PREFIX_', show);

        delete originalManifest.field1;

        expect(manifest).to.deep.equal(originalManifest);

        const output = stubs.consoleInfo.args;
        const expectedOutput = (show !== true) ? [] : [
          ['     removed PREFIX_FIELD1'],
          ['             PREFIX_FIELD2'],
        ];

        expect(output).to.be.deep.equal(expectedOutput);
        done();
      });
    });
  });
});
