import {types} from 'conventional-changelog-metahub/types';
import aliases from 'conventional-changelog-metahub/aliases';
import {configLoader} from 'commitizen';
import {merge} from 'lodash';
import questions from './questions';
import format from './format-commit';

const config = merge(configLoader.load(), {'cz-conventional-commit': {maxSubjectLength: 72, bodyLineLength: 100}})[
  'cz-conventional-commit'
];

module.exports = {
  prompter(cz, commit) {
    return cz
      .prompt(questions({types, aliases}, config))
      .then(answers => format(answers, {types, aliases}, config))
      .then(commitMessage => commit(commitMessage));
  },
};
