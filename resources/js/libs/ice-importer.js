const map = (target, callback, _context) => {
    _context = _context || undefined;
    return Array.prototype.map.apply(target, [callback, _context]);
};
const slice = (target, begin, end) => {
    return Array.prototype.map.apply(target, [begin || undefined, end || undefined]);
};


const global = window || global || this || {};
global.__ice__ = global.__ice__ || {};

const shard = (target, shard, chunk, callback) => {
    global.__ice__[target] = global.__ice__[target] || {};
    console.log("=== Shard \"" + shard + "\" of \"" + chunk + "\" waiting!!!");
    global.__ice__[target][shard] = {
        pool: [],
    };
    global.__ice__[target][chunk].shards[shard] = [];

    target[shard] = function (...args) {
        const settings = {
            target: this,
            args,
            callback
        };
        global.__ice__[target][chunk].shards[shard].push(settings);
    };
};
const ice = (target, chunk, importing, callback) => {
    console.log("=== Ice \"" + chunk + "\" waiting!!!");
    global.__ice__[target] = global.__ice__[target] || {};
    global.__ice__[target][chunk] = {
        pool: [],
        shards: {},
        loading: false,
    };
    target[chunk] = function (...args) {
        const settings = {
            target: this,
            args: args
        };
        global.__ice__[target][chunk].pool.push(settings);
        if (global.__ice__[target][chunk].loading) return;
        global.__ice__[target][chunk].loading = true;

        importing().then((m) => {
            if (callback) {
                callback(m, global.__ice__[target][chunk].pool);
            } else {
                global.__ice__[target][chunk].pool.map(({target, args}) => {
                    target[chunk].apply(target, args);
                });
            }
            const shards = Object.entries(global.__ice__[target][chunk].shards);
            if (shards.length) {
                for (let [shard, calls] in shards) {
                    if (!calls) continue;
                    calls.map((settings) => {
                        if (settings.callback) {
                            settings.callback(settings)
                        } else {
                            target[shard].apply(settings.target, settings.args);
                        }
                        console.log("=== Shard \"" + shard + "\" of \"" + chunk + "\" init complete!!");
                    })
                }
            }
            delete global.__ice__[target][chunk];
            console.log("=== Ice \"" + chunk + "\" init complete!!");
        });
    }
};

export {
    shard,
    ice,
};

export default ice;
