/* eslint-env node, es6 */
"use strict";

var Boom = require("boom");
var request = require("request");
var {
	URL
} = require("url");

/*
 * hanlder/commander class - RequestHandler
 */
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

module.exports = class ProxyRequestHandler {

	constructor(apiUtil) {
		this._apiUtil = apiUtil;
	}

	apiIbmApicProxy(req, res, next, endpoint, logger) {

		let headOptions = {};

		// for the application to work with APIGEE gateway, has to remove the host header
		if (!!req.headers.host) {
			delete req.headers["host"];
		}
		
		// the auth for IBM
		headOptions.APIKey = endpoint.apiKey;
		headOptions["x-ibm-client-id"] = endpoint.userName;
		headOptions["x-ibm-client-secret"] = endpoint.password;
		
		let method = req.method;
		let newUrl = endpoint.url;
		let url = endpoint.proto + "://" + endpoint.host + ":" + endpoint.port + newUrl;

		let xRequest =
			request({
				method: method,
				url: url,
				headers: headOptions
			});

		req.pipe(xRequest);

		xRequest.on("response", (response) => {
			xRequest.pipe(res);
		}).on("error", (error) => {
			next(Boom.badGateway("error", error));
		});
	}
	
	apiProxy(req, res, next, endpoint, logger) {

		let headOptions = {};

		// for the application to work with APIGEE gateway, has to remove the host header
		if (!!req.headers.host) {
			delete req.headers["host"];
		}

		if (endpoint.authType === "BASIC" ) {
			let authHeader = "Basic " + new Buffer(endpoint.userName + ":" + endpoint.password).toString("base64");
			headOptions.Authorization = authHeader;
		} else if (endpoint.authType === "APIKEY"  ) {
			let authHeader = "Basic " + new Buffer(endpoint.userName + ":" + endpoint.password).toString("base64");
			headOptions.Authorization = authHeader;
			headOptions.APIKey = endpoint.apiKey;
		}

		let method = req.method;
		let newUrl = req.url;
		if (newUrl !== undefined && newUrl !== null) {
			let iSub = newUrl.indexOf(endpoint.prefix);
			iSub = iSub + endpoint.prefix.length - 1;
			if (iSub > 0 && iSub < newUrl.length) {
				newUrl = newUrl.substr(iSub);
			}
		}

		let url = endpoint.proto + "://" + endpoint.host + ":" + endpoint.port + newUrl;

		// Add/update sap-client query parameter with UPS value in the proxied URL
		if (endpoint.type === "odata") {
			var urlObj = new URL(url);
			urlObj.searchParams.delete("sap-client");
			urlObj.searchParams.set("sap-client", endpoint.client);
			url = urlObj.href;
		}

		let xRequest =
			request({
				method: method,
				url: url,
				headers: headOptions
			});

		// Remove MYSAPSSO2 cookie before making the proxied request, so that it does not override basic auth when APIM
		// proxies the request to SAP Gateway
		if ("cookie" in req.headers) {
			var cookies = req.headers.cookie.split(";");
			var filteredCookies = "";
			cookies.forEach(cookie => {
				var sepIndex = cookie.indexOf("=");
				var cookieName = cookie.substring(0, sepIndex).trim();
				var cookieValue = cookie.substring(sepIndex + 1).trim();
				if (cookieName !== "MYSAPSSO2") {
					filteredCookies += (filteredCookies.length > 0 ? "; " : "") + cookieName + "=" + cookieValue;
				}
			});
			req.headers.cookie = filteredCookies;
		}

		req.pipe(xRequest);

		xRequest.on("response", (response) => {
			// in order to make the csrfToken work
			//delete response.headers['set-cookie'];
			let csrfToken = response.headers['x-csrf-token'];
			xRequest.pipe(res);
		}).on("error", (error) => {
			//let bErr = Boom.badGateway("error", error);
			next(Boom.badGateway("error", error));
		});
	}
};