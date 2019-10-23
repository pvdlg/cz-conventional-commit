import test from 'ava';
import {spy, stub} from 'sinon';
import parser from 'conventional-commits-parser';
import {lint, load} from '@commitlint/core';
import {types} from 'conventional-changelog-metahub/types';
import aliases from 'conventional-changelog-metahub/aliases';
import engine from '..';

test.cb(
	'Each types and aliases produces a valid (with commitlint) and parsable (with conventional-commits-parser) commit message',
	t => {
		const answers = {
			scope: 'test-scope',
			subject: 'Commit subject',
			body: 'this the body \n with 2 parts \n mention @vanduynslagerp',
			breaking: 'Breaking change description\nand another',
			issues: 'Fixes #3',
		};

		Object.keys({...types, ...aliases}).map(async type => {
			const commitSpy = spy();

			await engine.prompter({prompt: stub().resolves({type, ...answers})}, commitSpy);
			const [msg] = commitSpy.firstCall.args;
			const parsed = parser.sync(msg);
			const lintRes = await load({extends: ['@commitlint/config-angular']}).then(opts => lint(msg, opts.rules));

			t.true(lintRes.valid);
			t.is(parsed.type, aliases[type] ? aliases[type].type : type);
			t.is(parsed.scope, answers.scope);
			t.true(parsed.subject.startsWith(answers.subject));
			t.is(parsed.notes[0].text, answers.breaking);
			t.is(parsed.references[0].action, 'Fixes');
			t.is(parsed.references[0].issue, '3');
			t.is(parsed.mentions[0], 'vanduynslagerp');
		});
		t.end();
	}
);
