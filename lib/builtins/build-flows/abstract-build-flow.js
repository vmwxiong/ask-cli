const fs = require('fs-extra');
const childProcess = require('child_process');
const Messenger = require('@src/view/messenger');
const zipUtils = require('@src/utils/zip-utils');

class AbstractBuildFlow {
    constructor({ cwd, src, buildFile, doDebug }) {
        this.cwd = cwd;
        this.src = src;
        this.buildFile = buildFile;
        this.stdio = doDebug ? 'inherit' : 'pipe';
        this.doDebug = doDebug;
        this.isWindows = process.platform === 'win32';
    }

    createZip(callback) {
        this.debug(`Zipping source files and dependencies to ${this.buildFile}.`);
        zipUtils.createTempZip(this.cwd, (zipErr, zipFilePath) => {
            if (zipErr) {
                return callback(zipErr);
            }
            fs.moveSync(zipFilePath, this.buildFile, { overwrite: true });
            callback();
        });
    }

    execCommand(cmd) {
        childProcess.execSync(cmd, { cwd: this.cwd, stdio: this.stdio });
    }

    debug(message) {
        if (this.doDebug) {
            Messenger.getInstance().debug(message);
        }
    }
}

module.exports = AbstractBuildFlow;
