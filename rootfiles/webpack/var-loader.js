const utils = require("loader-utils");
const getOptions = utils.getOptions;
const parseQuery = utils.parseQuery;

module.exports = function loader (source) {
    const options = getOptions(this);
    const query = parseQuery(this.query);
    let defines = [];
    let type, types = (options.types || query.types || 'const|var|let').split('|'),
        v, vs;
    while ((type = types.shift())) {
        vs = (options[type] || query[type] || "").split('|');
        if (vs.length > 0) {
            defines.push('/* ' + (type.toUpperCase()) + 'S INJECTION */\n');
        }
        while ((v = vs.shift())) {
            v = v.split(':');
            if (!v[1]) {
                v[1] = 'null';
            }
            defines.push(type + ' ' + v.join('='));
        }
    }
    return defines.join(";\n") + ";\n" + source;
};
