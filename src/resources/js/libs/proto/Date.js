
Object.defineProperties(Date.prototype, {
    addDays: {
        value(days) {
            this.setDate(this.getDate() + parseInt(days));
            return this;
        }
    },
    toISODate: {
        value() {
            return this.toISOString().split('T')[0];
        }
    },
    toDotDate: {
        value() {
            return this.toISODate().split('-').reverse().join('.');
        }
    },
    format: {
        value(formatString) {
            // Y-m-d H:i:s
            const tap = (param, len, prefix) => {
                prefix = prefix || '0';
                return (prefix.repeat(len) + param).substr(-2);
            }
            return formatString
                .replace(/Y/g, this.getFullYear())
                .replace(/m/g, tap(this.getMonth()+1, 2))
                .replace(/d/g, tap(this.getDate(), 2))
                .replace(/H/g, tap(this.getHours(), 2))
                .replace(/i/g, tap(this.getMinutes(), 2))
                .replace(/s/g, tap(this.getSeconds(), 2))
        }
    },
});
