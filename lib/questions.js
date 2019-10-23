const _ = require('lodash');
const types = require('conventional-changelog-metahub/types');

/**
 * Create the Inquirer.js questions object.
 *
 * @method questions
 * @param {Object} options options to create the questions
 * @param {Object} options.types list of commit type
 * @param {string} options.types.description commit type description
 * @param {string} options.types.emoji commit type emoji
 * @param {Object} options.aliases list of commit aliases
 * @param {string} options.aliases.description commit type description
 * @param {string} options.aliases.emoji commit type emoji
 * @return {Object} Inquirer.js questions object
 * @param {Object} config configuration
 * @param {string} config.maxSubjectLength maximum subject length
 * @param {string} config.bodyLineLength length of body lines
 * @param {boolean} config.emoji `true` to add emoji at the end of the commit message
 */
module.exports = (options, config) => {
	const allTypes = {...options.types, ...options.aliases};
	const length = _.maxBy(Object.keys(allTypes), type => type.length).length + 1;
	const choices = _.map(allTypes, (type, key) => ({
		name: `${_.padEnd(`${key}:`, length)} ${type.emoji}  ${type.description}`,
		value: key,
	})).sort((choice1, choice2) =>
		types.typesOrder.indexOf(choice1.value) < types.typesOrder.indexOf(choice2.value) ? -1 : 1
	);

	return [
		{type: 'list', name: 'type', message: "Select the type of change that you're committing:", choices},
		{
			type: 'input',
			name: 'scope',
			message: 'Denote the scope of this change ($location, $browser, $compile, etc.):\n',
			default(answers) {
				if (
					answers.type === 'devDependencies' ||
					answers.type === 'dependencies' ||
					answers.type === 'peerDependencies' ||
					answers.type === 'metadata'
				) {
					return 'package';
				}

				return null;
			},
			when(answers) {
				return answers.type !== 'initial';
			},
		},
		{
			type: 'input',
			name: 'subject',
			message: `Write a short, imperative tense description of the change (max header length: ${config.maxSubjectLength}):\n`,
			default(answers) {
				if (answers.type === 'initial') {
					return options.aliases[answers.type].description;
				}

				return null;
			},
			validate(input) {
				if (input) {
					return true;
				}

				return 'Commit subject message is mandatory';
			},
		},
		{type: 'input', name: 'body', message: 'Provide a longer description of the change:\n'},
		{
			type: 'input',
			name: 'breaking',
			message: 'List any breaking changes:\n',
			when(answers) {
				return answers.type !== 'initial';
			},
		},
		{
			type: 'input',
			name: 'issues',
			message: 'List any issues closed by this change:\n',
			when(answers) {
				return answers.type !== 'initial';
			},
		},
	];
};
