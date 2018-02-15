import test from 'ava';
import {maxBy} from 'lodash';
import parser from 'conventional-commits-parser';
import {types} from 'conventional-changelog-metahub/types';
import aliases from 'conventional-changelog-metahub/aliases';
import formatCommit from '../lib/format-commit';

const config = {maxSubjectLength: 50, bodyLineLength: 72};

test('Each type and aliases produce a commit with the input subject', t => {
	const input = {
		subject: 'Commit subject',
	};

	Object.keys(types)
		.concat(Object.keys(aliases))
		.forEach(type => {
			t.is(
				parser.sync(formatCommit(Object.assign({}, {type}, input), {types, aliases}, config)).subject,
				input.subject
			);
		});
});

test('Each type and aliases produce a commit with a subject ending with the appropriate emoji', t => {
	const input = {
		subject: 'Commit subject',
	};

	Object.keys(types)
		.concat(Object.keys(aliases))
		.forEach(type => {
			t.true(
				parser
					.sync(
						formatCommit(Object.assign({}, {type}, input), {types, aliases}, Object.assign({}, config, {emoji: true}))
					)
					.subject.endsWith(aliases[type] ? aliases[type].emoji : types[type].emoji)
			);
		});
});

test('Does not duplicate "BREAKING CHANGE" in commit message if it`s defined by user', t => {
	const input = {
		type: 'feat',
		subject: 'Commit subject',
		breaking: 'BREAKING CHANGE: Breaking change description\nand another',
	};
	const parsed = parser.sync(formatCommit(input, {types, aliases}, config));

	t.is(parsed.notes[0].text, 'Breaking change description\nand another');
});

test('Does not add unnecessary new line at teh end of the commit message', t => {
	const input = {
		type: 'feat',
		subject: 'Commit subject',
	};

	t.false(formatCommit(input, {types, aliases}, config).endsWith('\n'));
});

test('Truncate the subject to fit 50 characters (with emoji)', t => {
	const input = {
		type: 'feat',
		subject:
			'Veryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy long suject',
	};

	t.is(
		parser.sync(formatCommit(input, {types, aliases}, Object.assign({}, config, {emoji: true}))).header.length,
		config.maxSubjectLength
	);
});

test('Truncate the subject to fit 50 characters (without emoji)', t => {
	const input = {
		type: 'feat',
		subject:
			'Veryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy long suject',
	};

	t.is(parser.sync(formatCommit(input, {types, aliases}, config)).header.length, config.maxSubjectLength);
});

test('Wrap the body to fit 72 characters', t => {
	const input = {
		type: 'feat',
		subject: 'Commit subject',
		body:
			'Veryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy, veryyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy  long body',
	};

	t.is(
		maxBy(parser.sync(formatCommit(input, {types, aliases}, config)).body.split('\n'), line => line.length).length,
		config.bodyLineLength
	);
});
