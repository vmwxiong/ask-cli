const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs-extra');
const path = require('path');

const SkillInfrastructureController = require('@src/controllers/skill-infrastructure-controller');
const helper = require('@src/commands/init/helper');
const ui = require('@src/commands/init/ui');
const ResourcesConfig = require('@src/model/resources-config');
const AskResources = require('@src/model/resources-config/ask-resources');
const AskStates = require('@src/model/resources-config/ask-states');
const CONSTANTS = require('@src/utils/constants');
const Messenger = require('@src/view/messenger');


describe.skip('Commands add-locales - helper test', () => {
    
    describe('# unit test for method addLocales', () => {
        const TEST_LOCALES = ['en-GB', ]
        it('| run method', (done) => {
            // setup
            // call
            helper.addLocales(TEST_LOCALES, (err, res) => {
                // verify
                expect(res).equal(undefined);
                done();
            });
        });
    });
});
