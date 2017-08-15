import test from 'ava';
import {types, aliases} from '@metahub/conventional-commit-types';
import questions from '../lib/questions';

const qOrder = ['type', 'scope', 'subject', 'body', 'breaking', 'issues'];
const config = {maxSubjectLength: 50, bodyLineLength: 72};

/**
 * AVA macro to verifies that a question skipped when for a gven answers object.
 *
 * @method shouldSkip
 * @param {Object} t AVA assertion librarie
 * @param {string} question question to verify
 * @param {Object} answers answers provided so far
 */
function shouldSkip(t, question, answers) {
  t.false(questions({types, aliases}, config)[qOrder.indexOf(question)].when(answers));
}

shouldSkip.title = (providedTitle, question, answers) =>
  `Skip "${question}" question when answers are ${JSON.stringify(answers)}`;

/**
 * AVA macro to verifies that a question as a specific default answer for a given answers object.
 *
 * @method hasDefault
 * @param {Object} t AVA assertion librarie
 * @param {string} question question to verify
 * @param {Object} answers answers provided so far
 * @param {string} expected expected default value
 */
function hasDefault(t, question, answers, expected) {
  t.is(questions({types, aliases}, config)[qOrder.indexOf(question)].default(answers), expected);
}

hasDefault.title = (providedTitle, question, answers, expected) =>
  `"${question}" question default value is "${expected}" when answers are ${JSON.stringify(answers)}`;

/**
 * AVA macro to verifies that a question return an error message for a given answer.
 *
 * @method hasValidationMessage
 * @param {Object} t AVA assertion librarie
 * @param {string} question question to verify
 * @param {Object} input answer provided for the question
 * @param {string} expected regex to match the expected error message
 */
function hasValidationMessage(t, question, input, expected) {
  if (expected instanceof RegExp) {
    t.regex(questions({types, aliases}, config)[qOrder.indexOf(question)].validate(input), expected);
  } else {
    t.is(questions({types, aliases}, config)[qOrder.indexOf(question)].validate(input), expected);
  }
}

hasValidationMessage.title = (providedTitle, question, input, expected) =>
  `"${question}" question error message is "${expected}" when answer is "${input}"`;

test(shouldSkip, 'scope', {type: 'initial'});

test(shouldSkip, 'breaking', {type: 'initial'});

test(shouldSkip, 'issues', {type: 'initial'});

test(hasDefault, 'scope', {type: 'dependencies'}, 'package');
test(hasDefault, 'scope', {type: 'devDependencies'}, 'package');
test(hasDefault, 'scope', {type: 'peerDependencies'}, 'package');
test(hasDefault, 'scope', {type: 'metadata'}, 'package');
test(hasDefault, 'scope', {type: 'feat'}, null);

test(hasDefault, 'subject', {type: 'initial'}, aliases.initial.description);
test(hasDefault, 'subject', {type: 'feat'}, null);

test(hasValidationMessage, 'subject', '', /\w/);
test(hasValidationMessage, 'subject', 'Test value', true);

test('Questions are asked in the expected order', t => {
  t.deepEqual(qOrder, questions({types, aliases}, config).map(question => question.name));
});

test('Choices of type question are formatted properly (description of each choice is vertically aligned)', t => {
  questions({types, aliases}, config)[qOrder.indexOf('type')].choices.forEach((choice, index, choices) => {
    if (index > 0) {
      t.is(/.*?:\s+/.exec(choice.name)[0].length, /.*?:\s+/.exec(choices[index - 1].name)[0].length);
    }
  });
});
