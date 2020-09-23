const parameterRename = require('@src/commands/smapi/customizations/parameters.json');

const apiToCommanderMap = new Map();
const customizationMap = new Map();
const defaultValues = new Map();

defaultValues.set('stage', { value: 'development' });
defaultValues.set('skillId', { value: 'skill id in the workspace', inWorkspace: true });

Object.keys(parameterRename).forEach(key => {
    const value = parameterRename[key];
    customizationMap.set(key, value);
    if (value.name) {
        apiToCommanderMap.set(key, value.name);
    }
});

module.exports = { apiToCommanderMap, customizationMap, defaultValues };
