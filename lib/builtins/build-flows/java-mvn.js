const fs = require('fs-extra');
const path = require('path');
const AbstractBuildFlow = require('./abstract-build-flow');

class JavaMvnBuildFlow extends AbstractBuildFlow {
    static get manifest() { return 'pom.xml'; }

    static canHandle({ src }) {
        return fs.existsSync(path.join(src, JavaMvnBuildFlow.manifest));
    }

    constructor({ cwd, src, buildFile, doDebug }) {
        super({ cwd, src, buildFile, doDebug });
    }

    execute(callback) {
        this.debug(`Building skill artifacts based on the ${JavaMvnBuildFlow.manifest}.`);
        this.execCommand('mvn clean org.apache.maven.plugins:maven-assembly-plugin:2.6:assembly '
        + '-DdescriptorId=jar-with-dependencies package');
        const targetFolderPath = path.join(this.cwd, 'target');
        const jarFileName = fs.readdirSync(targetFolderPath).find(fileName => fileName.endsWith('jar-with-dependencies.jar'));
        const jarFilePath = path.join(targetFolderPath, jarFileName);
        this.debug(`Renaming the jar file ${jarFilePath} to ${this.buildFile}.`);
        fs.move(jarFilePath, this.buildFile, { overwrite: true }, (error) => callback(error));
    }
}

module.exports = JavaMvnBuildFlow;
