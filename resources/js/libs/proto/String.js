Object.defineProperties(String.prototype, {
    interpolate: {
        value(params) {
            const names = Object.keys(params);
            const values = Object.values(params);
            return (new Function(...names, `return \`${this}\`;`))(...values);
        }
    }
});
