

Object.defineProperties(Object.prototype, {
    dd: {
        value(...args) {
            console.log(this, ...args);
        }
    }
})
