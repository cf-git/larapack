const tools = (() => {
    const _context = {
        copyProps (itemsList, source, target) {
            source = source || this;
            target = target || {};
            if (Array.isArray(itemsList)) {
                return Array.from(itemsList).reduce(
                    (r, i) => {
                        r[i] = source[i];
                        return r;
                    },
                    target
                );
            }
            return Object.entries(itemsList).reduce(
                (r, i) => {
                    r[i[1]] = source[i[0]];
                    return r;
                },
                target
            )
        },
    };
    return (target) => {
        const properties = {};
        for (let [key, val] of Object.entries(_context)) {
            properties[key] = {
                value: val
            }
        }
        Object.defineProperties(target, properties);
        return target;
    };
})();

export {
    tools
};
