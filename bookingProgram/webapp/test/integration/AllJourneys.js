/* global QUnit*/

sap.ui.define([
	"sap/ui/test/Opa5",
	"tci/wave2/ui/bookingProgram/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"tci/wave2/ui/bookingProgram/test/integration/pages/App",
	"tci/wave2/ui/bookingProgram/test/integration/navigationJourney"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "tci.wave2.ui.bookingProgram.view.",
		autoWait: true
	});
});