/*eslint-env node, es6 */
"use strict";

module.exports = (app, server) => {
	app.use('/node/env', require('./routes/env')());
};