const { expect } = require('chai');
const childProcess = require('child_process');
const fs = require('fs-extra');
const sinon = require('sinon');

const AbstractBuildFlow = require('@src/builtins/build-flows/abstract-build-flow');
const Messenger = require('@src/view/messenger');
const zipUtils = require('@src/utils/zip-utils');

describe('AbstractBuildFlow test', () => {
    let config;
    let debugStub;
    beforeEach(() => {
        config = {
            cwd: 'cwd',
            src: 'src',
            buildFile: 'buildFile',
            doDebug: false
        };
        debugStub = sinon.stub();
        sinon.stub(Messenger, 'getInstance').returns({ debug: debugStub });
    });

    describe('# inspect correctness for constructor', () => {
        it('| initiate the class', () => {
            const buildFlow = new AbstractBuildFlow(config);

            expect(buildFlow).to.be.instanceOf(AbstractBuildFlow);
        });
    });

    describe('# inspect correctness of createZip', () => {
        it('| should call create temp zip', (done) => {
            const createTempZipStub = sinon.stub(zipUtils, 'createTempZip').yields();
            const moveSyncStub = sinon.stub(fs, 'moveSync');
            const buildFlow = new AbstractBuildFlow(config);

            buildFlow.createZip((err, res) => {
                expect(err).eql(undefined);
                expect(res).eql(undefined);
                expect(createTempZipStub.callCount).eql(1);
                expect(moveSyncStub.callCount).eql(1);
                done();
            });
        });

        it('| should return error if creating a temp zip fails', (done) => {
            const error = 'some Error';
            sinon.stub(zipUtils, 'createTempZip').yields(new Error(error));
            const buildFlow = new AbstractBuildFlow(config);

            buildFlow.createZip((err, res) => {
                expect(err.message).eql(error);
                expect(res).eql(undefined);
                done();
            });
        });
    });

    describe('# inspect correctness of execCommand', () => {
        it('| should execute the command', () => {
            const testCommand = 'test';
            const stub = sinon.stub(childProcess, 'execSync');
            const buildFlow = new AbstractBuildFlow(config);

            buildFlow.execCommand(testCommand);
            expect(stub.callCount).eql(1);
            expect(stub.args[0][0]).eql(testCommand);
        });
    });

    describe('# inspect correctness of debug', () => {
        it('| should not output debug message', () => {
            const buildFlow = new AbstractBuildFlow(config);

            buildFlow.debug('test');
            expect(debugStub.callCount).eql(0);
        });

        it('| should output debug message', () => {
            config.doDebug = true;
            const buildFlow = new AbstractBuildFlow(config);

            buildFlow.debug('test');
            expect(debugStub.callCount).eql(1);
        });
    });

    afterEach(() => {
        sinon.restore();
    });
});
