const fs = require('fs');
const inquirer = require('inquirer');
const path = require('path');

const CONSTANTS = require('@src/utils/constants');
const stringUtils = require('@src/utils/string-utils');
const JsonView = require('@src/view/json-view');
const Messenger = require('@src/view/messenger');
const { type } = require('os');

module.exports = {
    selectLocales,
    showSourcesForEachLocale
};

function selectLocales(localeChoices, callback) {
    inquirer.prompt([{
        message: 'Please select at least one locale to add:',
        type: 'checkbox',
        name: 'localeList',
        choices: localeChoices
    }]).then((answer) => {
        callback(null, answer.localeList);
    }).catch((error) => {
        callback(error);
    });
}

function showSourcesForEachLocale(iModelSourceByLocales) {
    Messenger.getInstance().info('The following skill locale(s) have been added according to your local project:');
    iModelSourceByLocales.forEach((v, k) => {
        if (fs.existsSync(v)) {
            const sourceLocale = path.basename(v, path.extname(v));
            Messenger.getInstance().info(`  Added locale ${k} from the locale ${sourceLocale}'s interactionModel and manifest`);
        } else {
            Messenger.getInstance().info(`  Added locale ${k} from the interactionModel template`);
        }
    });
    Messenger.getInstance().info('Please change the placeholders value for those from our templates. Run deploy command to apply the changes.');
}
