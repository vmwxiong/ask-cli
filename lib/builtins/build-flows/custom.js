const fs = require('fs-extra');
const path = require('path');
const AbstractBuildFlow = require('./abstract-build-flow');

class CustomBuildFlow extends AbstractBuildFlow {
    static get manifest() { return process.platform === 'win32' ? 'build.ps1' : 'build.sh'; }

    static get _customScriptPath() { return path.join(process.cwd(), 'hooks', CustomBuildFlow.manifest); }

    static canHandle() {
        return fs.existsSync(CustomBuildFlow._customScriptPath);
    }

    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        this.debug(`Executing custom hook script ${CustomBuildFlow._customScriptPath}.`);
        this.execCommand(`${CustomBuildFlow._customScriptPath} ${this.buildFile} ${this.doDebug}`);
        callback();
    }
}

module.exports = CustomBuildFlow;
