/**
 * @fileOverview
 *   Takes a object and checks the environment variables for overrides
 *   to its values. Great for manifests and other configuration.
 */


/**
 * Overrides values with environment variables.
 *
 * @param  {Object} values
 *   Object structure with default values
 * @param  {String} prefix
 *   Prefix to environment variables to avoid collisions.
 * @param {bool} show
 *   If true, the code will output to console the overrides.
 */
var override = function override(values, prefix, show) {

  for (var key in values) {

    var value = values[key];
    var keyPrefix = (prefix + key).toUpperCase();

    // Replace hyphens.
    keyPrefix = keyPrefix.replace(/-/g, '_');

    // Replace dots.
    keyPrefix = keyPrefix.replace(/\./g, '_');

    if (process.env[keyPrefix] !== undefined) {
      if (process.env[keyPrefix] === 'OVERRIDE_REMOVE_DATA') {
        delete values[key];
        if (show) {
          console.info('     removed ' + keyPrefix);
        }
      }
      else {
        try {
          // Try to parse the the environment variable and use it as object or array if possible.
          values[key] = JSON.parse(process.env[keyPrefix]);
        }
        catch(e) {
          // If we are not able ot parse the object, use it as a string.
          values[key] = process.env[keyPrefix];
        }
        if (show) {
          console.info('  overridden ' + keyPrefix);
        }
      }

    }
    else {
      if (show) {
          console.info('             ' + keyPrefix);
      }
      if (typeof value === 'object') {
        override(value, keyPrefix + '_', show);
      }
    }

  }
};

module.exports = override;
