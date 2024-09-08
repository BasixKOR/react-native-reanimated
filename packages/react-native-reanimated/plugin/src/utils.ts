import type { NodePath } from '@babel/traverse';
import type { CallExpression } from '@babel/types';
import {
  identifier,
  isExportNamedDeclaration,
  isScopable,
  variableDeclaration,
  variableDeclarator,
} from '@babel/types';
import { globals } from './globals';
import type { ReanimatedPluginPass } from './types';

export function isRelease() {
  const pattern = /(prod|release|stag[ei])/i;
  return !!(
    process.env.BABEL_ENV?.match(pattern) ||
    process.env.NODE_ENV?.match(pattern)
  );
}

/**
 * This function allows to add custom globals such as host-functions. Those
 * globals have to be passed as an argument for the plugin in babel.config.js.
 *
 * For example:
 *
 * ```js
 * plugins: [
 *   ['react-native-reanimated/plugin', { globals: ['myHostFunction'] }],
 * ];
 * ```
 */
export function addCustomGlobals(this: ReanimatedPluginPass) {
  if (this.opts && Array.isArray(this.opts.globals)) {
    this.opts.globals.forEach((name: string) => {
      globals.add(name);
    });
  }
}

/**
 * This function replaces the node with a factory call while making sure that
 * it's a legal operation. If the node cannot be simply replaced with a factory
 * call, it will be replaced with a variable declaration.
 *
 * For example:
 *
 * ```ts
 * const foo = function () {
 *   'worklet';
 *   return 1;
 * };
 * ```
 *
 * Becomes
 *
 * ```ts
 * const foo = factoryCall();
 * ```
 *
 * But:
 *
 * ```ts
 * export function foo() {
 *   'worklet';
 *   return 1;
 * }
 * ```
 *
 * Becomes
 *
 * ```ts
 * export const foo = factoryCall();
 * ```
 */
export function replaceWithFactoryCall(
  toReplace: NodePath<unknown>,
  name: string | undefined,
  factoryCall: CallExpression
) {
  if (!name || !needsDeclaration(toReplace)) {
    toReplace.replaceWith(factoryCall);
  } else {
    const replacement = variableDeclaration('const', [
      variableDeclarator(identifier(name), factoryCall),
    ]);
    toReplace.replaceWith(replacement);
  }
}

function needsDeclaration(nodePath: NodePath<unknown>): boolean {
  return (
    isScopable(nodePath.parent) || isExportNamedDeclaration(nodePath.parent)
  );
}
