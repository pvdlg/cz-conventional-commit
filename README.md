# **cz-conventional-commit**

[commitizen](https://github.com/commitizen/cz-cli) adapter following the [conventional-changelog](https://github.com/conventional-changelog/conventional-changelog) format, with emojis and additionnal commit types (aliases).

[![Travis](https://img.shields.io/travis/pvdlg/cz-conventional-commit.svg)](https://travis-ci.org/pvdlg/cz-conventional-commit)
[![Codecov](https://img.shields.io/codecov/c/github/pvdlg/cz-conventional-commit.svg)](https://codecov.io/gh/pvdlg/cz-conventional-commit)
[![Greenkeeper badge](https://badges.greenkeeper.io/pvdlg/cz-conventional-commit.svg)](https://greenkeeper.io/)
[![license](https://img.shields.io/github/license/pvdlg/cz-conventional-commit.svg)](https://github.com/pvdlg/cz-conventional-commit/blob/master/LICENSE)

![Screenshot](img/cz-conventional-commit.jpg?raw=true)

## Install as a global utility

```bash
npm install --global commitizen @metahub/cz-conventional-commit
```
Create a .czrc file in your home directory, with the following content:
```json
{
  "path": "@metahub/cz-conventional-commit",
  "cz-conventional-commit": {
    "maxSubjectLength": 72,
    "bodyLineLength": 100
  }
}
```
Now cd into any git repository and use `git cz` instead of `git commit` and you will find the commitizen prompt.

See [commitizen documentation](https://github.com/commitizen/cz-cli#conventional-commit-messages-as-a-global-utility) for more informations.

## Making your repo Commitizen-friendly
```bash
npm install --save-dev commitizen @metahub/cz-conventional-commit
./node_modules/.bin/commitizen init @metahub/cz-conventional-commit --save-dev
```
You can customize cz-conventional-commit in `package.json`:
```json
...
"config": {
  "commitizen": {
    "path": "@metahub/cz-conventional-commit",
    "cz-conventional-commit": {
      "maxSubjectLength": 72,
      "bodyLineLength": 100,
      "emoji": true
    }
  }
}
...
```

See [commitizen documentation](https://github.com/commitizen/cz-cli#making-your-repo-commitizen-friendly) for more informations.

## Options

| Option             | Description                                                                                | Default |
| ------------------ | ------------------------------------------------------------------------------------------ | ------- |
| `maxSubjectLength` | Length at which to truncate the commit head (head includes type, scope, subject and emoji) | 72      |
| `bodyLineLength`   | Length at which to wrap body lines                                                         | 100     |
| `emoji`            | To add and emoji at the end of the commit message                                          | `false` |

## Commit types

| Commit Type | Title                    | Description                                                                                                 | Emoji |
|-------------|--------------------------|-------------------------------------------------------------------------------------------------------------|:-----:|
| `feat`      | Features                 | A new feature                                                                                               |   ✨   |
| `fix`       | Bug Fixes                | A bug Fix                                                                                                   |  🐛   |
| `docs`      | Documentation            | Documentation only changes                                                                                  |  📚   |
| `style`     | Styles                   | Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)      |  💎   |
| `refactor`  | Code Refactoring         | A code change that neither fixes a bug nor adds a feature                                                   |  📦   |
| `perf`      | Performance Improvements | A code change that improves performance                                                                     |  🚀   |
| `test`      | Tests                    | Adding missing tests or correcting existing tests                                                           |  🚨   |
| `build`     | Builds                   | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         |  🛠   |
| `ci`        | Continuous Integrations  | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |   ⚙️  |
| `chore`     | Chores                   | Other changes that don't modify src or test files                                                           |   ♻️  |
| `revert`    | Reverts                  | Reverts a previous commit                                                                                   |  🗑   |

## Commit aliases

Aliases are additionnal commit types that will be formatted to follow [AngularJS Commit Message Conventions](https://docs.google.com/document/d/1QrDFcIiPjSLDn3EL15IJygNPiHORgU1_OOAqWjiDU5Y/edit) and automatically set some fields.

For example when choosing `initial`, `cz-conventional-commit` will automatically set:
- the standard type to `feat`
- the `scope` to empty
- the `subject` to 'Initial commit 🎉'
- the `issues` to empty
- the `breaking` to empty

The commit message will be `feat: Initial commit 🎉`.

| Commit Type        | Type    | Scope (default) | Subject (default) | Emoji |
|--------------------|---------|-----------------|-------------------|:-----:|
| `initial`          | `feat`  | `empty`         | Initial commit    |  🎉   |
| `dependencies`     | `fix`   | package         | -                 |   ⏫   |
| `peerDependencies` | `fix`   | package         | -                 |   ⬆️  |
| `devDependencies`  | `chore` | package         | -                 |  🔼   |
| `metadata`         | `fix`   | package         | -                 |  📦   |

## Related

- [conventional-changelog-metahub](https://github.com/pvdlg/conventional-changelog-metahub) - List of conventional commit types and aliases for this module
