const childProcess = require('child_process');
const fs = require('fs-extra');
const path = require('path');

const CliError = require('@src/exceptions/cli-error');
const AbstractBuildFlow = require('./abstract-build-flow');

class PythonPipBuildFlow extends AbstractBuildFlow {
    static get manifest() { return 'requirements.txt'; }

    static canHandle({ src }) {
        return fs.existsSync(path.join(src, PythonPipBuildFlow.manifest));
    }

    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        const python = this.isWindows ? 'python' : 'python3';
        const pipCmdPrefix = this.isWindows ? '"venv/Scripts/pip3"' : 'venv/bin/python -m pip';

        const { isPython2, version } = this._checkPythonVersion(python);
        if (isPython2) {
            return callback(new CliError(`Current python (${version}) is not supported. `
            + 'Please make sure you are using python3, or use your custom script to build the code.'));
        }
        this.debug('Setting up virtual environment.');
        this.execCommand(`${python} -m venv venv`);
        this.debug(`Installing Python dependencies based on the ${PythonPipBuildFlow.manifest}.`);
        this.execCommand(`${pipCmdPrefix} --disable-pip-version-check install -r requirements.txt -t ./`);
        fs.removeSync(path.join(this.cwd, 'venv'));
        this.createZip((error) => callback(error));
    }

    _checkPythonVersion(python) {
        const versionStr = childProcess.spawnSync(python, ['--version']).output.toString().trim();
        const [version] = versionStr.match(/\d\.\d\.\d+/gm);
        const isPython2 = version.startsWith('2.');
        return { isPython2, version };
    }
}

module.exports = PythonPipBuildFlow;
