import { Proxy } from '@domoinc/ryuu-proxy';
import manifest from './manifest.json';

const config = { manifest };
const proxy = new Proxy(config);
console.log(proxy)
module.exports = function (app) {
    app.use(proxy.express());
};