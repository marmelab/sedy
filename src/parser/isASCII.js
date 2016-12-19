/**
 * Check if string is ASCII only
 * @see http://stackoverflow.com/a/14313213
 */
export default str => /^[\x00-\xFF]*$/.test(str);
