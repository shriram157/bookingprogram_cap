sap.ui.define([
	"tci/wave2/ui/bookingProgram/controller/BaseController",
	'sap/m/MessageBox'	
], function (BaseController,MessageBox) {
	"use strict";

	return BaseController.extend("tci.wave2.ui.bookingProgram.controller.App", {
		onInit: function () {
			var resourceBundle = this.getResourceBundle();
			var appStateModel = this.getAppStateModel();
			this.getView().setModel(appStateModel);
			//var x = this.getBookingOdataV4Model();
			this._init();
		},

		_init : function(){
			var that = this;

			var resourceBundle = this.getResourceBundle();
			var appStateModel = this.getAppStateModel();

			// load the security based profile 
			sap.ui.core.BusyIndicator.show(0);
			this.getAppProfile(function (profileModel) {
				sap.ui.core.BusyIndicator.hide();

				if (!!profileModel) {
					var profileModelData = profileModel.getData();
					if (!!profileModelData.scopes.DealerBooking) {
						appStateModel.setProperty('/visiblePA', false);
						
						that.getRouter().navTo("DealerBooking", {
							encodedKey: "NEW"
						}, true);
						

					} else {
						appStateModel.setProperty('/visiblePA', true);
						that.getRouter().navTo("SearchProgram", null, true);
						
					}

					// if (!!profileModelData.scopes.BookingAdmin) {
					// 	viewModel.setProperty('/readOnly', false );
					// }

					// appStateModel.setProperty('/division', profileModelData.userData.division);

				} else {
					sap.ui.core.BusyIndicator.hide();
					// error message 
					MessageBox.error(resourceBundle.getText('Message.error.system'));
					//TODO
				}
			});
		},
	});
});