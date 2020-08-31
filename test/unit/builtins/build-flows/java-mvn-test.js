const { expect } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const sinon = require('sinon');

const AbstractBuildFlow = require('@src/builtins/build-flows/abstract-build-flow');
const JavaMvnBuildFlow = require('@src/builtins/build-flows/java-mvn');

describe('JavaMvnBuildFlow test', () => {
    let config;
    let execStub;
    let debugStub;
    beforeEach(() => {
        config = {
            cwd: 'cwd',
            src: 'src',
            buildFile: 'buildFile',
            doDebug: false
        };
        sinon.stub(fs, 'move').yields();
        sinon.stub(fs, 'readdirSync').returns([]);
        sinon.stub(path, 'join').returns('some-path');
        execStub = sinon.stub(AbstractBuildFlow.prototype, 'execCommand');
        debugStub = sinon.stub(AbstractBuildFlow.prototype, 'debug');
    });
    describe('# inspect correctness of execute', () => {
        it('| should execute commands', (done) => {
            const buildFlow = new JavaMvnBuildFlow(config);

            buildFlow.execute((err, res) => {
                expect(err).eql(undefined);
                expect(res).eql(undefined);
                expect(execStub.args[0][0]).eql('mvn clean org.apache.maven.plugins:maven-'
                + 'assembly-plugin:2.6:assembly -DdescriptorId=jar-with-dependencies package');
                done();
            });
        });

        it('| should execute commands with debug', (done) => {
            config.doDebug = true;
            const buildFlow = new JavaMvnBuildFlow(config);

            buildFlow.execute((err, res) => {
                expect(err).eql(undefined);
                expect(res).eql(undefined);
                expect(execStub.args[0][0]).eql('mvn clean org.apache.maven.plugins:maven-'
                + 'assembly-plugin:2.6:assembly -DdescriptorId=jar-with-dependencies package');
                expect(debugStub.args[0][0]).eql('Building skill artifacts based on the pom.xml.');
                expect(debugStub.args[1][0]).eql('Renaming the jar file some-path to buildFile.');
                done();
            });
        });
    });

    afterEach(() => {
        sinon.restore();
    });
});
