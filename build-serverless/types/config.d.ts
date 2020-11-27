export type option = {
    type: "string" | "number" | "boolean" | "array" | "count";
    alias: string;
    default?: string | any[];
    description: string;
    demandOption: boolean;
};
export const defaultFiles: string[];
/**
 * @typedef {Object} option
 * @property {"string" | "number" | "boolean" | "array" | "count"} option.type
 * @property {string} option.alias
 * @property {string | array} [option.default]
 * @property {string} option.description
 * @property {boolean} option.demandOption

 * @typedef {Object} yargsOptions
 * @property {option} yargsOptions.o
 * @property {option} yargsOptions.s
 * @property {option} yargsOptions.n
 * @property {option} yargsOptions.d
 * @property {option} yargsOptions.c
 */
/** @type {yargsOptions} */
export const yargsOptions: yargsOptions;
export type yargsOptions = {
    o: option;
    s: option;
    n: option;
    d: option;
    c: option;
};
