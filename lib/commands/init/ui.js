const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

const CONSTANTS = require('@src/utils/constants');
const stringUtils = require('@src/utils/string-utils');
const Messenger = require('@src/view/messenger');
const JsonView = require('@src/view/json-view');

module.exports = {
    showInitInstruction,
    confirmOverwrite,
    getSkillId,
    getSkillMetaSrc,
    getCodeSrcForRegion,
    getSkillInfra,
    showPreviewAndConfirm
};

function showInitInstruction(profile) {
    const initInstruction = `\
This utility will walk you through creating an ask-resources.json file
to help deploy your skill. This only covers the most common attributes 
and will suggest sensible defaults using AWS Lambda as your endpoint.

This will utilize your '${profile}' ASK profile. Run with "--profile" 
to specify a different profile.

Press ^C at any time to quit.
`;

    Messenger.getInstance().info(initInstruction);
}

function confirmOverwrite(callback) {
    inquirer.prompt([{
        message: `${CONSTANTS.FILE_PATH.ASK_RESOURCES_JSON_CONFIG} already exists in current directory. Do you want to overwrite it? `,
        type: 'confirm',
        default: true,
        name: 'isOverwriteConfirmed'
    }]).then((answer) => {
        callback(null, answer.isOverwriteConfirmed);
    }).catch((error) => {
        callback(error);
    });
}

function getSkillId(callback) {
    inquirer.prompt([{
        message: 'Skill Id (leave empty to create one): ',
        type: 'input',
        name: 'skillId'
    }]).then((answer) => {
        callback(null, answer.skillId.trim());
    }).catch((error) => {
        callback(error);
    });
}

function getSkillMetaSrc(callback) {
    inquirer.prompt([{
        message: 'Skill package path: ',
        type: 'input',
        default: './skill-package',
        name: 'skillMetaSrc',
        validate: (input) => {
            if (!stringUtils.isNonBlankString(input)) {
                return 'Path for skill package cannot be empty.';
            }
            if (!fs.existsSync(input)) {
                return 'File path does not exist.';
            }
            return true;
        }
    }]).then((answer) => {
        callback(null, answer.skillMetaSrc);
    }).catch((error) => {
        callback(error);
    });
}

function getCodeSrcForRegion(region, callback) {
    inquirer.prompt([{
        message: `Lambda code path (for ${region} region): `,
        type: 'input',
        default: './lambda',
        name: 'skillCodeSrc',
        validate: (input) => {
            if (stringUtils.isNonBlankString(input) && !fs.existsSync(input)) {
                return 'File path does not exist.';
            }
            return true;
        }
    }]).then((answer) => {
        callback(null, answer.skillCodeSrc);
    }).catch((error) => {
        callback(error);
    });
}

function getSkillInfra(callback) {
    inquirer.prompt([
        {
            message: 'Use AWS CloudFormation to deploy Lambda? ',
            type: 'confirm',
            default: true,
            name: 'isUsingCfn'
        },
        {
            message: 'Lambda runtime: ',
            type: 'input',
            default: 'nodejs10.x',
            name: 'runtime'
        },
        {
            message: 'Lambda handler: ',
            type: 'input',
            default: 'index.hanlder',
            name: 'handler'
        }
    ]).then((answer) => {
        callback(null, {
            isUsingCfn: answer.isUsingCfn,
            runtime: answer.runtime,
            handler: answer.handler
        });
    }).catch((error) => {
        callback(error);
    });
}

function showPreviewAndConfirm(rootPath, askResources, callback) {
    Messenger.getInstance().info(`
Writing to ${path.join(rootPath, CONSTANTS.FILE_PATH.ASK_RESOURCES_JSON_CONFIG)}: 
${JsonView.toString(askResources)}\n`);
    inquirer.prompt([{
        message: 'Does this look correct? ',
        type: 'confirm',
        default: true,
        name: 'confirmPreview'
    }]).then((answer) => {
        callback(null, answer.confirmPreview);
    }).catch((error) => {
        callback(error);
    });
}