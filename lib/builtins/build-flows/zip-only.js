const AbstractBuildFlow = require('./abstract-build-flow');

class ZipOnlyBuildFlow extends AbstractBuildFlow {
    static canHandle() {
        return true;
    }

    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        this.createZip(callback);
    }
}

module.exports = ZipOnlyBuildFlow;
