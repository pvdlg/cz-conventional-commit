const wrap = require('word-wrap');
const _ = require('lodash');

/**
 * Create a formatted commit message based on answers provided by user.
 *
 * @method formatCommit
 * @param {Object} answers Inquirer.js answers
 * @param {string} answers.type answer to the type question
 * @param {string} answers.scope answer to the scope question
 * @param {string} answers.subject answer to the subject question
 * @param {string} answers.body answer to the body question
 * @param {string} answers.breaking answer to the breaking question
 * @param {string} answers.issues answer to the issues question
 * @param {Object} options options to create the questions
 * @param {Object} options.types list of commit type
 * @param {string} options.types.description commit type description
 * @param {string} options.types.emoji commit type emoji
 * @param {Object} options.aliases list of commit aliases
 * @param {string} options.aliases.description commit type description
 * @param {string} options.aliases.emoji commit type emoji
 * @param {string} options.aliases.type commit type referenced by the alias
 * @param {Object} config configuration
 * @param {string} config.maxSubjectLength maximum subject length
 * @param {string} config.bodyLineLength length of body lines
 * @param {boolean} config.emoji `true` to add emoji at the end of the commit message
 * @return {string} formatted commit
 */
module.exports = (answers, options, config) => {
	const wrapOptions = {
		trim: true,
		newline: '\n',
		indent: '',
		cut: true,
		width: config.bodyLineLength,
	};
	// Parentheses are only needed when a scope is present
	const scope = answers.scope ? answers.scope.trim() : '';
	const isAlias = !Reflect.apply(Object.prototype.hasOwnProperty, options.types, [answers.type]);
	const type = isAlias ? options.aliases[answers.type].type : answers.type;
	const emoji = config.emoji ? (isAlias ? options.aliases[answers.type].emoji : options.types[type].emoji) : '';
	// Limit head to maxSubjectLength (including the trailing emoji)
	// We use the String.length function to determine the length of the emoji even it returns an innacurate value (2 chars per emoji), because most likely a commit hook or linter veryfyingt he head length will also use String.length.
	const head = `${_.truncate(`${type}${scope ? `(${scope})` : ''}: ${answers.subject.trim()}`, {
		length: config.maxSubjectLength - (config.emoji ? emoji.length + 1 : 0),
	})}${config.emoji ? ` ${emoji}` : ''}`;
	const body = wrap(answers.body, wrapOptions);
	const footer = [
		answers.breaking
			? wrap(`BREAKING CHANGE: ${answers.breaking.replace(/^BREAKING CHANGE:\s*/, '').trim()}`, wrapOptions)
			: '',
		answers.issues ? wrap(answers.issues.trim(), wrapOptions) : '',
	]
		.filter(x => x)
		.join('\n\n');

	return [head, body, footer].filter(x => x).join('\n\n');
};
