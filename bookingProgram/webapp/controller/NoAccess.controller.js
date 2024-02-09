sap.ui.define([
	"tci/wave2/ui/bookingProgram/controller/BaseController",
	'sap/m/MessageBox'	
], function (BaseController,MessageBox) {
	"use strict";

	return BaseController.extend("tci.wave2.ui.bookingProgram.controller.NoAccess", {
		onInit: function () {
		//	this.getRouter().getTarget("notFound").attachDisplay(this._onNotFoundDisplayed, this);
		},

		_onNotFoundDisplayed : function () {
			this.getModel("appView").setProperty("/layout", "OneColumn");
		}
	});
});