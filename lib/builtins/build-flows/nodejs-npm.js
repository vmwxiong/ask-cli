const fs = require('fs-extra');
const path = require('path');
const AbstractBuildFlow = require('./abstract-build-flow');

class NodeJsNpmBuildFlow extends AbstractBuildFlow {
    static get manifest() { return 'package.json'; }

    static canHandle({ src }) {
        return fs.existsSync(path.join(src, NodeJsNpmBuildFlow.manifest));
    }

    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        const quiteFlag = this.doDebug ? '' : ' --quite';
        this.debug(`Installing NodeJS dependencies based on the ${NodeJsNpmBuildFlow.manifest}.`);
        this.execCommand(`npm install --production${quiteFlag}`);
        this.createZip((error) => callback(error));
    }
}

module.exports = NodeJsNpmBuildFlow;
