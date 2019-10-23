const types = require('conventional-changelog-metahub/types');
const aliases = require('conventional-changelog-metahub/aliases');
const commitizen = require('commitizen');
const _ = require('lodash');
const questions = require('./lib/questions');
const format = require('./lib/format-commit');

const config = _.merge(commitizen.configLoader.load(), {
	'cz-conventional-commit': {maxSubjectLength: 72, bodyLineLength: 100, emoji: false},
})['cz-conventional-commit'];

module.exports = {
	prompter: async (cz, commit) => {
		const answers = await cz.prompt(questions({types: types.types, aliases}, config));

		const commitMessage = format(answers, {types: types.types, aliases}, config);
		return commit(commitMessage);
	},
};
