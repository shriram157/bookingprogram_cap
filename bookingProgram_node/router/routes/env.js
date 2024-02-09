/*eslint no-console: 0, no-unused-vars: 0, no-shadow: 0, new-cap: 0*/
/*eslint-env node, es6 */
'use strict';

var xsenv = require('@sap/xsenv');
var express = require('express');

module.exports = function () {
	var router = express.Router();

	router.get("/userProfile", (req, res) => {
		res.type("application/json").status(200).send(JSON.stringify({
			userContext: {
				scopes: JSON.parse(JSON.stringify(req.authInfo.scopes)),
				userAttributes: JSON.parse(JSON.stringify(req.authInfo.userAttributes)),
				userInfo: JSON.parse(JSON.stringify(req.authInfo.userInfo))
			}
		}));
	});

	router.get('/userProfile1', (req, res) => {
		var userContext = {
			userAttributes: {
				UserType: [
					"Dealer"
				],
				DealerCode: [
					"24015"
				],
				Department : [
					'D003'
				],
				Language: [
					"English"
				],
				FirstName: [
					"24015"
				],
				LastName: [
					"User"
				]
			},
			userInfo: {
				logonName: "24015user",
				givenName: "24015user",
				familyName: "unknown.org",
				email: "24015user@unknown.org"
			},
			scopes: [
				"XSA_DealerPartsOrderingPartsOrderStatusInq!t1188.BookingAdmin",
				"openid"
			]
		};

		var result = JSON.stringify({
			userContext: userContext
		});
		res.type('application/json').status(200).send(result);
	});

	return router;
};