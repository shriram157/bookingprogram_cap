sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	'sap/ui/model/json/JSONModel',
	"tci/wave2/ui/bookingProgram/model/models",
	"tci/wave2/ui/bookingProgram/controller/ErrorHandler"
], function (UIComponent, Device, JSONModel, models, ErrorHandler) {
	"use strict";

	var CONST_DEP_MODEL = "G_DepartmentModel";
	return UIComponent.extend("tci.wave2.ui.bookingProgram.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);
			// set the device model
			this.setModel(models.createDeviceModel(), "device");

			// Error ? 
			this._oErrorHandler = new ErrorHandler(this);
			// this pices 

			// initDepartmentListModel
			this.initDepartmentListModel(function (depData) {
			});

			// enable routing
			this.getRouter().initialize();
		},

		/**
		 * The component is destroyed by UI5 automatically.
		 * In this method, the ErrorHandler is destroyed.
		 * @public
		 * @override
		 */
		destroy: function () {
			this._oErrorHandler.destroy();
			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},

		/**
		 * This method can be called to determine whether the sapUiSizeCompact or sapUiSizeCozy
		 * design mode class should be set, which influences the size appearance of some controls.
		 * @public
		 * @return {string} css class, either 'sapUiSizeCompact' or 'sapUiSizeCozy' - or an empty string if no css class should be set
		 */
		getContentDensityClass: function () {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		},

		initDepartmentListModel: function (callback) {
			var that = this;

			var bModel = this.getModel("bookingOdataV2");

			var oFilters = [];
			oFilters[0] = new sap.ui.model.Filter("LANG", sap.ui.model.FilterOperator.EQ, "EN");

			var oSorters = [];
			oSorters[0] = sap.ui.model.Sorter("NAME", true);

			bModel.read("/DepartmentSet", {
				urlParameters: {},
				filters: oFilters,
				sorter: oSorters,
				success: function (oData, oResponse) {

					callback(that.setupDepartmentListModel(oData));
				},
				error: function (err) {
					callback(that.setupDepartmentListModel(null));
				}
			});
			// bModel.callFunction("/index", {
			// 	method: "GET",
			// 	success: function (data, response) {
			// 		console.log("FunctionImport index o/p: "+data.d.results[0].ERROR_DESC);
			// 		sap.m.MessageBox.show(data.d.results[0].ERROR_DESC, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
			// 			.MessageBox.Action.OK, null, null);
			// 	},
			// 	error: function (oData, oResponse) {
			// 		sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
			// 			.MessageBox.Action.OK, null, null);
			// 	}
			// });
		},

		setupDepartmentListModel: function (oData) {
			var bModel = new sap.ui.model.json.JSONModel();
			var aArray = [];
			if (!!oData && !!oData.results && oData.results.length > 0) {
				for (var x = 0; x < oData.results.length; x++) {
					aArray.push({
						key: oData.results[x].CODE,
						name: oData.results[x].NAME,
						code: oData.results[x].DEPART_CODE_EXT
					});
				}
				bModel.setData(aArray);
			}
			this.setModel(bModel, CONST_DEP_MODEL);
			return bModel;
		},

		getDepartmentModel: function (callback) {
			var depModel = this.getModel(CONST_DEP_MODEL);
			if (!!!depModel) {
				this.initDepartmentListModel(callback);
				//depModel = this.setupDepartmentListModel(null);
			}
			return callback(depModel);
		}
	});
});