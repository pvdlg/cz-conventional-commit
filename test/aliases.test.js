import test from 'ava';
import emojiRegex from 'emoji-regex/text';
import {length} from 'stringz';
import {types} from 'conventional-changelog-metahub/types';
import aliases from '../lib/aliases';

/**
 * AVA macro that verifies that each object in `object` has the property `prop` of type `type`.
 *
 * @method hasProperty
 * @param {Object} t AVA assertion librarie
 * @param {string} object object to verify
 * @param {string} prop property to verify
 * @param {string} type type to verify
 */
function hasProperty(t, object, prop, type) {
  for (const obj in object) {
    if (Object.prototype.hasOwnProperty.call(object, obj)) {
      t.true(Object.prototype.hasOwnProperty.call(object[obj], prop));
      if (type === 'string') {
        t.true(typeof object[obj][prop] === type);
      } else if (type === 'emoji') {
        t.true(emojiRegex({exact: true}).test(object[obj][prop]));
        t.is(length(object[obj][prop]), 1);
      }
    }
  }
}

test('Each alias has the property title', hasProperty, aliases, 'title', 'string');
test('Each type has the property description', hasProperty, aliases, 'description', 'string');
test('Each type has the property emoji', hasProperty, aliases, 'emoji', 'emoji');

test('Each alias`s type property has a value that exists in types', t => {
  for (const alias in aliases) {
    if (Object.prototype.hasOwnProperty.call(aliases, alias)) {
      t.true(Object.prototype.hasOwnProperty.call(types, aliases[alias].type));
    }
  }
});
