/* global moment:true */
sap.ui.define([
	"tci/wave2/ui/bookingProgram/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"tci/wave2/ui/bookingProgram/model/formatter",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageToast"
], function (BaseController, MessageBox, JSONModel, formatter, Export, ExportTypeCSV, MessageToast) {
	"use strict";

	var CONT_PROGRAM_MODEL = "programModel";
	var CONST_VIEW_MODEL = "viewModel";

	return BaseController.extend("tci.wave2.ui.bookingProgram.controller.DealerBooking", {

		formatter: formatter,

		onInit: function () {
			// EST block - start
			this.clockServices();
			this.FilterValue1 = "";
			// Router - 
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("DealerBooking").attachPatternMatched(this._onObjectMatched, this);

			// Message manager 
			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			// register models
			var appStateModel = this.getAppStateModel();
			appStateModel.setProperty("/tabKey", "MB");
			this.getView().setModel(appStateModel);

			var viewState = this.getDefualtViewState();
			var viewModel = new JSONModel();
			// viewModel.setSizeLimit(15000);
			viewModel.setData(viewState);
			this.setModel(viewModel, CONST_VIEW_MODEL);

			var bookOModel = this.getBookingOdataV2Model();
			this.setModel(bookOModel, CONT_PROGRAM_MODEL);

			// object level attributes 
			this.draftInd = this.byId("draftInd");
			this.bookingStatus = this.byId("bookingStatus");

			this.includedCompleted = this.byId("includedCompleted");

			this.periodsTable = this.byId("idProductsTableHeader");
			this.getView().addStyleClass("sapUiSizeCompact");
		},

		/**
		 * will excute every time router works 
		 * */
		_onObjectMatched: function () {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			that.oSelectJSONModel = new sap.ui.model.json.JSONModel();
			that.oMasterJSONModel = new sap.ui.model.json.JSONModel();
			var masterData = {
				enableTiresize: false,
				enableVendor: true,
				enableSeries: false
			};
			that.oMasterJSONModel.setData(masterData);
			that.getView().setModel(that.oMasterJSONModel, "MasterModel");
			that.SearchOptionList = this.getView().byId("searchOptionList");
			sap.ui.getCore().setModel(that.oMasterJSONModel, "MasterModel");

			that.getView().setModel(that.oSelectJSONModel, "SelectJSONModel");
			sap.ui.getCore().setModel(that.oSelectJSONModel, "SelectJSONModel");
			that.oSelectJSONModel.getData().SearchOptionVal = "";
			/* Dummy JSON data */
			that.objList = {
				"SearchOptionsList": [{
					SearchText: resourceBundle.getText("Label.Vendor")
				}, {
					SearchText: resourceBundle.getText("Label.Vechicle.Series")
				}, {
					SearchText: resourceBundle.getText("Label.TireSize")
				}]
			};

			that.oSelectJSONModel.setData(that.objList);
			that.oSelectJSONModel.updateBindings();
			that.SearchOptionList.setSelectedKey(resourceBundle.getText("Vendor"));

			var appStateModel = this.getAppStateModel();
			appStateModel.setProperty("/tabKey", "MB");

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var selectCondotions = viewModel.getProperty("/selectCondotions");

			// load the security based profile 
			sap.ui.core.BusyIndicator.show(0);
			this.getAppProfile(function (profileModel) {
				sap.ui.core.BusyIndicator.hide();

				if (!!profileModel) {
					var profileModelData = profileModel.getData();
					that._profileDate = profileModelData;
					appStateModel.setProperty("/division", profileModelData.userData.division);

					// check the security, make the screen function accordingly
					if (!!profileModelData.scopes.DealerBooking) {
						selectCondotions.dealerEnabled = false;
						selectCondotions.dealerId = profileModelData.userData.dealerInfo.dealerBpId;
						selectCondotions.dealerCode = profileModelData.userData.dealerInfo.dealerCode;
						selectCondotions.dealerName = profileModelData.userData.dealerInfo.dealerName;
						selectCondotions.dealerType = profileModelData.userData.dealerInfo.dealerType;
					}
					viewModel.setProperty("/selectCondotions", selectCondotions);

				} else {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(resourceBundle.getText("Message.error.system"));
				}
			});
		},
		changeOptionPress: function (oEvt) {
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			var selectCondotions = viewModel.getProperty("/selectCondotions");
			var data = this.oMasterJSONModel.getData();
			var selectedOption = this.SearchOptionList.getSelectedKey();
			if (selectedOption == resourceBundle.getText("Label.Vendor")) {
				data.enableTiresize = false;
				data.enableVendor = true;
				data.enableSeries = false;
				this.loadVendorList(selectCondotions.programUUId);
			} else if (selectedOption == resourceBundle.getText("Label.TireSize")) {
				data.enableTiresize = true;
				data.enableVendor = false;
				data.enableSeries = false;
				this.loadTireSizeList(selectCondotions.programUUId);
			} else {
				data.enableTiresize = false;
				data.enableVendor = false;
				data.enableSeries = true;
				this.loadModelYearList(selectCondotions.programUUId);
			}
			this.oMasterJSONModel.setData(data);
			this.getView().setModel(this.oMasterJSONModel, "MasterModel");
			sap.ui.getCore().setModel(this.oMasterJSONModel, "MasterModel");

		},
		loadVendorList: function (programUUID) {
			var bModel = this.getBookingOdataV2Model();
			var langKey = this.getCurrentLanguageKey();
			var that = this;

			var oGlobalJSONModel = new sap.ui.model.json.JSONModel();
			that.getAllProgramVendorMini(programUUID, function (data) {
				var vendorArray = [],
					finalData = [];
				for (var i = 0; i < data.length; i++) {
					if (!vendorArray.includes(data[i].VENDOR_ID) && data[i].VENDOR_ID) {
						vendorArray.push(data[i].VENDOR_ID);
						var vendorData = {};
						vendorData.VENDOR_ID = data[i].VENDOR_ID;
						vendorData.VENDOR_DESC = data[i].VENDOR_DESC;
						/*
						if (langKey == "EN") {
							vendorData.VENDOR_DESC = data[i].EN_VENDOR_DESC;
						} else {
							vendorData.VENDOR_DESC = data[i].FR_VENDOR_DESC;

						}*/
						finalData.push(vendorData);
					}
				}
				var lastFinalData = {
					vendorData: finalData
				};
				oGlobalJSONModel.setSizeLimit(20000);
				oGlobalJSONModel.setData(lastFinalData);
				that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

			});
			/*var Filters = [];
			var filter = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUID);
			Filters.push(filter);
			var key = "/TireVendorDropDownSet";
			bModel.read(key, {
				filters: Filters,
				success: function (odata, response) {
					var vendorArray = [],
						finalData = [];
					var data = odata.results;
					for (var i = 0; i < data.length; i++) {
						if (!vendorArray.includes(data[i].VENDOR_ID) && data[i].VENDOR_ID) {
							vendorArray.push(data[i].VENDOR_ID);
							var vendorData = {};
							vendorData.VENDOR_ID = data[i].VENDOR_ID;
							if (langKey == "EN") {
								vendorData.VENDOR_DESC = data[i].EN_VENDOR_DESC;
							} else {
								vendorData.VENDOR_DESC = data[i].FR_VENDOR_DESC;

							}
							finalData.push(vendorData);
						}
					}
					var lastFinalData = {
						vendorData: finalData
					};
					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				},
				error: function (err) {
					console.log(err);
				}
			});*/
		},
		loadTireSizeList: function (programUUID) {
			//var bModel = this.getBookingOdataV2Model();
			var langKey = this.getCurrentLanguageKey();
			var that = this;
			var finalData = {};
			finalData.programUuid = programUUID;
			var oGlobalJSONModel = new sap.ui.model.json.JSONModel();
			that.getDistinctTiresizeList(finalData, function (data, ok) {

				var finalData = [];
				for (var i = 0; i < data.length; i++) {
					if (data[i].TIRESIZE) {
						var tireSize = {};
						tireSize.TIRESIZE = data[i].TIRESIZE;
						finalData.push(tireSize);
					}
				}
				var lastFinalData = {
					tireData: finalData
				};
				oGlobalJSONModel.setSizeLimit(20000);

				oGlobalJSONModel.setData(lastFinalData);
				that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

			});

			/*var oGlobalJSONModel = new sap.ui.model.json.JSONModel();
			var Filters = [];
			var filter = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUID);
			Filters.push(filter);
			var key = "/TireVendorDropDownSet";
			bModel.read(key, {
				filters: Filters,
				success: function (odata, response) {
					var tireData = [],
						finalData = [];
					var data = odata.results;
					for (var i = 0; i < data.length; i++) {
						if (!tireData.includes(data[i].TIRESIZE) && data[i].TIRESIZE) {
							tireData.push(data[i].TIRESIZE);
							var tireSize = {};
							tireSize.TIRESIZE = data[i].TIRESIZE;
							finalData.push(tireSize);
						}
					}
					var lastFinalData = {
						tireData: finalData
					};
					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				},
				error: function (err) {
					console.log(err);
				}
			});*/

		},
		loadModelYearList: function (programUUID) {
			var bModel = this.getBookingOdataV2Model();
			var langKey = this.getCurrentLanguageKey();
			var appStateModel = this.getAppStateModel();
			var division = appStateModel.getProperty("/division");
			var that = this;
			var userType = that._profileDate.userData.userType;
			if (userType === "National") {
				division = "";
			}
			var oGlobalJSONModel = new sap.ui.model.json.JSONModel();
			this.UUID = programUUID;
			var finalData = {};
			finalData.programUuid = programUUID;
			if (division !== "") {
				finalData.division = division;
				that.getDistinctSeriesYearListOfBrand(finalData, function (data, ok) {

					var finalData = [],
						seriesArray = [];

					for (var i = 0; i < data.length; i++) {
						if (!seriesArray.includes(data[i].SERIES_CODE) && data[i].SERIES_CODE) {
							seriesArray.push(data[i].SERIES_CODE);
							var seriesData = {};
							seriesData.SERIES_CODE = data[i].SERIES_CODE;
							if (langKey == "EN") {
								seriesData.SERIES_DESC = data[i].EN_SERIES_DESC;
							} else {
								seriesData.SERIES_DESC = data[i].FR_SERIES_DESC;

							}
							finalData.push(seriesData);

						}
					}
					var lastFinalData = {
						seriesData: finalData
					};
					oGlobalJSONModel.setSizeLimit(20000);

					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				});

			} else {
				that.getDistinctSeriesYearList(finalData, function (data, ok) {

					var finalData = [],
						seriesArray = [];

					for (var i = 0; i < data.length; i++) {
						if (!seriesArray.includes(data[i].SERIES_CODE) && data[i].SERIES_CODE) {
							seriesArray.push(data[i].SERIES_CODE);
							var seriesData = {};
							seriesData.SERIES_CODE = data[i].SERIES_CODE;
							if (langKey == "EN") {
								seriesData.SERIES_DESC = data[i].EN_SERIES_DESC;
							} else {
								seriesData.SERIES_DESC = data[i].FR_SERIES_DESC;

							}

							finalData.push(seriesData);

						}
					}
					var lastFinalData = {
						seriesData: finalData
					};
					oGlobalJSONModel.setSizeLimit(20000);

					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				});
			}
			/*var Filters = [];
			var filter = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUID);
			Filters.push(filter);
			var key = "/SeriesYearDropDown";
			bModel.read(key, {
				filters: Filters,
				success: function (odata, response) {
					var seriesArray = [],
						finalData = [];
					var data = odata.results;
					for (var i = 0; i < data.length; i++) {
						if (!seriesArray.includes(data[i].SERIES_CODE) && data[i].SERIES_CODE) {
							seriesArray.push(data[i].SERIES_CODE);
							var seriesData = {};
							seriesData.SERIES_CODE = data[i].SERIES_CODE;
							if (langKey == "EN") {
								seriesData.SERIES_DESC = data[i].EN_SERIES_DESC;
							} else {
								seriesData.SERIES_DESC = data[i].FR_SERIES_DESC;

							}
							finalData.push(seriesData);
						}
					}
					var lastFinalData = {
						seriesData: finalData
					};

					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				},
				error: function (err) {
					console.log(err);
				}
			});*/
		},
		onSeriesChange: function (oEvt) {
			var seriesCode = oEvt.getSource().getSelectedKey();
			var bModel = this.getBookingOdataV2Model();
			var langKey = this.getCurrentLanguageKey();
			var appStateModel = this.getAppStateModel();
			var division = appStateModel.getProperty("/division");
			var that = this;
			var userType = that._profileDate.userData.userType;
			if (userType === "National") {
				division = "";
			}

			var finalData = {};
			finalData.programUuid = this.UUID;

			var oGlobalJSONModel = that.getView().getModel("GlobalJSONModel");
			var seriesData = oGlobalJSONModel.getData().seriesData;
			var lastFinalData = {
				seriesData: seriesData,
				yearData: ""
			};
			this.getView().byId("YearCombo").setSelectedKey("");

			oGlobalJSONModel.setData(lastFinalData);
			that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");
			if (division !== "") {
				finalData.division = division;

				that.getDistinctSeriesYearListOfBrand(finalData, function (data, ok) {

					var finalData = [];

					for (var i = 0; i < data.length; i++) {
						if (seriesCode == data[i].SERIES_CODE) {
							if (data[i].YEAR) {
								var year = {};
								year.YEAR = data[i].YEAR;
								//finalData.push(year);
								finalData.push(year);

							}
						}
					}
					var lastFinalData = {
						seriesData: seriesData,
						yearData: finalData
					};
					oGlobalJSONModel.setSizeLimit(20000);

					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				});
			} else {
				that.getDistinctSeriesYearList(finalData, function (data, ok) {

					var finalData = [];

					for (var i = 0; i < data.length; i++) {
						if (seriesCode == data[i].SERIES_CODE) {
							if (data[i].YEAR) {
								var year = {};
								year.YEAR = data[i].YEAR;
								//finalData.push(year);

								finalData.push(year);

							}
						}
					}
					var lastFinalData = {
						seriesData: seriesData,
						yearData: finalData
					};
					oGlobalJSONModel.setSizeLimit(20000);

					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				});
			}
			/*var aFilters = [];
			var filter1 = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, this.UUID);
			aFilters.push(filter1);
			var filter2 = new sap.ui.model.Filter("SERIES_CODE", sap.ui.model.FilterOperator.EQ, seriesCode);
			aFilters.push(filter2);
			var key = "/SeriesYearDropDown";
			bModel.read(key, {
				filters: aFilters,
				success: function (odata, response) {
					var yearData = [],
						finalData = [];
					var data = odata.results;
					for (var i = 0; i < data.length; i++) {
						if (!yearData.includes(data[i].YEAR) && data[i].YEAR) {
							yearData.push(data[i].YEAR);
							var year = {};
							year.YEAR = data[i].YEAR;
							finalData.push(year);
						}
					}
					var lastFinalData = {
						seriesData: seriesData,
						yearData: finalData
					};

					oGlobalJSONModel.setData(lastFinalData);
					that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

				},
				error: function (err) {
					console.log(err);
				}
			});*/

		},
		getDefualtViewState: function () {
			var viewState = {
				filteredItems: 0,
				filterPanelEnable: true,
				contHigh: "60%",

				dynamicHeader: [{
					title: "112017",
					enable: true
				}, {
					title: "122017",
					enable: true
				}, {
					title: "012018",
					enable: true
				}, {
					title: "022018",
					enable: true
				}, {
					title: "032018",
					enable: true
				}, {
					title: "042018",
					enable: true
				}],

				currentDetailTab: "",
				selectCondotions: {
					dealerId: "",
					dealerCode: "",
					dealerName: "",
					dealerType: "01",
					dealerEnabled: true,
					completedOk: false,
					programId: "",
					programUUId: "",
					programName: "",
					programDepartment: "",
					currentDept: "D002"
				},

				currentBooking: {
					editable: true,
					actionable: true,
					loaded: false,

					filters: {

						bp: {
							categories: [],
							vendors: [],
							parts: [{
								key: "PPB",
								selected: false
							}, {
								key: "PPP",
								selected: false
							}, {
								key: "PCB",
								selected: false
							}, {
								key: "PNC",
								selected: false
							}]
						},

						ds: {
							categories: []
						},

					},

					status: 0,
					summary: {},
					partsBookingsTotal: 0,
					partsBookings: [],

					categorySchedules: [],
					categorySchedulesLoaded: false
				},

				sortDescending: false,
				sortKey: "TCI_order_no",
				orders: [],
				filterAll: true,
				filterAllx: true
			};
			return viewState;
		},

		onDSilter: function (oEvent) {
			if (!this._oDsdDialog) {
				this._oDsDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.DsFilterDialog", this);
				this.getView().addDependent(this._oDsDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDsDialog);
			this._oDsDialog.open();
		},

		onBPfilter: function (oEvent) {
			if (!this._oBpDialog) {
				this._oBpDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.BpFilterDialog", this);
				this.getView().addDependent(this._oBpDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oBpDialog);
			this._oBpDialog.open();
		},

		// will be called by timer 
		updatePageStatus: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			if (!!currentBooking && !!currentBooking.loaded) {
				this.setBookingStatus();
			}
		},

		onExit: function () {
			if (this._oAddressDialog) {
				this._oAddressDialog.destroy();
			}
		},

		partClicked: function (oEvent) {
			var that = this;
			var partNum = oEvent.getSource().getTitle();
			var dialog = this._get_oModelYearDialog();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");

			this.getPartFitments(currentBooking.summary.programUUId, partNum, function (fitmentList) {
				if (!!fitmentList) {
					dialog.getModel().setProperty("/fitmentList", fitmentList);

				} else {
					dialog.getModel().setProperty("/fitmentList", []);

				}
				jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), dialog);
				dialog.open();
			});
		},

		onPartFitmentDialogCancel: function (oEvent) {
			if (!!this._get_oModelYearDialog()) {
				this._get_oModelYearDialog().close();
			}
		},

		onUpdatePBFinished: function (oEvent) {
			// recalculate the total. 
			var binding = oEvent.getSource().getBinding("items");
			var contexts = binding.getContexts();
			var newTotal = 0;
			var aValue = null;
			if (contexts && contexts.length > 0) {
				for (var x = 0; x < contexts.length; x++) {
					aValue = contexts[x].getProperty("total");
					if (aValue) {
						newTotal = newTotal + Number(aValue);
					}
				}
			}
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			viewModel.setProperty("/currentBooking/partsBookingsTotal", newTotal);

		},

		updateDealerFinished: function (oEvent) { },

		handleAddressSearch: function (oEvent) {
			var bookOModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();

			var sValue = oEvent.getParameter("value");
			var oFilters = [];
			var oFilter1 = new sap.ui.model.Filter("DEL_LOCATION_NAME", sap.ui.model.FilterOperator.Contains, sValue);
			oFilters.push(this._oAddressDialogBaseFilter);
			oFilters.push(oFilter1);
			var oFilter2 = new sap.ui.model.Filter("DEL_ADDRESS1", sap.ui.model.FilterOperator.Contains, sValue);
			oFilters.push(oFilter2);
			var oFilter3 = new sap.ui.model.Filter("DEL_ADDRESS2", sap.ui.model.FilterOperator.Contains, sValue);
			oFilters.push(oFilter3);
			var oFilter4 = new sap.ui.model.Filter("DEL_CITY", sap.ui.model.FilterOperator.Contains, sValue);
			oFilters.push(oFilter4);
			var oFilter5 = new sap.ui.model.Filter("DEL_POSTAL_CODE", sap.ui.model.FilterOperator.Contains, sValue);
			oFilters.push(oFilter5);
			var oFilter6 = new sap.ui.model.Filter("DEL_PHONE_NUMBER", sap.ui.model.FilterOperator.Contains, sValue);
			oFilters.push(oFilter6);
			var oFilter7 = new sap.ui.model.Filter(oFilters, false);
			var mainFilter = [];
			mainFilter.push(oFilter7);
			/*var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);*/
			var that = this;
			var key = "/ProgramDeliveryLocationLangSet";
			bookOModel.read(key, {
				urlParameters: {

					"$skip": 0,
					"$top": 100
				},
				filters: mainFilter,
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel(oData.results);
					that._oAddressDialog.setModel(JSONModel);

				},
				error: function (err) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					that._oAddressDialog.setModel(JSONModel);

					//sap.ui.core.BusyIndicator.hide();
					console.log(err);
				}
			});

		},

		handleAddressClose: function (oEvent) {
			if (oEvent.getId() === "confirm") {
				var sPath = oEvent.getParameter("selectedContexts")[0].getPath();
				var sData = oEvent.getParameter("selectedContexts")[0].getModel().getProperty(sPath);

				var xPath = this._oAddressDialogSPath;
				var viewModel = this.getModel(CONST_VIEW_MODEL);
				var iData = viewModel.getProperty(xPath);

				if (!!iData) {
					iData.deliveryLocation = sData.OBJECT_KEY;
					iData.deliveryLocationDetail = sData;
					viewModel.setProperty(xPath, iData);

					this.saveDeliverySchedule(iData);
				}
			}
			this._oAddressDialogSPath = "";
			this._oAddressDialogBaseFilter = null;
			this._oAddressDialog.setModel(null);
		},

		_get_oCpProgramSelectDialog: function () {
			if (!this._oCpProgramSelectDialog) {
				this._oCpProgramSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.CpProgramSelectDialog", this);
				this._oCpProgramSelectDialog.setModel(this.getBookingOdataV2Model());
				//this._oCpProgramSelectDialog.getBinding("items").attachChange(this.updateCpProgramFinished, this);
				this.getView().addDependent(this._oCpProgramSelectDialog);
				this._oCpProgramSelectDialog.setGrowing(true);
				this._oCpProgramSelectDialog.setGrowingThreshold(20);
			}
			return this._oCpProgramSelectDialog;
		},

		_get_oModelYearDialog: function () {
			if (!this._oModelYearDialog) {
				this._oModelYearDialog = sap.ui.xmlfragment(this.getView().getId(),
					"tci.wave2.ui.bookingProgram.view.fragments.PartFitmentDialog", this);
				this._oModelYearDialog.setModel(new JSONModel({
					fitmentList: []
				}));

				this._oModelYearDialog.setContentWidth("400px");
				this.getView().addDependent(this._oModelYearDialog);
			}
			return this._oModelYearDialog;
		},

		_get_oDealerSelectDialog: function () {
			if (!this._oDealerSelectDialog) {
				this._oDealerSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.DealerSelectDialog", this);
				this._oDealerSelectDialog.setModel(this.getBPModel());
				//this._oDealerSelectDialog.getBinding("items").attachChange(this.updateDealerFinished, this);
				this.getView().addDependent(this._oDealerSelectDialog);
				this._oDealerSelectDialog.setGrowing(true);
				this._oDealerSelectDialog.setGrowingThreshold(20);
			}
			return this._oDealerSelectDialog;
		},

		handleProgramSearchPress: function (oEvent) {
			var that = this;
			var lvAddress = null;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var selectCondotions = viewModel.getProperty("/selectCondotions");
			if (!!!selectCondotions.dealerId) {
				MessageBox.warning(resourceBundle.getText("Message.error.nodelaer"));
				return false;
			}
			var lvStatusCode = "OX";

			if (!!this.includedCompleted.getSelected()) {
				lvStatusCode = "OE";
			}
			this.SearchOptionList.setSelectedKey(resourceBundle.getText("Label.Vendor"));
			this.SearchOptionList.setEnabled(false);

			var masterData = {
				enableTiresize: false,
				enableVendor: true,
				enableSeries: false
			};
			that.oMasterJSONModel.setData(masterData);
			that.getView().setModel(that.oMasterJSONModel, "MasterModel");

			this.getView().byId("VendorSearchCombo").setEnabled(false);
			this.getView().byId("TiresizeSearchCombo").setEnabled(false);
			this.getView().byId("SeriesCombo").setEnabled(false);
			this.getView().byId("YearCombo").setEnabled(false);
			// load the dealer details 
			var dialog = this._get_oCpProgramSelectDialog();
			var binding = dialog.getBinding("items");
			this.getBusinessPartnersByDealerBP(selectCondotions.dealerId, function (oData) {
				if (!!oData) {
					selectCondotions.dealerId = oData.BusinessPartner;
					selectCondotions.dealerCode = oData.SearchTerm2;
					selectCondotions.dealerName = oData.BusinessPartnerName;
					selectCondotions.dealerType = "01";
					if (!!oData.to_Customer && !!oData.to_Customer.Attribute1) {
						if (oData.to_Customer.Attribute1 === "01" || // toyota
							oData.to_Customer.Attribute1 === "02" || // lexus
							oData.to_Customer.Attribute1 === "03" || // dual 
							oData.to_Customer.Attribute1 === "04") { // land cruiser - as toyota
							selectCondotions.dealerType = oData.to_Customer.Attribute1;
						}
					}
					//
					var lvBrand = "AL";
					if (selectCondotions.dealerType === "04" || selectCondotions.dealerType === "01") {
						lvBrand = "10";
					} else if (selectCondotions.dealerType === "02") {
						lvBrand = "20";
					}
					// dealer address 
					selectCondotions.dealerAddress = null;
					if (!!oData.to_BusinessPartnerAddress && !!oData.to_BusinessPartnerAddress.results && oData.to_BusinessPartnerAddress.results.length >
						0) {
						lvAddress = oData.to_BusinessPartnerAddress.results[0];
						selectCondotions.dealerAddress = {};
						selectCondotions.dealerAddress.addressUUID = lvAddress.AddressUUID;
						selectCondotions.dealerAddress.addressId = lvAddress.AddressID;
						selectCondotions.dealerAddress.address1 = lvAddress.StreetName;
						selectCondotions.dealerAddress.address2 = lvAddress.HouseNumber;
						selectCondotions.dealerAddress.addressName = lvAddress.FormOfAddress;
						selectCondotions.dealerAddress.city = lvAddress.CityName;
						selectCondotions.dealerAddress.zip = lvAddress.PostalCode;
						selectCondotions.dealerAddress.province = lvAddress.Region;
						selectCondotions.dealerAddress.city = lvAddress.CityName;
						if (!!lvAddress.to_PhoneNumber && !!lvAddress.to_PhoneNumber.results && lvAddress.to_PhoneNumber.results.length > 0) {
							selectCondotions.dealerAddress.phone = lvAddress.to_PhoneNumber.results[0].PhoneNumber;
						}
					}
					viewModel.setProperty("/selectCondotions", selectCondotions);

					//	var key = "/ProgramSearchInput(IN_LANG='" + that.getCurrentLanguageKey() + "',IN_STATUS='" + lvStatusCode + "',IN_BRAND='" +
					//		lvBrand + "')/Programs";

					//binding.sPath = key + "/Programs";
					var key = "/ProgramSearchSetS(IN_LANG='" + that.getCurrentLanguageKey() + "',IN_STATUS='" + lvStatusCode + "',IN_BRAND='" +
					lvBrand + "')/Set";//"/ProgramSearchSet(IN_LANG='" + that.getCurrentLanguageKey() + "')/Set";
					var filters = [];
					filters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.Contains, lvStatusCode));
					filters.push(new sap.ui.model.Filter("BRAND", sap.ui.model.FilterOperator.Contains, lvBrand));
					// binding.filter(filters);
					binding.sPath = key;
					binding.refresh();
					//binding.filter(filters);
					// //sort by key 
					var aSorters = [];
					aSorters.push(new sap.ui.model.Sorter("PROGRAM_ID", false));
					binding.sort(aSorters);
					var aFilters = [],
						mainFilter = [];
					if (!selectCondotions.dealerEnabled) {
						if (lvStatusCode !== "OE") {
							var Filter1 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'FT'");
							aFilters.push(Filter1);
							var Filter2 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'CP'");
							aFilters.push(Filter2);
							var Filter3 = new sap.ui.model.Filter({
								filters: aFilters,
								and: true
							});
							mainFilter.push(Filter3);
						} else {
							var Filter1 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'FT'");
							mainFilter.push(Filter1);
						}
					} else {
						if (lvStatusCode !== "OE") {
							var Filter2 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'CP'");
							mainFilter.push(Filter2);

						} else {
							binding.filter([]);
						}
					}
					binding.filter(mainFilter);
					//binding.sort(); //refresh();
					jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), dialog);
					dialog.open();

				} else {
					MessageBox.warning(resourceBundle.getText("Message.error.nodelaer"));
					return false;

				}
			});
		},

		handleProgramDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var resourceBundle = this.getResourceBundle();

			var selectCondotions = viewModel.getProperty("/selectCondotions");

			if (!!oSelectedItem) {
				var bModel = oSelectedItem.getParent().getModel();
				var path = oSelectedItem.getParent().getSelectedContextPaths()[0];
				var data = bModel.getProperty(path);
				selectCondotions.programId = data.PROGRAM_ID; //oSelectedItem.getTitle();
				selectCondotions.programUUId = data.PROGRAM_UUID;
				this.SearchOptionList.setEnabled(true);
				this.SearchOptionList.setSelectedKey(resourceBundle.getText("Label.Vendor"));
				this.getView().byId("VendorSearchCombo").setEnabled(true);
				this.getView().byId("TiresizeSearchCombo").setEnabled(true);
				this.getView().byId("SeriesCombo").setEnabled(true);
				this.getView().byId("YearCombo").setEnabled(true);
				this.loadVendorList(selectCondotions.programUUId);
				//newLine[0].partDesc = oSelectedItem.getDescription();
			}
			viewModel.setProperty("/selectCondotions", selectCondotions);
		},

		handleProgramSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oBinding = oEvent.getSource().getBinding("items");

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var selectCondotions = viewModel.getProperty("/selectCondotions");

			var lvStatusCode = "OX";
			if (!!this.includedCompleted.getSelected()) {
				lvStatusCode = "OE";
			}
			var lvBrand = "AL";
			if (selectCondotions.dealerType === "04" || selectCondotions.dealerType === "01") {
				lvBrand = "10";
			} else if (selectCondotions.dealerType === "02") {
				lvBrand = "20";
			}
			//Devika updating filters on 03-01-2024

			var key = null;
			if (!!sValue) {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + lvStatusCode + "',IN_BRAND='" +
				// 	lvBrand + "',IN_PNUM='" + sValue + "')/Programs";
				key = "/ProgramSearchSetP(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + lvStatusCode + "',IN_BRAND='" +
					lvBrand + "',IN_PNUM='" + sValue + "')/Set";
				

			} else {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + lvStatusCode + "',IN_BRAND='" +
				// 	lvBrand + "')/Programs";
				key = "/ProgramSearchSetS(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + lvStatusCode + "',IN_BRAND='" +
					lvBrand + "')/Set";
				

			}

			oBinding.sPath = key;
			oBinding.refresh();

			//sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("PROGRAM_ID", false));
			oBinding.sort(aSorters);
			var aFilters = [],
				mainFilter = [];
			// mainFilter.push(aFilters1);
			if (!selectCondotions.dealerEnabled) {
				if (lvStatusCode !== "OE") {
					var Filter1 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'FT'");
					aFilters.push(Filter1);
					var Filter2 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'CP'");
					aFilters.push(Filter2);
					var Filter3 = new sap.ui.model.Filter({
						filters: aFilters,
						and: true
					});
					mainFilter.push(Filter3);
				} else {
					var Filter1 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'FT'");
					mainFilter.push(Filter1);
				}
			} else {
				if (lvStatusCode !== "OE") {
					var Filter2 = new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.NE, "'CP'");
					mainFilter.push(Filter2);

				} else {
					oBinding.filter([]);
				}
			}
			oBinding.filter(mainFilter);
		},

		handleAddressDialogPress: function (oEvent) {
			var bookOModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();

			if (!this._oAddressDialog) {
				this._oAddressDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.AddressSelectionDialog", this);
				// check growing
				// this._oAddressDialog.setModel(bookOModel);
				this._oAddressDialog.setGrowing(true);
				this.getView().addDependent(this._oAddressDialog);
			}

			// get the data 
			var lvPath = oEvent.getSource().getParent().getBindingContext("viewModel").sPath;
			this._oAddressDialogSPath = lvPath;

			var lvData = oEvent.getSource().getParent().getBindingContext("viewModel").getProperty(lvPath);
			var lvTitle = resourceBundle.getText("Label.Address.Selection.Title", [lvData.vendorDesc]);
			var aFilters = [];
			aFilters[0] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());
			aFilters[1] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, lvData.PROGRAM_UUID);
			this._oAddressDialog.setTitle(lvTitle);
			var vendor = "";
			if (!!!lvData.deliveryMethod) {
				MessageBox.warning(resourceBundle.getText("Message.error.no.delivery.method"));
				return false;
			} else {
				if (lvData.deliveryMethod === "DM00001") { // D2D
					return false; // should not happen 
				} else {
					if (lvData.deliveryMethod === "DM00002") {
						aFilters[2] = new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.EQ, lvData.vendor);
						vendor = lvData.vendor;
					} else {
						aFilters[2] = new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.EQ, lvData.deliveryMethod);
						vendor = lvData.deliveryMethod;

					}
					this._oAddressDialogBaseFilter = aFilters;
				}
			}

			/*this._oAddressDialog.getBindingInfo("items").filters = aFilters;
			var theBinding = this._oAddressDialog.getBinding("items");
			this._oAddressDialog.setModel(bookOModel);
			theBinding.filter();
			*/
			var that = this;

			this.getAllProgramDeliveryLocations(lvData.PROGRAM_UUID, vendor, function (data) {
				var JSONModel = new sap.ui.model.json.JSONModel();
				JSONModel.setSizeLimit(2000000);
				JSONModel.setData(data);
				that._oAddressDialog.setModel(JSONModel);

			});

			this._oAddressDialog.open();
		},

		setBookingStatus: function () {
			// will set the editable as well
			var isChangable = false;
			var aday = 86400000;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var resourceBundle = this.getResourceBundle();

			var currentLD = (new Date()).getTime();
			var startLD = currentBooking.summary.openDate.getTime();
			var endLD = currentBooking.summary.closeDate.getTime();
			var pStatus = currentBooking.summary.status;
			var profileModelData = this._profileDate;
			this.bookingStatus.setProperty("state", "None");

			if (!!pStatus && pStatus === "CP") {
				this.bookingStatus.setProperty("text", resourceBundle.getText("Message.status.completed"));
				//isChangable = true; // test code
			} else {
				if (currentLD < startLD) { //start of starting date
					// future
					isChangable = false;
					this.bookingStatus.setProperty("text", resourceBundle.getText("Message.status.future"));
				} else if (currentLD >= endLD + aday) { // end of end day
					isChangable = false;
					this.bookingStatus.setProperty("text", resourceBundle.getText("Message.status.closed"));
					if (!!profileModelData.scopes.BookingAdmin && (profileModelData.userData.department === currentBooking.summary.department)) {
						if (currentBooking.summary.confirmed) {
							isChangable = false;
						} else {
							isChangable = true;
						}
					} else {
						isChangable = false;
					}

				} else {

					// open 
					var remain = endLD - currentLD;
					remain = Math.floor(remain / 24 / 60 / 60 / 1000) + 2;
					this.bookingStatus.setProperty("text", resourceBundle.getText("Message.status.remain", [remain]));
					if (currentBooking.summary.finalWarn >= remain) {
						// red 
						this.bookingStatus.setProperty("state", "Error");
					} else if (currentBooking.summary.initWarn >= remain) {
						// warning
						this.bookingStatus.setProperty("state", "Warning");
					} else {
						this.bookingStatus.setProperty("state", "Success");
					}

					if (currentBooking.summary.confirmed) {
						isChangable = false;
					} else {
						isChangable = true;
					}
				}

			}

			viewModel.setProperty("/currentBooking/editable", isChangable);
		},

		onDsConfirmViewSettingsDialog: function (oEvevnt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");

			var mParams = oEvevnt.getParameters();
			var oBinding = this.byId("dsList").getBinding("items");
			var sPath;
			var bDescending;
			var vGroup;
			var aSorters = [];
			if (mParams.groupItem) {
				sPath = mParams.groupItem.getKey();
				bDescending = mParams.groupDescending;
				vGroup = this.mGroupFunctions[sPath];
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending, vGroup));
			}

			if (mParams.sortItem) {
				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			}
			oBinding.sort(aSorters);

			var aFilters = [];
			var filter = null;
			var xFilters = [];
			var lvFa = currentBooking.filters.ds.category;
			for (var i = 0; i < lvFa.length; i++) {
				// console.log("i",i);
				if (lvFa[i].selected) {
					// filter = new sap.ui.model.Filter("category", sap.ui.model.FilterOperator.EQ, lvFa[i].key);
					aFilters.push(new sap.ui.model.Filter("category", sap.ui.model.FilterOperator.EQ, lvFa[i].key));
				}
				// console.log("aFilters", aFilters);
				// aFilters.push(filter);
			}
			if (aFilters && aFilters.length > 0) {
				filter = new sap.ui.model.Filter(aFilters, false);
				xFilters.push(filter);
			}

			// update list binding
			var binding = this.byId("dsList").getBinding("items");
			binding.filter(xFilters, "Application");

		},

		onConfirmBooking: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var conditions = viewModel.getProperty("/selectCondotions");
			var resourceBundle = this.getResourceBundle();
			var hasError = false;

			var schedules = viewModel.getProperty("/currentBooking/categorySchedules");

			//2307
			// 			var schedulesValidate = schedules.slice();
			// 			// if both the delivery location and delivery method are blank ignore the record for validation. 
			// 			// the assumption here is they are not selected from teh drop down. 

			// 				for (var i = 0; i < schedulesValidate.length; i++) {
			// 					if (schedulesValidate[i].deliveryLocation == "" && schedulesValidate[i].deliveryMethod == ""){
			// 					schedulesValidate.splice(i, 1);	// dont consider this record. 
			// 					}
			// 				}

			// // and then check for this error

			//               if (!!schedulesValidate && schedulesValidate.length > 0) {
			//               	for (var i = 0; i < schedulesValidate.length; i++) {
			//               		if (!!!schedulesValidate[i].deliveryLocation && schedulesValidate[i].deliveryMethod!=="DM00001") {
			//               			hasError = true;
			//               		}

			//               	}

			// error check currentBooking.categorySchedules[i].delDetailList
			if (!!schedules && schedules.length > 0) {
				for (var i = 0; i < schedules.length; i++) {
					for (var j = 0; j < schedules[i].delDetailList.length; j++) {

						if (schedules[i].delDetailList[j].deliveryWeek === "" || schedules[i].delDetailList[j].deliveryWeek === '01-01-1900') {
							hasError = true;
						}
					}
					if (schedules[i].deliveryLocation === "" && schedules[i].deliveryMethod === "") {
						hasError = true;
					}

					// if (schedules[i].deliveryLocation !== "" && schedules[i].deliveryMethod == "DM00001") {
					// 	hasError = true;
					// }
					if ((schedules[i].deliveryMethod !== "" && schedules[i].deliveryMethod !== "DM00001") && schedules[i].deliveryLocation == "") {
						hasError = true;
					}

				}

			} else {
				hasError = true;
			}

			if (hasError) {
				MessageBox.error(resourceBundle.getText("Message.error.no.delAddress"));
				return false;
			}

			var xKey = {};
			xKey.PROGRAM_UUID = currentBooking.summary.programUUId;
			xKey.DEALER_CODE = currentBooking.summary.dealerId;
			xKey.DEALER_CODE_S = conditions.dealerCode;
			that.draftInd.showDraftSaving();
			this.confirmBookingProgram(xKey, true, function (xObj, isOk) {
				if (!!isOk) {
					viewModel.setProperty("/currentBooking/summary/confirmed", true);
					that.draftInd.showDraftSaved();
				}
			});
		},

		onReOpenBooking: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var conditions = viewModel.getProperty("/selectCondotions");

			var xKey = {};
			xKey.PROGRAM_UUID = currentBooking.summary.programUUId;
			xKey.DEALER_CODE = currentBooking.summary.dealerId;
			xKey.DEALER_CODE_S = conditions.dealerCode;
			that.draftInd.showDraftSaving();
			this.confirmBookingProgram(xKey, false, function (xObj, isOk) {
				if (!!isOk) {
					viewModel.setProperty("/currentBooking/summary/confirmed", false);
					that.draftInd.showDraftSaved();
				}
			});
		},

		onClearBooking: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var conditions = viewModel.getProperty("/selectCondotions");
			this.SearchOptionList.setEnabled(false);
			this.SearchOptionList.setSelectedKey(resourceBundle.getText("Label.Vendor"));
			this.SearchOptionList.fireSelectionChange();
			this.getView().byId("VendorSearchCombo").setEnabled(false);

			var oGlobalJSONModel = this.getView().getModel("GlobalJSONModel");

			var lastFinalData = {
				vendorData: ""
			};
			oGlobalJSONModel.setData(lastFinalData);
			that.getView().setModel(oGlobalJSONModel, "GlobalJSONModel");

			var resourceBundle = this.getResourceBundle();
			if (!!conditions.dealerEnabled) {
				conditions.dealerId = "";
				conditions.dealerCode = "";
				conditions.dealerName = "";
			}

			conditions.programId = "";
			conditions.programUUId = "";
			conditions.programName = "";
			conditions.programDepartment = "";

			viewModel.setProperty("/currentBooking/loaded", false);
			viewModel.setProperty("/currentBooking/categorySchedules", []);
			viewModel.setProperty("/currentBooking/categorySchedulesLoaded", false);
			viewModel.setProperty("/currentDetailTab", "");
			viewModel.setProperty("/selectCondotions", conditions);

		},

		onChangeF0: function (oEvent) {
			var lvValue = oEvent.getParameter("value");
			var lvPath = oEvent.getSource().getParent().getBindingContextPath();
			if (!!lvValue) {
				this.onDelValueChange(0, lvValue, lvPath);
			}
		},

		onChangeF1: function (oEvent) {
			var lvValue = oEvent.getParameter("value");
			var lvPath = oEvent.getSource().getParent().getBindingContextPath();
			if (!!lvValue) {
				this.onDelValueChange(1, lvValue, lvPath);
			}
		},

		onChangeF2: function (oEvent) {
			var lvValue = oEvent.getParameter("value");
			var lvPath = oEvent.getSource().getParent().getBindingContextPath();
			if (!!lvValue) {
				this.onDelValueChange(2, lvValue, lvPath);
			}
		},

		onChangeF3: function (oEvent) {
			var lvValue = oEvent.getParameter("value");
			var lvPath = oEvent.getSource().getParent().getBindingContextPath();
			if (!!lvValue) {
				this.onDelValueChange(3, lvValue, lvPath);
			}
		},

		onChangeF4: function (oEvent) {
			var lvValue = oEvent.getParameter("value");
			var lvPath = oEvent.getSource().getParent().getBindingContextPath();
			if (!!lvValue) {
				this.onDelValueChange(4, lvValue, lvPath);
			}
		},

		onChangeF5: function (oEvent) {
			var lvValue = oEvent.getParameter("value");
			var lvPath = oEvent.getSource().getParent().getBindingContextPath();
			if (!!lvValue) {
				this.onDelValueChange(5, lvValue, lvPath);
			}
		},

		onDelValueChange: function (index, value, sPath) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var iBookingParts = viewModel.getProperty("/currentBooking/partsBookings");
			var grandTotal = viewModel.getProperty("/currentBooking/partsBookingsTotal");
			var iBookingItme = viewModel.getProperty(sPath);
			var ids = {};
			if (!!currentBooking.periods && (currentBooking.periods.length - 1) >= index) {
				this.draftInd.showDraftSaving();
				ids.PROGRAM_UUID = currentBooking.summary.programUUId;
				//ids.DEPART = currentBooking.summary.department;
				ids.DEALER_CODE = iBookingItme.dealerCode;
				ids.DEALER_CODE_S = viewModel.getProperty("/selectCondotions/dealerCode");
				ids.DEALER_NAME = viewModel.getProperty("/selectCondotions/dealerName");
				ids.PART_NUM = iBookingItme.partNumber;
				ids.VENDOR_ID = iBookingItme.vendorId;
				ids.CATEGORY_ID = iBookingItme.categoryId;
				ids.MMYYYY = currentBooking.periods[index].name;
				ids.PERIOD_DT = currentBooking.periods[index].startDate;
				ids.ORDER_QTY = value;
				ids.CHANGED_BY = that.getUserId();
				this.savePartsPeriodDate(ids, function (aData) {
					// update the calculation
					var lvTotal = iBookingItme.F0 + iBookingItme.F1 + iBookingItme.F2 + iBookingItme.F3 + iBookingItme.F4 + iBookingItme.F5;

					grandTotal = grandTotal - iBookingItme.total + lvTotal;
					iBookingItme.total = lvTotal;
					var iCatV = true;
					var iCatVIndex = 0;
					var i = 0;
					that._aCategoryVisible.forEach(function (obj) {

						if (obj.categoryId === ids.CATEGORY_ID && obj.vendorId === ids.VENDOR_ID) {
							iCatV = false;
							iCatVIndex = i;
						}
						i = i + 1;

					});

					if (iCatV === true && lvTotal > 0) {
						that._aCategoryVisible.push({
							"categoryId": ids.CATEGORY_ID,
							"vendorId": ids.VENDOR_ID
						});
					} else {
						if (lvTotal === 0 && iCatV === false) {

							that._aCategoryVisible.splice(iCatVIndex, 1);
						}

					}
					that.draftInd.showDraftSaved();
					viewModel.setProperty(sPath, iBookingItme);
					viewModel.setProperty("/currentBooking/partsBookingsTotal", grandTotal);
				});
			}
		},

		onDelMethodChange: function (oEvent) {
			var sPath = oEvent.getSource().getParent().getParent().getParent().getBindingContextPath("viewModel");
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var iLine = viewModel.getProperty(sPath);
			var selectedKey = oEvent.getParameter("selectedItem").getKey();
			if (!!selectedKey) {
				// if (!!!iLine.delMethodList[0].key) {
				// 	iLine.delMethodList.shift();
				// 	// viewModel.setProperty(sPath, iLine);
				// }
				if (selectedKey === "DM00001") {
					// Changed on June 8th -Fix  - If DTD  No Delivery Address //
					/*if (!!currentBooking.summary.dealerAddress) {
						iLine.deliveryLocation = currentBooking.summary.dealerAddress.OBJECT_KEY;
						iLine.deliveryLocationDetail = currentBooking.summary.dealerAddress;
					} else {*/
					iLine.deliveryLocation = "";
					iLine.deliveryLocationDetail = {};
					//MessageBox.error(resourceBundle.getText("Message.error.nodelaer.address"));
					//}
					iLine.deliveryLocationEnable = false;
				} else {
					iLine.deliveryLocationEnable = true;
					iLine.deliveryLocation = "";
					iLine.deliveryLocationDetail = {};
				}
			} else {
				iLine.deliveryLocationEnable = true;
				iLine.deliveryLocation = "";
				iLine.deliveryLocationDetail = {};
			}
			viewModel.setProperty(sPath, iLine);
			this.saveDeliverySchedule(iLine);
		},

		onDelLocChange: function (oEvent) {
			var sPath = oEvent.getSource().getParent().getParent().getParent().getBindingContextPath("viewModel");

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var iLine = viewModel.getProperty(sPath);
			this.saveDeliverySchedule(iLine);

		},

		onSpInfoChange: function (oEvent) {
			var sPath = oEvent.getSource().getParent().getParent().getParent().getBindingContextPath("viewModel");

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var iLine = viewModel.getProperty(sPath);
			this.saveDeliverySchedule(iLine);
		},

		saveDeliverySchedule: function (iLine) {
			// prepare the object
			var that = this;
			var obj = {};
			if (!!iLine) {
				obj.PROGRAM_UUID = iLine.PROGRAM_UUID;
				//obj.DEPART = iLine.DEPART;
				obj.DEALER_CODE = iLine.DEALER_CODE;
				obj.CATEGORY_ID = iLine.category;
				obj.VENDOR_ID = iLine.vendor;
				obj.DEL_METHOD = iLine.deliveryMethod;
				obj.DEL_LOCATION_UUID = iLine.deliveryLocation;
				obj.SPECIAL_INSTRUCTION = iLine.specialInfo;
				obj.CHANGED_BY = that.getUserId();

				this.draftInd.showDraftSaving();

				this.saveDelivery(obj, function (rObjec) {
					that.draftInd.showDraftSaved();
				});
			}
		},

		onDelDayChange: function (oEvent) {
			var that = this;
			var iLine = oEvent.getSource().getBinding("items").getContext().getProperty();
			if (!!iLine) {
				var obj = {};
				obj.PROGRAM_UUID = iLine.PROGRAM_UUID;
				//obj.DEPART = iLine.DEPART;
				obj.DEALER_CODE = iLine.DEALER_CODE;
				obj.CATEGORY_ID = iLine.CATEGORY_ID;
				obj.MMYYYY = iLine.MMYYYY;
				obj.VENDOR_ID = iLine.VENDOR_ID;
				obj.CHANGED_BY = that.getUserId();

				this.draftInd.showDraftSaving();

				this.saveDelDay(obj, iLine.MMYYYY, iLine.deliveryWeek, function (rObjec) {
					that.draftInd.showDraftSaved();
				});

			}
		},

		loadDeliverySchedule: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var conditions = viewModel.getProperty("/selectCondotions");
			var resourceBundle = this.getResourceBundle();
			var currentBooking = viewModel.getProperty("/currentBooking");
			var categoryList = [];
			var categoryIndexList = [];
			var lvDat1 = null;

			// in this step, already has the key information supplied, the follwoing code shouldn"t nessessary
			if (!!!conditions.dealerId) {
				MessageBox.warning(resourceBundle.getText("Message.warning.dealer.nokey"));
				return false;
			}

			if (!!!conditions.programId) {
				MessageBox.warning(resourceBundle.getText("Message.warning.program.nokey"));
				return false;
			}

			if (!!!viewModel.categorySchedulesLoaded) {
				// first. load the program. 
				var programKey = {};
				programKey.PROGRAM_UUID = conditions.programUUId;
				programKey.DEALER_CODE = conditions.dealerId;

				sap.ui.core.BusyIndicator.show(0);

				this.getDeliveryScheduleRecords(programKey, function (rvResults) {
					var lvSchedule = null;
					var lvResult = null;

					if (!!rvResults && rvResults.length > 0) {
						// reset 
						currentBooking.categorySchedules = [];
						for (var i = 0; i < rvResults.length; i++) {
							lvResult = rvResults[i];
							lvSchedule = {};

							// data fields								
							lvSchedule.PROGRAM_UUID = lvResult.PROGRAM_UUID;
							lvSchedule.DEALER_CODE = lvResult.DEALER_CODE;
							lvSchedule.LANGUAGE_KEY = lvResult.LANGUAGE_KEY;
							lvSchedule.AUDIT_CHANGED_ON = lvResult.AUDIT_CHANGED_ON;
							lvSchedule.AUDIT_CHANGED_BY = lvResult.AUDIT_CHANGED_BY;

							lvSchedule.category = lvResult.CATEGORY_ID;
							lvSchedule.categoryDesc = lvResult.CATEGORY_DESC;
							if (!!lvSchedule.category) {
								if (!!!categoryList[lvSchedule.category]) {
									categoryList[lvSchedule.category] = {
										key: lvSchedule.category,
										desc: lvSchedule.categoryDesc,
										selected: false
									};
									categoryIndexList.push(lvSchedule.category);
								}
							}
							lvSchedule.vendor = lvResult.VENDOR_ID;
							lvSchedule.vendorDesc = lvResult.VENDOR_DESC;

							// could be null 
							if (lvResult.DEALER_CODE_EXIST === null) {
								lvSchedule.isNew = true;
							} else {
								lvSchedule.isNew = false;
							}

							lvSchedule.deliveryLocationEnable = true;

							if (!!!lvResult.DEL_METHOD) {
								lvSchedule.deliveryMethod = "";
								lvSchedule.delMethodList = that.formatDelMethodList(lvResult.to_DeliveryMethodSet, true);
							} else {
								lvSchedule.deliveryMethod = lvResult.DEL_METHOD;
								if ("DM00001" === lvSchedule.deliveryMethod) {
									// Changed on June 8th - fix defect//
									lvSchedule.deliveryLocation = "";
									// Changed on June 8th - fix defect end//
									lvSchedule.deliveryLocationEnable = false;
								}
								lvSchedule.delMethodList = that.formatDelMethodList(lvResult.to_DeliveryMethodSet, true);
								// lvSchedule.delMethodList = that.formatDelMethodList(lvResult.to_DeliveryMethodSet, false);
							}

							if (!!!lvResult.DEL_LOCATION_UUID) {
								lvSchedule.deliveryLocation = "";
							} else {
								lvSchedule.deliveryLocation = lvResult.DEL_LOCATION_UUID;
							}

							if (!!!lvResult.SPECIAL_INSTRUCTION) {
								lvSchedule.specialInfo = "";
							} else {
								lvSchedule.specialInfo = lvResult.SPECIAL_INSTRUCTION;
							}

							lvSchedule.deliveryLocationDetail = lvResult.to_DeliveryLocation;

							// get the loation detail.
							// if (lvSchedule.deliveryMethod !== "DM00001" && lvSchedule.deliveryLocation!="") {
							// 	if (!!!lvSchedule.deliveryLocation || lvSchedule.deliveryLocation !== currentBooking.summary.dealerAddress.OBJECT_KEY) {
							// 		lvSchedule.deliveryLocation = currentBooking.summary.dealerAddress.OBJECT_KEY; //old code
							// 		lvSchedule.deliveryLocationDetail = currentBooking.summary.dealerAddress;
							// 	}
							// }

							//lvResult.to_DealerDeliveryLocation.results[0]; //
							lvSchedule.delDetailList = that.formatDeliveryDetailList(currentBooking.periods, lvResult.to_DealerBookingCategoryDeliverySchedule);
							lvSchedule.expanded = false;
							var bCategoryVisible = true;
							/* 
							// *************commented for all vendor display************   ////
							var bCategoryVisible = false;
								that._aCategoryVisible.forEach(function (obj) {
									if (obj.categoryId === lvSchedule.category && obj.vendorId === lvSchedule.vendor) {
										bCategoryVisible = true;
									}
								});// *************commented for all vendor display************   ////
							*/
							lvSchedule.categoryVisible = bCategoryVisible;
							if (lvResult.to_DealerBookingCategoryDeliverySchedule.results.length > 0) {
								//	if (viewModel.getProperty("/currentBooking/").partsBookings[0].vendorName == lvSchedule.vendorDesc) {// Changes by Shriram 1-March-2023
								currentBooking.categorySchedules.push(lvSchedule);
								//	}

								//currentBooking.categorySchedules.push(lvSchedule);
							}

						}
						currentBooking.filters.ds.category = [];
						if (!!categoryIndexList && categoryIndexList.length > 0) {

							for (var y2 = 0; y2 < categoryIndexList.length; y2++) {
								lvDat1 = categoryIndexList[y2];
								currentBooking.filters.ds.category.push(categoryList[lvDat1]);
							}
						}
						currentBooking.categorySchedulesLoaded = true;
						viewModel.setProperty("/currentBooking", currentBooking);
					}
					sap.ui.core.BusyIndicator.hide();
				});

			}
		},

		getDetailItem: function (aList, key) {
			if (!!aList && !!key) {
				for (var i = 0; i < aList.length; i++) {
					if (aList[i].key === key) {
						return aList[i];
					}
				}
			} else {
				return null;
			}
		},

		formatDeliveryDetailList: function (periods, deliveryDetailList) {
			var that = this;
			var rList = [];
			var aItem = null;
			var index = -1;
			var rItem = null;
			if (!!deliveryDetailList && !!deliveryDetailList.results && deliveryDetailList.results.length > 0) {
				for (var i = 0; i < deliveryDetailList.results.length; i++) {
					aItem = deliveryDetailList.results[i];
					if (aItem.ORDER_QTY > 0) { // only item with > 0 will be have delivery day assigned
						// next, check it is in range
						index = that.getColumnIndex(periods, aItem.MMYYYY);
						if (index >= 0) {
							rItem = {};
							rItem.PROGRAM_UUID = aItem.PROGRAM_UUID;
							//	rItem.DEPART = aItem.DEPART;
							rItem.DEALER_CODE = aItem.DEALER_CODE;
							rItem.VENDOR_ID = aItem.VENDOR_ID;
							rItem.CATEGORY_ID = aItem.CATEGORY_ID;
							rItem.MMYYYY = aItem.MMYYYY;
							rItem.YYYYMM = that.formatMMYYYY2YYYYMM(aItem.MMYYYY);
							rItem.ORDER_QTY = aItem.ORDER_QTY;
							rItem.SCHEDULE_DATE = aItem.SCHEDULE_DATE;
							if (!!aItem.SCHEDULE_DATE) {
								//YYH
								rItem.deliveryWeek = moment(aItem.SCHEDULE_DATE).format("MM-DD-YYYY");
							} else {
								rItem.deliveryWeek = '01-01-1900';
							}

							rItem.dayList = that.formatDateList(periods[index].weeksList);
							rList.push(rItem);
						}
					}
				}
			}
			return rList;
		},

		formatMMYYYY2YYYYMM: function (MMYYYY) {
			if (!!MMYYYY) {
				return MMYYYY.substr(2, 4) + MMYYYY.substr(0, 2);
			} else {
				return MMYYYY;
			}
		},
		formatDateList: function (dateList) {
			var resourceBundle = this.getResourceBundle();
			var rList = [];
			var aDs = "";
			var aDs1 = '01-01-1900';
			rList.push({
				key: aDs1,
				value: aDs
			});
			if (!!dateList && dateList.length > 0) {
				for (var i = 0; i < dateList.length; i++) {
					rList.push({
						key: formatter.formatDateForList(dateList[i].idate),
						value: formatter.formatDateTitleForList(dateList[i], resourceBundle)
					});
				}
			}
			return rList;
		},

		getDelDetailsList: function (periods, to_DeliveryDetailSet) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var dynamicHeader = viewModel.getProperty("/dynamicHeader");
			for (var i = 0; i < dynamicHeader.length; i++) {
				if (!!periods && periods.length > i) {
					dynamicHeader[i].title = periods[i].nameTitle1;
					dynamicHeader[i].enabled = true;
				} else {
					dynamicHeader[i].title = "";
					dynamicHeader[i].enabled = false;
				}
			}
			viewModel.setProperty("/dynamicHeader", dynamicHeader);
		},

		formatDelMethodList: function (inResults, includeSpace) {
			var that = this;
			var finalList = [];
			var dm001 = null;
			var dm002 = null;
			var selectItem = {};
			if (!!inResults & !!inResults.results && inResults.results.length > 0) {
				for (var x = 0; x < inResults.results.length; x++) {
					selectItem = {};
					selectItem.key = inResults.results[x].DEL_METHOD;
					selectItem.value = inResults.results[x].DEL_METHOD_NAME;
					if (selectItem.key === 'DM00001') {
						dm001 = selectItem;
					} else if (selectItem.key === 'DM00002') {
						dm002 = selectItem;
					} else {
						finalList.push(selectItem);
					}
				}
			}

			finalList.sort(function alphabetical(a, b) {
				var A = a.value.toLowerCase();
				var B = b.value.toLowerCase();
				if (A < B) {
					return -1;
				} else if (A > B) {
					return 1;
				} else {
					return 0;
				}
			});

			if (!!dm002) {
				finalList.unshift(dm002);
			}

			if (!!dm001) {
				finalList.unshift(dm001);
			}

			selectItem = {
				"key": "",
				"value": ""
			};

			if (!!includeSpace) {
				finalList.unshift(selectItem);
			}

			return finalList;
		},
		/*onExportOrder: function (oEvent) {
			var resourceBundle = this.getResourceBundle();
			var oModel = new JSONModel();
			var that = this;
			oModel.setSizeLimit(2000000);
			sap.ui.core.BusyIndicator.show(0);
			var programKey = this.inData;
		
			programKey.Filter2 = "I6_TOTAL";
			programKey.FilterValue2 = '0';

			this.getDealerBookingRecords(programKey, function (odata) {
				var data = [],
					finalData = [];
				for (var i = 0; i < odata.length; i++) {
					if (!data.includes(odata[i].PART_NUM)) {
						data.push(odata[i].PART_NUM);
						finalData.push(odata[i]);
					}
				}
				oModel.setData(finalData);
				sap.ui.core.BusyIndicator.hide();
				var oEOExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					// Pass in the model created above
					models: oModel,

					// binding information for the rows aggregation
					rows: {
						path: "/"
					},

					// column definitions with column name and binding info for the content

					columns: [{
						name: resourceBundle.getText("Label.Part.Number"),
						template: {
							content: {
								parts: ["PART_NUM"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Vendor.Desc"),
						template: {
							content: {
								parts: ["VENDOR_DESC"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Order.Qualtity"),
						template: {
							content: {
								parts: ["I6_TOTAL"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}]
				});

				oEOExport.saveFile(resourceBundle.getText("Label.Parts.Booking.Order")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEOExport.destroy();
				});
			});

		},*/
		processProgramReport: function (programUUId, dealerCode, partsCache, callback) {
			var that = this;
			this.getAllProgramOrderVendorReport(programUUId, dealerCode, function (dataList) {
				// first, make the cache
				var finished = 0;
				if (!!dataList && dataList.length > 0) {
					for (var x = 0; x < dataList.length; x++) {
						if (!!partsCache[dataList[x]]) {
							finished += 1;
							if (finished >= dataList.length) {
								that.prepareProgramReport(dataList, partsCache, callback);
							}
						} else {
							that.getMaterialBom(dataList[x].PART_NUM, function (iPnum, theBoms) {
								finished += 1;
								partsCache[iPnum] = theBoms;
								if (finished >= dataList.length) {
									that.prepareProgramReport(dataList, partsCache, callback);
								}
							});
						}
					}
				} else {
					that.prepareProgramReport([], partsCache, callback);
				}

			});
		},
		prepareProgramReport: function (dataList, partsCache, callback) {
			var bomArray = null;
			if (!!dataList && dataList.length > 0) {
				for (var x = 0; x < dataList.length; x++) {
					bomArray = partsCache[dataList[x].PART_NUM];
					if (!!bomArray) {
						dataList[x].BOM1 = bomArray[0];
						dataList[x].BOM2 = bomArray[1];
						dataList[x].BOM3 = bomArray[2];
						dataList[x].BOM4 = bomArray[3];
						dataList[x].BOM5 = bomArray[4];
					}
				}
			}
			callback(dataList, partsCache);
		},

		onExportOrder: function (oEvent) {
			var that = this;
			sap.ui.core.BusyIndicator.show(0);
			var resourceBundle = this.getResourceBundle();

			var programKey = this.inData;
			var progUUID = programKey.PROGRAM_UUID;
			var dealerCode = programKey.DEALER_CODE;
			programKey.Filter2 = "I6_TOTAL";
			programKey.FilterValue2 = '0';

			var theObject = null;
			var partsCache = {};
			var processedLength = 0;

			this.processProgramReport(progUUID, dealerCode, partsCache, processeProgramExportExcel);

			function exportExcel(aModel) {
				sap.ui.core.BusyIndicator.hide();
				var oEOExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					// Pass in the model created above
					models: aModel,

					// binding information for the rows aggregation
					rows: {
						path: "/"
					},

					// column definitions with column name and binding info for the content

					columns: [{
						name: 'MAIN Parts Number',
						template: {
							content: {
								parts: ["PART_NUM"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Tire Size',
						template: {
							content: {
								parts: ["TIRESIZE"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Vendor Name',
						template: {
							content: {
								parts: ["VENDOR_DESC"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'MAIN Part Desc',
						template: {
							content: {
								parts: ["PART_DESC"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Order Quantity',
						template: {
							content: {
								parts: ["ORDER_QTY"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "0";
									}
								}
							}
						}
					}, {
						name: 'Delivery Method',
						template: {
							content: {
								parts: ["DEL_METHOD_NAME"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Delivery Location Name',
						template: {
							content: {
								parts: ["DEL_LOCATION_NAME"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Delivery Address 1',
						template: {
							content: {
								parts: ["DEL_ADDRESS1"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Delivery City',
						template: {
							content: {
								parts: ["DEL_CITY"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Delivery Province',
						template: {
							content: {
								parts: ["DEL_PROVINCE"],
								formatter: function (prov) {
									if (!prov) {
										return "";
									}
									var resourceBundle = that.getResourceBundle();
									var resourceName = null;
									switch (prov) {
										case "ON":
											resourceName = "Label.Province.ON";
											break;
										case "QC":
											resourceName = "Label.Province.QC";
											break;
										case "NS":
											resourceName = "Label.Province.NS";
											break;
										case "NB":
											resourceName = "Label.Province.NB";
											break;
										case "MB":
											resourceName = "Label.Province.MB";
											break;
										case "BC":
											resourceName = "Label.Province.BC";
											break;
										case "PE":
											resourceName = "Label.Province.PE";
											break;
										case "SK":
											resourceName = "Label.Province.SK";
											break;
										case "AB":
											resourceName = "Label.Province.AB";
											break;
										case "NL":
											resourceName = "Label.Province.NL";
											break;
										case "NU":
											resourceName = "Label.Province.NU";
											break;
										case "YT":
											resourceName = "Label.Province.YT";
											break;

									}
									return resourceBundle.getText(resourceName);
								}
							}
						}
					}, {
						name: 'Delivery Month #',
						template: {
							content: {
								parts: ["MMYYYY"],
								formatter: formatter.longDateTitle
							}
						}
					}, {
						name: 'Delivery Week',
						template: {
							content: {
								parts: ["SCHEDULE_DATE"],
								formatter: formatter.valueDateFormat
							}
						}
					}]
				});

				oEOExport.saveFile(resourceBundle.getText("Label.Parts.Booking.Order")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEOExport.destroy();
				});

			}

			function processeProgramExportExcel(dataList, fPartsCache) {
				partsCache = fPartsCache;
				processedLength += 1;

				var aModel = new JSONModel();
				aModel.setSizeLimit(2000000);
				aModel.setData(dataList);
				exportExcel(aModel);
			}
		},

		onLoadBooking: function (oEvent) {
			var that = this;
			that.seriesSet = [];
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			viewModel.setSizeLimit(200000);
			var conditions = viewModel.getProperty("/selectCondotions");
			var resourceBundle = this.getResourceBundle();
			var categoryList = [];
			var categoryIndexList = [];
			var vendorList = [];
			var vendorIndexList = [];
			var lvDat0 = null;
			var lvDat1 = null;
			var profileModelData = that._profileDate;
			var curerentBrand = null;
			var curerentModel = null;
			var curerentSeries = null;
			var curerentYears = null;
			var allYears = null;
			var aBrandList = null;
			var aModelList = null;
			var aYearList = null;
			var aVF = null;
			var programKey = {};
			that._aCategoryVisible = [];
			this.getView().byId("idNextRecordsBtn").setEnabled(false);

			this.getView().byId("idPrevRecordsBtn").setEnabled(false);

			if (!!!conditions.dealerId) {
				MessageBox.warning(resourceBundle.getText("Message.warning.dealer.nokey"));
				return false;
			}

			if (!!!conditions.programUUId) {
				MessageBox.warning(resourceBundle.getText("Message.warning.program.nokey"));
				return false;
			}
			var selectedOption = that.SearchOptionList.getSelectedKey();
			if (selectedOption == resourceBundle.getText("Label.Vendor")) {
				programKey.Filter = "VENDOR_ID";
				programKey.FilterValue = that.getView().byId("VendorSearchCombo").getSelectedKey();
				//programKey.VENDOR_ID = that.getView().byId("VendorSearchCombo").getSelectedKey();
				if (programKey.FilterValue == "") {
					MessageBox.warning(resourceBundle.getText("Message.warning.vendor.nokey"));
					return false;
				}
				programKey.Filter1 = "";
				programKey.FilterValue1 = "";
				programKey.Filter2 = "";
				programKey.FilterValue2 = "";

				//that.getView().byId("VendorSearchCombo").setEnabled(false);

			} else if (selectedOption == resourceBundle.getText("Label.TireSize")) {
				programKey.Filter = "TIRESIZE";
				programKey.FilterValue = that.getView().byId("TiresizeSearchCombo").getSelectedKey();
				if (programKey.FilterValue == "") {
					MessageBox.warning(resourceBundle.getText("Message.warning.tiresize.nokey"));
					return false;
				}
				programKey.Filter1 = "";
				programKey.FilterValue1 = "";
				programKey.Filter2 = "";
				programKey.FilterValue2 = "";

				//that.getView().byId("TiresizeSearchCombo").setEnabled(false);

			} else {
				programKey.Filter = "SERIES_CODE";
				programKey.FilterValue = that.getView().byId("SeriesCombo").getSelectedKey();
				if (programKey.FilterValue == "") {
					MessageBox.warning(resourceBundle.getText("Message.warning.series.nokey"));
					return false;
				}
				programKey.Filter1 = "YEAR";
				programKey.FilterValue1 = that.getView().byId("YearCombo").getSelectedKey();
				this.FilterValue1 = programKey.FilterValue1;
				if (programKey.FilterValue1 == "") {
					MessageBox.warning(resourceBundle.getText("Message.warning.year.nokey"));
					return false;
				}
				programKey.Filter2 = "";
				programKey.FilterValue2 = "";

				//that.getView().byId("SeriesCombo").setEnabled(false);
				//that.getView().byId("YearCombo").setEnabled(false)

			}
			//that.SearchOptionList.setEnabled(false)

			// first. load the program. 

			programKey.PROGRAM_UUID = conditions.programUUId;
			programKey.DEALER_CODE = conditions.dealerId;
			sap.ui.core.BusyIndicator.show(0);

			this.getDealerBookingSummary(programKey, function (rvProgram) {

				var currentBooking = viewModel.getProperty("/currentBooking");

				if (!!rvProgram) {
					// start load all the information

					currentBooking.summary.programUUId = rvProgram.PROGRAM_UUID;
					currentBooking.summary.programId = rvProgram.PROGRAM_ID;
					currentBooking.summary.department = rvProgram.DEPART;
					if (!!profileModelData.scopes.DealerBooking ||
						(!!profileModelData.scopes.BookingAdmin && (profileModelData.userData.department === currentBooking.summary.department))) {
						currentBooking.actionable = true;
					} else {
						currentBooking.actionable = false;
					}
					if (!!rvProgram.B_STATUS && rvProgram.B_STATUS === "AT") {
						currentBooking.summary.confirmed = true;
					} else {
						if (!!!rvProgram.B_STATUS) {
							// set the first status change --- 
							that.draftInd.showDraftSaving();
							var programKey1 = {};
							programKey1.PROGRAM_UUID = conditions.programUUId;
							programKey1.DEALER_CODE = conditions.dealerId;
							programKey1.DEALER_CODE_S = conditions.dealerCode;
							that.confirmBookingProgram(programKey1, false, function (xObj, isOk) {
								if (!!isOk) {
									that.draftInd.showDraftSaved();
								}
							});
						}
						currentBooking.summary.confirmed = false;
					}
					currentBooking.filters.bp.vendors = [];
					currentBooking.filters.bp.seriesCode = [];
					// FILTERS 
					/*	if (!!rvProgram.to_ProgramValidVendorsSet && !!rvProgram.to_ProgramValidVendorsSet.results && rvProgram.to_ProgramValidVendorsSet
							.results.length > 0) {
							currentBooking.filters.bp.vendors = [];
							for (var y1 = 0; y1 < rvProgram.to_ProgramValidVendorsSet.results.length; y1++) {
								if (programKey.Filter == "VENDOR_ID" && programKey.FilterValue == rvProgram.to_ProgramValidVendorsSet.results[y1].VENDOR_ID) {
									lvDat1 = {
										key: rvProgram.to_ProgramValidVendorsSet.results[y1].VENDOR_ID,
										desc: rvProgram.to_ProgramValidVendorsSet.results[y1].VENDOR_DESC,
										selected: false
									};
									currentBooking.filters.bp.vendors.push(lvDat1);
								} else if (programKey.Filter !== "VENDOR_ID") {
									lvDat1 = {
										key: rvProgram.to_ProgramValidVendorsSet.results[y1].VENDOR_ID,
										desc: rvProgram.to_ProgramValidVendorsSet.results[y1].VENDOR_DESC,
										selected: false
									};
									currentBooking.filters.bp.vendors.push(lvDat1);
								}
							}
						}*/

					if (!!rvProgram.to_ProgramValidCategoriesSet && !!rvProgram.to_ProgramValidCategoriesSet.results && rvProgram.to_ProgramValidCategoriesSet
						.results.length > 0) {
						currentBooking.filters.bp.categories = [];
						for (var y2 = 0; y2 < rvProgram.to_ProgramValidCategoriesSet.results.length; y2++) {

							if (programKey.Filter == "TIRESIZE" && rvProgram.to_ProgramValidCategoriesSet.results[y2].CATEGORY_DESC == "Tires") {

								lvDat1 = {
									key: rvProgram.to_ProgramValidCategoriesSet.results[y2].CATEGORY_ID,
									desc: rvProgram.to_ProgramValidCategoriesSet.results[y2].CATEGORY_DESC,
									selected: false
								};
								currentBooking.filters.bp.categories.push(lvDat1);
							} else if (programKey.Filter !== "TIRESIZE") {
								lvDat1 = {
									key: rvProgram.to_ProgramValidCategoriesSet.results[y2].CATEGORY_ID,
									desc: rvProgram.to_ProgramValidCategoriesSet.results[y2].CATEGORY_DESC,
									selected: false
								};
								currentBooking.filters.bp.categories.push(lvDat1);

							}
						}
					}

					if (!!rvProgram.to_ProgramVechicleModelYearSet && !!rvProgram.to_ProgramVechicleModelYearSet.results && rvProgram.to_ProgramVechicleModelYearSet
						.results.length > 0) {
						currentBooking.filters.bp.brands = [];
						curerentBrand = null;
						curerentModel = null;
						curerentSeries = {
							key: "",
							desc: "",
							models: [],
							years: []
						};
						curerentYears = null;
						allYears = [];

						for (var y3 = 0; y3 < rvProgram.to_ProgramVechicleModelYearSet.results.length; y3++) {
							if (rvProgram.to_ProgramVechicleModelYearSet.results[y3].LANGUAGE_KEY == that.getCurrentLanguageKey() && rvProgram.to_ProgramVechicleModelYearSet
								.results[y3].BRAND == that._profileDate.userData.division) {

								that.seriesSet.push(rvProgram.to_ProgramVechicleModelYearSet.results[y3])
								lvDat0 = rvProgram.to_ProgramVechicleModelYearSet.results[y3];
								if (curerentBrand === null || curerentBrand.key !== lvDat0.BRAND) {
									if (curerentBrand !== null) {
										currentBooking.filters.bp.brands.push(curerentBrand);
									}

									curerentBrand = {
										key: lvDat0.BRAND,
										desc: lvDat0.BRAND_NAME,
										series: []
										//models: []
									};
								} //ok 
								if (curerentModel !== null && curerentSeries !== null && curerentModel.key !== lvDat0.MODEL_CODE) {
									curerentSeries.models.push(curerentModel);
								}
								if (curerentSeries === null || curerentSeries.key !== lvDat0.SERIES_CODE) {

									if (curerentSeries !== null) {
										curerentBrand.series.push(curerentSeries);
										// if (!curerentBrand.series.filter(function (elem) {
										// 		return elem.key === curerentSeries.key;
										// 	}).length) {
										// 	curerentBrand.series.push(curerentSeries);
										// }
										var addedCurrentSeriesKey = curerentSeries.key;

									}
									if (curerentSeries === null || (curerentSeries.key !== lvDat0.SERIES_CODE)) {
										if (programKey.Filter == "SERIES_CODE" && programKey.FilterValue == lvDat0.SERIES_CODE) {

											curerentSeries = {
												key: lvDat0.SERIES_CODE,
												desc: lvDat0.SERIES_DESC,
												models: [],
												years: []
											};
										} else if (programKey.Filter !== "SERIES_CODE") {
											curerentSeries = {
												key: lvDat0.SERIES_CODE,
												desc: lvDat0.SERIES_DESC,
												models: [],
												years: []
											};
										}
									}
									if (curerentModel !== null) {
										curerentModel.years.unshift({
											key: "ALL"
										});
										// curerentSeries.years.unshift({
										// 	key: "ALL"
										// });
									}
								}
								if (curerentModel === null || curerentModel.key !== lvDat0.MODEL_CODE) {

									curerentModel = {
										key: lvDat0.MODEL_CODE,
										desc: lvDat0.MODEL_DESC,
										years: []
									};

									curerentModel.years.push({
										key: lvDat0.YEAR
									});
									// if (curerentSeries.years.indexOf(lvDat0.YEAR) > -1) {
									// 	curerentSeries.years.push({
									// 		key: lvDat0.YEAR
									// 	});
									// }
									// if (!curerentSeries.years.filter(function (elem) {
									// 		return elem.key === lvDat0.YEAR;
									// 	}).length) {
									curerentSeries.years.push({
										key: lvDat0.YEAR
									});
									// }

									// for the IE11 compatibility 
									if (!(allYears.indexOf(lvDat0.YEAR) > -1)) {
										if (programKey.Filter1 == "YEAR" && programKey.FilterValue1 == lvDat0.YEAR) {

											allYears.push(lvDat0.YEAR);
										} else if (programKey.Filter1 !== "YEAR") {
											allYears.push(lvDat0.YEAR);

										}
									}
								}
							}
						}

						if (!!curerentBrand) {

							if (curerentModel !== null) {
								curerentSeries.years.unshift({
									key: "ALL"
								});
								curerentModel.years.unshift({
									key: "ALL"
								});
								curerentSeries.models.push(curerentModel);

							}
							if (curerentSeries !== null && addedCurrentSeriesKey !== lvDat0.SERIES_CODE) {
								curerentBrand.series.push(curerentSeries);
							} else if (curerentBrand.series === undefined || curerentBrand.series === null) {
								if (curerentSeries !== null) {
									curerentBrand.series.push(curerentSeries);
								}
							}
							currentBooking.filters.bp.brands.push(curerentBrand);
						}

						allYears.sort();
						allYears.unshift("ALL");
						currentBooking.filters.bp.allYears = [];
						for (var x1 = 0; x1 < allYears.length; x1++) {
							currentBooking.filters.bp.allYears.push({
								key: allYears[x1]
							});
						}
					}

					if (!!rvProgram.to_DealerDeliveryLocation && !!rvProgram.to_DealerDeliveryLocation.results && rvProgram.to_DealerDeliveryLocation
						.results.length > 0) {
						currentBooking.summary.dealerAddress = rvProgram.to_DealerDeliveryLocation.results[0];
						currentBooking.summary.dealerAddress.DEL_LOCATION_NAME = "";
					} else {
						// create a address from YYHX11
						var lvAObj = {};
						lvAObj.PROGRAM_UUID = conditions.programUUId;
						lvAObj.VENDOR_ID = conditions.dealerId.toString();
						lvAObj.VALID = "";
						lvAObj.DEL_LOCATION_ID = conditions.dealerAddress.addressId.toString();
						lvAObj.LANG = "EN";
						lvAObj.DEL_LOCATION_NAME = conditions.dealerAddress.addressName;
						lvAObj.VENDOR_TYPE = "D3";
						lvAObj.EN_DEL_LOCATION_NAME = lvAObj.DEL_LOCATION_NAME;
						lvAObj.FR_DEL_LOCATION_NAME = lvAObj.DEL_LOCATION_NAME;
						lvAObj.DEL_ADDRESS1 = conditions.dealerAddress.address1;
						lvAObj.DEL_ADDRESS2 = conditions.dealerAddress.address2;
						lvAObj.DEL_CITY = conditions.dealerAddress.city;
						lvAObj.DEL_PROVINCE = conditions.dealerAddress.province;
						if (!!conditions.dealerAddress.zip) {
							lvAObj.DEL_POSTAL_CODE = (conditions.dealerAddress.zip).replace(/\s/g, "").substr(0, 6);
						} else {
							lvAObj.DEL_POSTAL_CODE = "";
						}
						if (!!conditions.dealerAddress.phone) {
							lvAObj.DEL_PHONE_NUMBER = (conditions.dealerAddress.phone).replace(/\)/g, "").replace(/\(/g, "").replace(/\-/g, "").replace(
								/\s/g, "").substr(0, 10);
						} else {
							lvAObj.DEL_PHONE_NUMBER = "";
						}
						that.draftInd.showDraftSaving();
						that.createProgramDelLoc(1, lvAObj,
							function (index, inObj, isOK) {
								if (!!isOK) {
									that.draftInd.showDraftSaved();
									currentBooking.summary.dealerAddress = inObj;
									// to remove the name
									currentBooking.summary.dealerAddress.DEL_LOCATION_NAME = "";
									viewModel.setProperty("/currentBooking", currentBooking);
								} else {
									currentBooking.summary.dealerAddress = null;
									viewModel.setProperty("/currentBooking", currentBooking);
									// else. problem
								}
							});
					}

					currentBooking.summary.dealerId = conditions.dealerId;
					currentBooking.summary.initWarn = rvProgram.INITIAL_WARN;
					currentBooking.summary.finalWarn = rvProgram.FINAL_WARN;
					currentBooking.summary.division = rvProgram.BRAND;
					currentBooking.summary.comparativeProgram = rvProgram.CPROGRAM_ID;
					currentBooking.summary.openDate = formatter.valueUtcESTDate(rvProgram.OPEN_DATE);
					currentBooking.summary.closeDate = formatter.valueUtcESTDate(rvProgram.CLOSE_DATE);
					currentBooking.summary.deleveryFrom = rvProgram.DELIVERY_FR;
					currentBooking.summary.deleveryTo = rvProgram.DELIVERY_TO;

					currentBooking.summary.status = rvProgram.STATUS;

					// get the period information .. may load from server side 
					currentBooking.periods = that.getListOfPeriodWithMonday(currentBooking.summary.deleveryFrom, currentBooking.summary.deleveryTo);
					that.setDynamicColumn(currentBooking.periods);

					// the parts bookings 
					currentBooking.partsBookings = [];
					that.inData = programKey;
					that.clickRecords = 0;
					that.numRecords = 0;
					if (programKey.Filter == "VENDOR_ID" || programKey.Filter == "TIRESIZE") {
						that.getPageofDealerBookingVendorRecords(programKey, that.numRecords, function (odata) {
							var lvBooking = null;
							var lvResult = null;
							var lvGrantTotal = 0;
							var index = -1;
							var periodValue = 0;
							var periodValueS = "";
							var vendorArray = [];
							currentBooking.partsBookings = [];
							currentBooking.filters.bp.vendors = [];
							if (odata && odata.results && odata.results.length > 0) {
								var rvResults = odata.results;
								that.countAllRecords = parseInt(odata.__count);
								if (that.countAllRecords > 100) {
									that.getView().byId("idNextRecordsBtn").setEnabled(true);
								} else {
									that.getView().byId("idNextRecordsBtn").setEnabled(false);
								}
								// zip old data
								// console.log(that.seriesSet);
								var partArray = [];

								// if (!!rvResults && !!rvResults.results && rvResults.results.length > 0) {
								// 	for (var i = 0; i < rvResults.results.length; i++) {
								if (!!rvResults && rvResults.length > 0) {
									for (var i = 0; i < rvResults.length; i++) {
										lvResult = rvResults[i];
										lvBooking = {};
										var K0 = 0;
										for (var g = 0; g < currentBooking.periods.length; g++) {
											if (currentBooking.periods[g].name == rvResults[i].F0_PERIOD) {
												K0 = 0;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F1_PERIOD) {
												K0 = 1;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F2_PERIOD) {
												K0 = 2;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F3_PERIOD) {
												K0 = 3;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F4_PERIOD) {
												K0 = 4;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F5_PERIOD) {
												K0 = 5;
												break;
											} else {
												K0 = 6;
											}
										}
										if (lvResult.DEALER_CODE_EXIST === null) {
											lvBooking.dealerCode = lvResult.DEALER_CODE;
											lvBooking.isNew = true;
										} else {
											lvBooking.dealerCode = lvResult.DEALER_CODE_EXIST;
											lvBooking.isNew = false;
										}
										lvBooking.partNumber = lvResult.PART_NUM;
										lvBooking.vendorId = lvResult.VENDOR_ID;
										lvBooking.vendorName = lvResult.VENDOR_DESC;
										if (!vendorArray.includes(lvResult.VENDOR_ID)) {
											vendorArray.push(lvResult.VENDOR_ID);
											var lvDat1 = {
												key: lvResult.VENDOR_ID,
												desc: lvResult.VENDOR_DESC,
												selected: false
											};
											currentBooking.filters.bp.vendors.push(lvDat1);
										}
										// prepare the vendor list 
										if (!!lvBooking.vendorId) {
											if (!!!vendorList[lvBooking.vendorId]) {
												vendorList[lvBooking.vendorId] = {
													key: lvBooking.vendorId,
													desc: lvBooking.vendorName,
													selected: false
												};
												vendorIndexList.push(lvBooking.vendorId);
											}
										}

										if (!!lvResult.CATEGORY_ID) {
											lvBooking.categoryId = lvResult.CATEGORY_ID;
										} else {
											lvBooking.categoryId = lvResult.CATEGORY_ID_META;
										}
										if (!!lvBooking.categoryId) {
											if (!!!categoryList[lvBooking.categoryId]) {
												categoryList[lvBooking.categoryId] = {
													key: lvBooking.categoryId,
													desc: lvBooking.categoryId,
													selected: false
												};
												categoryIndexList.push(lvBooking.categoryId);
											}
										}
										if (!!lvResult.PART_DESC) {

											lvBooking.details = lvResult.PART_DESC;
										} else {

											lvBooking.details = "";
										}

										if (!!lvResult.DETAIL) {
											lvBooking.details = lvBooking.details + " " + lvResult.DETAIL;
										} else {
											//lvBooking.details = "";
										}
										if (!!lvResult.SERIES_CODE) {
											lvBooking.series = lvResult.SERIES_CODE;
										} else {
											lvBooking.series = "";
										}
										if (!currentBooking.filters.bp.seriesCode.includes(lvBooking.series)) {

											currentBooking.filters.bp.seriesCode.push(lvBooking.series);
										}
										if (!!lvResult.TIRESIZE) {
											lvBooking.tiresize = lvResult.TIRESIZE;
										} else {
											lvBooking.tiresize = "";
										}

										if (!!lvResult.SPEEDRATING) {
											lvBooking.speedrating = lvResult.SPEEDRATING;
										} else {
											lvBooking.speedrating = "";
										}
										if (!!lvResult.LOADRATING) {
											lvBooking.loadrating = lvResult.LOADRATING;
										} else {
											lvBooking.loadrating = "";
										}
										if (!!lvResult.DEALERNET) {
											lvBooking.dealernet = lvResult.DEALERNET;
										} else {
											lvBooking.dealernet = "";
										}
										if (!!lvResult.DEALER_NET) {
											lvBooking.dealerNetReady = true;
											lvBooking.dealerNet = lvResult.DEALER_NET;
										} else {
											lvBooking.dealerNetReady = false;
											lvBooking.dealerNet = 0;
										}
										if (!!lvResult.PRIOR_BOOKING) {
											lvBooking.priorBook = lvResult.PRIOR_BOOKING;
										} else {
											if (!!lvResult.PRIOR_BOOKING_PR) {
												lvBooking.priorBook = Number(lvResult.PRIOR_BOOKING_PR);
											} else {
												lvBooking.priorBook = 0;
											}
										}
										if (!!lvResult.PRIOR_PURCHASES) {
											lvBooking.priorPurcahse = lvResult.PRIOR_PURCHASES;
										} else {
											if (!!lvResult.PRIOR_PURCHASES_PR) {
												lvBooking.priorPurcahse = Number(lvResult.PRIOR_PURCHASES_PR);
											} else {
												lvBooking.priorPurcahse = 0;
											}
										}

										if (K0 === 0) {
											if (!!lvResult.F0_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F0_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F1_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F1_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F2_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F2_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F3 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F3 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F4 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F4 = 0;
											}
											if (lvResult.F5_VALUE != 0) {
												lvBooking.F5 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F5 = 0;
											}
										} else if (K0 === 1) {
											if (!!lvResult.F1_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F1_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F2_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F2_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F3 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F3 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F4 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F4 = 0;
											}
											lvBooking.F5 = 0;

										} else if (K0 === 2) {
											if (!!lvResult.F2_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F2_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F3 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F3 = 0;
											}
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else if (K0 === 3) {
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else if (K0 === 4) {
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											lvBooking.F2 = 0;

											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else if (K0 === 5) {
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											lvBooking.F1 = 0;
											lvBooking.F2 = 0;

											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else {
											lvBooking.F0 = 0;
											lvBooking.F1 = 0;
											lvBooking.F2 = 0;

											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										}

										/*if (!!lvResult.F0_VALUE != 0) {
										lvBooking.F0 = Number(lvResult.F0_VALUE);
									} else {
										lvBooking.F0 = 0;
									}
									if (!!lvResult.F1_VALUE != 0) {
										lvBooking.F1 = Number(lvResult.F1_VALUE);
									} else {
										lvBooking.F1 = 0;
									}
									if (!!lvResult.F2_VALUE != 0) {
										lvBooking.F2 = Number(lvResult.F2_VALUE);
									} else {
										lvBooking.F2 = 0;
									}
									if (!!lvResult.F3_VALUE != 0) {
										lvBooking.F3 = Number(lvResult.F3_VALUE);
									} else {
										lvBooking.F3 = 0;
									}
									if (!!lvResult.F4_VALUE != 0) {
										lvBooking.F4 = Number(lvResult.F4_VALUE);
									} else {
										lvBooking.F4 = 0;
									}
									if (lvResult.F5_VALUE != 0) {
										lvBooking.F5 = Number(lvResult.F5_VALUE);
									} else {
										lvBooking.F5 = 0;
									}
*/

										aBrandList = [];
										aModelList = [];
										aYearList = [];
										lvBooking.total = lvResult.I6_TOTAL;
										var iCatVInsert = true;

										if (lvResult.I6_TOTAL > 0) {
											that._aCategoryVisible.forEach(function (obj) {
												if (obj.categoryId === lvBooking.categoryId && obj.vendorId === lvBooking.vendorId) {
													iCatVInsert = false;
												}
											});
											if (iCatVInsert) {
												that._aCategoryVisible.push({
													"categoryId": lvBooking.categoryId,
													"vendorId": lvBooking.vendorId
												});
											}
										}
										currentBooking.partsBookings.push(lvBooking);

										// lvGrantTotal = lvGrantTotal + lvBooking.total;

									}
								}
							}

							currentBooking.loaded = true;
							// currentBooking.partsBookingsTotal = lvGrantTotal;
							sap.ui.core.BusyIndicator.hide();
							viewModel.setProperty("/currentBooking", currentBooking);
							viewModel.setProperty(
								"/currentDetailTab", "BP");

							// that.prepareTheNewPartsBookings();
							that.setBookingStatus();
							viewModel.refresh(true);
						});
					} else {
						that.getPageofDealerBookingRecords(programKey, that.numRecords, function (odata) {
							var lvBooking = null;
							var lvResult = null;
							var lvGrantTotal = 0;
							var index = -1;
							var periodValue = 0;
							var periodValueS = "";
							var vendorArray = [];
							currentBooking.partsBookings = [];
							currentBooking.filters.bp.vendors = [];
							if (odata && odata.results && odata.results.length > 0) {

								var rvResults = odata.results;
								that.countAllRecords = parseInt(odata.__count);
								if (that.countAllRecords > 100) {
									that.getView().byId("idNextRecordsBtn").setEnabled(true);
								} else {
									that.getView().byId("idNextRecordsBtn").setEnabled(false);
								}

								// zip old data
								// console.log(that.seriesSet);
								var partArray = [];
								// if (!!rvResults && !!rvResults.results && rvResults.results.length > 0) {
								// 	for (var i = 0; i < rvResults.results.length; i++) {
								if (!!rvResults && rvResults.length > 0) {
									for (var i = 0; i < rvResults.length; i++) {
										lvResult = rvResults[i];
										lvBooking = {};
										var K0 = 0;
										for (var g = 0; g < currentBooking.periods.length; g++) {
											if (currentBooking.periods[g].name == rvResults[i].F0_PERIOD) {
												K0 = 0;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F1_PERIOD) {
												K0 = 1;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F2_PERIOD) {
												K0 = 2;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F3_PERIOD) {
												K0 = 3;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F4_PERIOD) {
												K0 = 4;
												break;
											} else if (currentBooking.periods[g].name == rvResults[i].F5_PERIOD) {
												K0 = 5;
												break;
											} else {
												K0 = 6;
											}
										}

										if (lvResult.DEALER_CODE_EXIST === null) {
											lvBooking.dealerCode = lvResult.DEALER_CODE;
											lvBooking.isNew = true;
										} else {
											lvBooking.dealerCode = lvResult.DEALER_CODE_EXIST;
											lvBooking.isNew = false;
										}
										lvBooking.partNumber = lvResult.PART_NUM;
										lvBooking.vendorId = lvResult.VENDOR_ID;
										lvBooking.vendorName = lvResult.VENDOR_DESC;
										if (!vendorArray.includes(lvResult.VENDOR_ID)) {
											vendorArray.push(lvResult.VENDOR_ID);
											var lvDat1 = {
												key: lvResult.VENDOR_ID,
												desc: lvResult.VENDOR_DESC,
												selected: false
											};
											currentBooking.filters.bp.vendors.push(lvDat1);
										}
										// prepare the vendor list 
										if (!!lvBooking.vendorId) {
											if (!!!vendorList[lvBooking.vendorId]) {
												vendorList[lvBooking.vendorId] = {
													key: lvBooking.vendorId,
													desc: lvBooking.vendorName,
													selected: false
												};
												vendorIndexList.push(lvBooking.vendorId);
											}
										}

										if (!!lvResult.CATEGORY_ID) {
											lvBooking.categoryId = lvResult.CATEGORY_ID;
										} else {
											lvBooking.categoryId = lvResult.CATEGORY_ID_META;
										}
										if (!!lvBooking.categoryId) {
											if (!!!categoryList[lvBooking.categoryId]) {
												categoryList[lvBooking.categoryId] = {
													key: lvBooking.categoryId,
													desc: lvBooking.categoryId,
													selected: false
												};
												categoryIndexList.push(lvBooking.categoryId);
											}
										}
										if (!!lvResult.PART_DESC) {

											lvBooking.details = lvResult.PART_DESC;
										} else {

											lvBooking.details = "";
										}

										if (!!lvResult.DETAIL) {
											lvBooking.details = lvBooking.details + " " + lvResult.DETAIL;
										} else {
											//lvBooking.details = "";
										}
										if (!!lvResult.SERIES_CODE) {
											lvBooking.series = lvResult.SERIES_CODE;
										} else {
											lvBooking.series = "";
										}
										if (!currentBooking.filters.bp.seriesCode.includes(lvBooking.series)) {

											currentBooking.filters.bp.seriesCode.push(lvBooking.series);
										}
										if (!!lvResult.TIRESIZE) {
											lvBooking.tiresize = lvResult.TIRESIZE;
										} else {
											lvBooking.tiresize = "";
										}

										if (!!lvResult.SPEEDRATING) {
											lvBooking.speedrating = lvResult.SPEEDRATING;
										} else {
											lvBooking.speedrating = "";
										}
										if (!!lvResult.LOADRATING) {
											lvBooking.loadrating = lvResult.LOADRATING;
										} else {
											lvBooking.loadrating = "";
										}
										if (!!lvResult.DEALERNET) {
											lvBooking.dealernet = lvResult.DEALERNET;
										} else {
											lvBooking.dealernet = "";
										}
										if (!!lvResult.DEALER_NET) {
											lvBooking.dealerNetReady = true;
											lvBooking.dealerNet = lvResult.DEALER_NET;
										} else {
											lvBooking.dealerNetReady = false;
											lvBooking.dealerNet = 0;
										}
										if (!!lvResult.PRIOR_BOOKING) {
											lvBooking.priorBook = lvResult.PRIOR_BOOKING;
										} else {
											if (!!lvResult.PRIOR_BOOKING_PR) {
												lvBooking.priorBook = Number(lvResult.PRIOR_BOOKING_PR);
											} else {
												lvBooking.priorBook = 0;
											}
										}
										if (!!lvResult.PRIOR_PURCHASES) {
											lvBooking.priorPurcahse = lvResult.PRIOR_PURCHASES;
										} else {
											if (!!lvResult.PRIOR_PURCHASES_PR) {
												lvBooking.priorPurcahse = Number(lvResult.PRIOR_PURCHASES_PR);
											} else {
												lvBooking.priorPurcahse = 0;
											}
										}

										/*if (!!lvResult.F0_VALUE != 0) {
										lvBooking.F0 = Number(lvResult.F0_VALUE);
									} else {
										lvBooking.F0 = 0;
									}
									if (!!lvResult.F1_VALUE != 0) {
										lvBooking.F1 = Number(lvResult.F1_VALUE);
									} else {
										lvBooking.F1 = 0;
									}
									if (!!lvResult.F2_VALUE != 0) {
										lvBooking.F2 = Number(lvResult.F2_VALUE);
									} else {
										lvBooking.F2 = 0;
									}
									if (!!lvResult.F3_VALUE != 0) {
										lvBooking.F3 = Number(lvResult.F3_VALUE);
									} else {
										lvBooking.F3 = 0;
									}
									if (!!lvResult.F4_VALUE != 0) {
										lvBooking.F4 = Number(lvResult.F4_VALUE);
									} else {
										lvBooking.F4 = 0;
									}
									if (lvResult.F5_VALUE != 0) {
										lvBooking.F5 = Number(lvResult.F5_VALUE);
									} else {
										lvBooking.F5 = 0;
									}
*/
										if (K0 === 0) {
											if (!!lvResult.F0_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F0_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F1_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F1_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F2_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F2_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F3 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F3 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F4 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F4 = 0;
											}
											if (lvResult.F5_VALUE != 0) {
												lvBooking.F5 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F5 = 0;
											}
										} else if (K0 === 1) {
											if (!!lvResult.F1_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F1_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F2_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F2_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F3 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F3 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F4 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F4 = 0;
											}
											lvBooking.F5 = 0;

										} else if (K0 === 2) {
											if (!!lvResult.F2_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F2_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F3 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F3 = 0;
											}
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else if (K0 === 3) {
											if (!!lvResult.F3_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F3_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F2 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F2 = 0;
											}
											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else if (K0 === 4) {
											if (!!lvResult.F4_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F4_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F1 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F1 = 0;
											}
											lvBooking.F2 = 0;

											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else if (K0 === 5) {
											if (!!lvResult.F5_VALUE != 0) {
												lvBooking.F0 = Number(lvResult.F5_VALUE);
											} else {
												lvBooking.F0 = 0;
											}
											lvBooking.F1 = 0;
											lvBooking.F2 = 0;

											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										} else {
											lvBooking.F0 = 0;
											lvBooking.F1 = 0;
											lvBooking.F2 = 0;

											lvBooking.F3 = 0;
											lvBooking.F4 = 0;
											lvBooking.F5 = 0;

										}

										aBrandList = [];
										aModelList = [];
										aYearList = [];

										if (!!lvResult.to_ProgramPartsModelYearsSet && !!lvResult.to_ProgramPartsModelYearsSet.results && lvResult.to_ProgramPartsModelYearsSet
											.results.length > 0) {
											for (var x = 0; x < lvResult.to_ProgramPartsModelYearsSet.results.length; x++) {
												aVF = lvResult.to_ProgramPartsModelYearsSet.results[x];
												if (aBrandList.indexOf(aVF.BRAND) < 0) {
													aBrandList.push(aVF.BRAND);
												}
												if (aModelList.indexOf(aVF.MODEL_CODE) < 0) {
													aModelList.push(aVF.MODEL_CODE);
												}
												if (aYearList.indexOf(aVF.YEAR) < 0) {
													aYearList.push(aVF.YEAR);
												}
												/*for (var y = 0; y < that.seriesSet.length; y++) {
													if (lvResult.to_ProgramPartsModelYearsSet.results[x].MODEL_CODE == that.seriesSet[y].MODEL_CODE) {
														if (that.getCurrentLanguageKey() == that.seriesSet[y].LANGUAGE_KEY) {
															// lvBooking.seriesDesc = that.seriesSet.results[y].SERIES_DESC;
															lvBooking.series = that.seriesSet[y].SERIES_CODE;
														}
														// console.log(lvBooking.seriesDesc);
													}
												}*/
											}
										}
										lvBooking.brands = aBrandList.join();
										lvBooking.models = aModelList.join();
										lvBooking.years = aYearList.join();
										lvBooking.total = lvResult.I6_TOTAL;
										var iCatVInsert = true;

										if (lvResult.I6_TOTAL > 0) {
											that._aCategoryVisible.forEach(function (obj) {
												if (obj.categoryId === lvBooking.categoryId && obj.vendorId === lvBooking.vendorId) {
													iCatVInsert = false;
												}
											});
											if (iCatVInsert) {
												that._aCategoryVisible.push({
													"categoryId": lvBooking.categoryId,
													"vendorId": lvBooking.vendorId
												});
											}
										}
										currentBooking.partsBookings.push(lvBooking);

										// lvGrantTotal = lvGrantTotal + lvBooking.total;

									}
								}
							}

							currentBooking.loaded = true;
							// currentBooking.partsBookingsTotal = lvGrantTotal;
							sap.ui.core.BusyIndicator.hide();
							viewModel.setProperty("/currentBooking", currentBooking);
							viewModel.setProperty(
								"/currentDetailTab", "BP");

							// that.prepareTheNewPartsBookings();
							that.setBookingStatus();
							viewModel.refresh(true);
						});
					}
				} else {
					MessageBox.warning(resourceBundle.getText("Message.error.program.load", [conditions.programId, conditions.currentDept]));
				}
			});
		},
		onNextRecords: function () {

			if (this.clickRecords < 0) {
				this.clickRecords = 0;
				this.clickRecords += 1;
			} else {
				this.clickRecords += 1;
			}
			this.numRecords = this.clickRecords * 100;
			//this.countAllRecords = this.getCountOfAllRecords();

			if (this.numRecords <= this.countAllRecords && parseInt(this.countAllRecords / this.numRecords) == 1 && parseInt(this.countAllRecords %
				this.numRecords) < 100) {
				this.getView().byId("idNextRecordsBtn").setEnabled(false);
			}
			if (this.numRecords >= 100) {
				this.getView().byId("idPrevRecordsBtn").setEnabled(true);

			}
			this.nextDataRecords();
		},
		onPreviousRecords: function () {

			this.clickRecords -= 1;
			if (this.clickRecords <= 0) {
				this.numRecords = 0;
			} else {
				this.numRecords = this.clickRecords * 100;
			}
			if (this.numRecords < this.countAllRecords) {

				this.getView().byId("idNextRecordsBtn").setEnabled(true);

			}
			if (this.numRecords === 0) {

				this.getView().byId("idPrevRecordsBtn").setEnabled(false);

			}

			this.nextDataRecords();
		},
		nextDataRecords: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var conditions = viewModel.getProperty("/selectCondotions");
			var resourceBundle = this.getResourceBundle();
			var programKey = {};
			programKey = this.inData;
			var currentBooking = viewModel.getProperty("/currentBooking");
			viewModel.setSizeLimit(20000);
			sap.ui.core.BusyIndicator.show();
			if (programKey.Filter == "VENDOR_ID" || programKey.Filter == "TIRESIZE") {
				that.getPageofDealerBookingVendorRecords(programKey, that.numRecords, function (odata) {
					var lvBooking = null;
					var lvResult = null;
					var lvGrantTotal = 0;
					var index = -1;
					var periodValue = 0;
					var periodValueS = "";
					var vendorArray = [];
					var rvResults = odata.results;
					// zip old data
					// console.log(that.seriesSet);

					currentBooking.partsBookings = [];
					currentBooking.filters.bp.vendors = [];
					var partArray = [];
					// if (!!rvResults && !!rvResults.results && rvResults.results.length > 0) {
					// 	for (var i = 0; i < rvResults.results.length; i++) {
					if (!!rvResults && rvResults.length > 0) {
						for (var i = 0; i < rvResults.length; i++) {
							lvResult = rvResults[i];
							lvBooking = {};
							var K0 = 0;
							for (var g = 0; g < currentBooking.periods.length; g++) {
								if (currentBooking.periods[g].name == rvResults[i].F0_PERIOD) {
									K0 = 0;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F1_PERIOD) {
									K0 = 1;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F2_PERIOD) {
									K0 = 2;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F3_PERIOD) {
									K0 = 3;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F4_PERIOD) {
									K0 = 4;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F5_PERIOD) {
									K0 = 5;
									break;
								} else {
									K0 = 6;
								}
							}

							if (lvResult.DEALER_CODE_EXIST === null) {
								lvBooking.dealerCode = lvResult.DEALER_CODE;
								lvBooking.isNew = true;
							} else {
								lvBooking.dealerCode = lvResult.DEALER_CODE_EXIST;
								lvBooking.isNew = false;
							}
							lvBooking.partNumber = lvResult.PART_NUM;
							lvBooking.vendorId = lvResult.VENDOR_ID;
							lvBooking.vendorName = lvResult.VENDOR_DESC;
							if (!vendorArray.includes(lvResult.VENDOR_ID)) {
								vendorArray.push(lvResult.VENDOR_ID);
								var lvDat1 = {
									key: lvResult.VENDOR_ID,
									desc: lvResult.VENDOR_DESC,
									selected: false
								};
								currentBooking.filters.bp.vendors.push(lvDat1);
							}
							// prepare the vendor list 

							if (!!lvResult.CATEGORY_ID) {
								lvBooking.categoryId = lvResult.CATEGORY_ID;
							} else {
								lvBooking.categoryId = lvResult.CATEGORY_ID_META;
							}
							if (!!lvResult.PART_DESC) {

								lvBooking.details = lvResult.PART_DESC;
							} else {

								lvBooking.details = "";
							}

							if (!!lvResult.DETAIL) {
								lvBooking.details = lvBooking.details + " " + lvResult.DETAIL;
							} else {
								//lvBooking.details = "";
							}
							if (!currentBooking.filters.bp.seriesCode.includes(lvBooking.series)) {

								currentBooking.filters.bp.seriesCode.push("");
							}
							if (!!lvResult.TIRESIZE) {
								lvBooking.tiresize = lvResult.TIRESIZE;
							} else {
								lvBooking.tiresize = "";
							}

							if (!!lvResult.SPEEDRATING) {
								lvBooking.speedrating = lvResult.SPEEDRATING;
							} else {
								lvBooking.speedrating = "";
							}
							if (!!lvResult.LOADRATING) {
								lvBooking.loadrating = lvResult.LOADRATING;
							} else {
								lvBooking.loadrating = "";
							}
							if (!!lvResult.DEALERNET) {
								lvBooking.dealernet = lvResult.DEALERNET;
							} else {
								lvBooking.dealernet = "";
							}
							if (!!lvResult.DEALER_NET) {
								lvBooking.dealerNetReady = true;
								lvBooking.dealerNet = lvResult.DEALER_NET;
							} else {
								lvBooking.dealerNetReady = false;
								lvBooking.dealerNet = 0;
							}
							if (!!lvResult.PRIOR_BOOKING) {
								lvBooking.priorBook = lvResult.PRIOR_BOOKING;
							} else {
								if (!!lvResult.PRIOR_BOOKING_PR) {
									lvBooking.priorBook = Number(lvResult.PRIOR_BOOKING_PR);
								} else {
									lvBooking.priorBook = 0;
								}
							}
							if (!!lvResult.PRIOR_PURCHASES) {
								lvBooking.priorPurcahse = lvResult.PRIOR_PURCHASES;
							} else {
								if (!!lvResult.PRIOR_PURCHASES_PR) {
									lvBooking.priorPurcahse = Number(lvResult.PRIOR_PURCHASES_PR);
								} else {
									lvBooking.priorPurcahse = 0;
								}
							}

							/*if (!!lvResult.F0_VALUE != 0) {
								lvBooking.F0 = Number(lvResult.F0_VALUE);
							} else {
								lvBooking.F0 = 0;
							}
							if (!!lvResult.F1_VALUE != 0) {
								lvBooking.F1 = Number(lvResult.F1_VALUE);
							} else {
								lvBooking.F1 = 0;
							}
							if (!!lvResult.F2_VALUE != 0) {
								lvBooking.F2 = Number(lvResult.F2_VALUE);
							} else {
								lvBooking.F2 = 0;
							}
							if (!!lvResult.F3_VALUE != 0) {
								lvBooking.F3 = Number(lvResult.F3_VALUE);
							} else {
								lvBooking.F3 = 0;
							}
							if (!!lvResult.F4_VALUE != 0) {
								lvBooking.F4 = Number(lvResult.F4_VALUE);
							} else {
								lvBooking.F4 = 0;
							}
							if (lvResult.F5_VALUE != 0) {
								lvBooking.F5 = Number(lvResult.F5_VALUE);
							} else {
								lvBooking.F5 = 0;
							}*/

							if (K0 === 0) {
								if (!!lvResult.F0_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F0_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F1_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F1_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F2_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F2_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F3 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F3 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F4 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F4 = 0;
								}
								if (lvResult.F5_VALUE != 0) {
									lvBooking.F5 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F5 = 0;
								}
							} else if (K0 === 1) {
								if (!!lvResult.F1_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F1_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F2_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F2_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F3 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F3 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F4 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F4 = 0;
								}
								lvBooking.F5 = 0;

							} else if (K0 === 2) {
								if (!!lvResult.F2_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F2_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F3 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F3 = 0;
								}
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							} else if (K0 === 3) {
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							} else if (K0 === 4) {
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								lvBooking.F2 = 0;

								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							} else if (K0 === 5) {
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								lvBooking.F1 = 0;
								lvBooking.F2 = 0;

								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							} else {
								lvBooking.F0 = 0;
								lvBooking.F1 = 0;
								lvBooking.F2 = 0;

								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							}

							lvBooking.total = lvResult.I6_TOTAL;
							var iCatVInsert = true;

							if (lvResult.I6_TOTAL > 0) {
								that._aCategoryVisible.forEach(function (obj) {
									if (obj.categoryId === lvBooking.categoryId && obj.vendorId === lvBooking.vendorId) {
										iCatVInsert = false;
									}
								});
								if (iCatVInsert) {
									that._aCategoryVisible.push({
										"categoryId": lvBooking.categoryId,
										"vendorId": lvBooking.vendorId
									});
								}
							}
							currentBooking.partsBookings.push(lvBooking);

							// lvGrantTotal = lvGrantTotal + lvBooking.total;

						}
					}

					currentBooking.loaded = true;
					// currentBooking.partsBookingsTotal = lvGrantTotal;
					sap.ui.core.BusyIndicator.hide();
					viewModel.setProperty("/currentBooking", currentBooking);
					viewModel.setProperty(
						"/currentDetailTab", "BP");

					// that.prepareTheNewPartsBookings();
					that.setBookingStatus();
					viewModel.refresh(true);
				});
			} else {
				that.getPageofDealerBookingRecords(programKey, that.numRecords, function (odata) {
					var lvBooking = null;
					var lvResult = null;
					var lvGrantTotal = 0;
					var index = -1;
					var periodValue = 0;
					var periodValueS = "";
					var vendorArray = [];
					var rvResults = odata.results;
					// zip old data
					// console.log(that.seriesSet);

					currentBooking.partsBookings = [];
					currentBooking.filters.bp.vendors = [];
					var partArray = [];
					// if (!!rvResults && !!rvResults.results && rvResults.results.length > 0) {
					// 	for (var i = 0; i < rvResults.results.length; i++) {
					if (!!rvResults && rvResults.length > 0) {

						for (var i = 0; i < rvResults.length; i++) {
							lvResult = rvResults[i];
							lvBooking = {};
							var K0 = 0;
							for (var g = 0; g < currentBooking.periods.length; g++) {
								if (currentBooking.periods[g].name == rvResults[i].F0_PERIOD) {
									K0 = 0;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F1_PERIOD) {
									K0 = 1;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F2_PERIOD) {
									K0 = 2;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F3_PERIOD) {
									K0 = 3;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F4_PERIOD) {
									K0 = 4;
									break;
								} else if (currentBooking.periods[g].name == rvResults[i].F5_PERIOD) {
									K0 = 5;
									break;
								} else {
									K0 = 6;
								}
							}

							if (lvResult.DEALER_CODE_EXIST === null) {
								lvBooking.dealerCode = lvResult.DEALER_CODE;
								lvBooking.isNew = true;
							} else {
								lvBooking.dealerCode = lvResult.DEALER_CODE_EXIST;
								lvBooking.isNew = false;
							}
							lvBooking.partNumber = lvResult.PART_NUM;
							lvBooking.vendorId = lvResult.VENDOR_ID;
							lvBooking.vendorName = lvResult.VENDOR_DESC;
							if (!vendorArray.includes(lvResult.VENDOR_ID)) {
								vendorArray.push(lvResult.VENDOR_ID);
								var lvDat1 = {
									key: lvResult.VENDOR_ID,
									desc: lvResult.VENDOR_DESC,
									selected: false
								};
								currentBooking.filters.bp.vendors.push(lvDat1);
							}

							if (!!lvResult.CATEGORY_ID) {
								lvBooking.categoryId = lvResult.CATEGORY_ID;
							} else {
								lvBooking.categoryId = lvResult.CATEGORY_ID_META;
							}

							if (!!lvResult.PART_DESC) {

								lvBooking.details = lvResult.PART_DESC;
							} else {

								lvBooking.details = "";
							}

							if (!!lvResult.DETAIL) {
								lvBooking.details = lvBooking.details + " " + lvResult.DETAIL;
							} else {
								//lvBooking.details = "";
							}
							if (!!lvResult.SERIES_CODE) {
								lvBooking.series = lvResult.SERIES_CODE;
							} else {
								lvBooking.series = "";
							}
							if (!currentBooking.filters.bp.seriesCode.includes(lvBooking.series)) {

								currentBooking.filters.bp.seriesCode.push(lvBooking.series);
							}
							if (!!lvResult.TIRESIZE) {
								lvBooking.tiresize = lvResult.TIRESIZE;
							} else {
								lvBooking.tiresize = "";
							}

							if (!!lvResult.SPEEDRATING) {
								lvBooking.speedrating = lvResult.SPEEDRATING;
							} else {
								lvBooking.speedrating = "";
							}
							if (!!lvResult.LOADRATING) {
								lvBooking.loadrating = lvResult.LOADRATING;
							} else {
								lvBooking.loadrating = "";
							}
							if (!!lvResult.DEALERNET) {
								lvBooking.dealernet = lvResult.DEALERNET;
							} else {
								lvBooking.dealernet = "";
							}
							if (!!lvResult.DEALER_NET) {
								lvBooking.dealerNetReady = true;
								lvBooking.dealerNet = lvResult.DEALER_NET;
							} else {
								lvBooking.dealerNetReady = false;
								lvBooking.dealerNet = 0;
							}
							if (!!lvResult.PRIOR_BOOKING) {
								lvBooking.priorBook = lvResult.PRIOR_BOOKING;
							} else {
								if (!!lvResult.PRIOR_BOOKING_PR) {
									lvBooking.priorBook = Number(lvResult.PRIOR_BOOKING_PR);
								} else {
									lvBooking.priorBook = 0;
								}
							}
							if (!!lvResult.PRIOR_PURCHASES) {
								lvBooking.priorPurcahse = lvResult.PRIOR_PURCHASES;
							} else {
								if (!!lvResult.PRIOR_PURCHASES_PR) {
									lvBooking.priorPurcahse = Number(lvResult.PRIOR_PURCHASES_PR);
								} else {
									lvBooking.priorPurcahse = 0;
								}
							}

							/*if (!!lvResult.F0_VALUE != 0) {
								lvBooking.F0 = Number(lvResult.F0_VALUE);
							} else {
								lvBooking.F0 = 0;
							}
							if (!!lvResult.F1_VALUE != 0) {
								lvBooking.F1 = Number(lvResult.F1_VALUE);
							} else {
								lvBooking.F1 = 0;
							}
							if (!!lvResult.F2_VALUE != 0) {
								lvBooking.F2 = Number(lvResult.F2_VALUE);
							} else {
								lvBooking.F2 = 0;
							}
							if (!!lvResult.F3_VALUE != 0) {
								lvBooking.F3 = Number(lvResult.F3_VALUE);
							} else {
								lvBooking.F3 = 0;
							}
							if (!!lvResult.F4_VALUE != 0) {
								lvBooking.F4 = Number(lvResult.F4_VALUE);
							} else {
								lvBooking.F4 = 0;
							}
							if (lvResult.F5_VALUE != 0) {
								lvBooking.F5 = Number(lvResult.F5_VALUE);
							} else {
								lvBooking.F5 = 0;
							}
*/
							if (K0 === 0) {
								if (!!lvResult.F0_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F0_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F1_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F1_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F2_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F2_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F3 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F3 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F4 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F4 = 0;
								}
								if (lvResult.F5_VALUE != 0) {
									lvBooking.F5 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F5 = 0;
								}
							}
							if (K0 === 1) {
								if (!!lvResult.F1_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F1_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F2_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F2_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F3 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F3 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F4 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F4 = 0;
								}
								lvBooking.F5 = 0;

							}
							if (K0 === 2) {
								if (!!lvResult.F2_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F2_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F3 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F3 = 0;
								}
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							}
							if (K0 === 3) {
								if (!!lvResult.F3_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F3_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F2 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F2 = 0;
								}
								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							}
							if (K0 === 4) {
								if (!!lvResult.F4_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F4_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F1 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F1 = 0;
								}
								lvBooking.F2 = 0;

								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							}
							if (K0 === 5) {
								if (!!lvResult.F5_VALUE != 0) {
									lvBooking.F0 = Number(lvResult.F5_VALUE);
								} else {
									lvBooking.F0 = 0;
								}
								lvBooking.F1 = 0;
								lvBooking.F2 = 0;

								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							}
							if (K0 === 6) {
								lvBooking.F0 = 0;
								lvBooking.F1 = 0;
								lvBooking.F2 = 0;

								lvBooking.F3 = 0;
								lvBooking.F4 = 0;
								lvBooking.F5 = 0;

							}

							var aBrandList = [];
							var aModelList = [];
							var aYearList = [];

							if (!!lvResult.to_ProgramPartsModelYearsSet && !!lvResult.to_ProgramPartsModelYearsSet.results && lvResult.to_ProgramPartsModelYearsSet
								.results.length > 0) {
								for (var x = 0; x < lvResult.to_ProgramPartsModelYearsSet.results.length; x++) {
									var aVF = lvResult.to_ProgramPartsModelYearsSet.results[x];
									if (aBrandList.indexOf(aVF.BRAND) < 0) {
										aBrandList.push(aVF.BRAND);
									}
									if (aModelList.indexOf(aVF.MODEL_CODE) < 0) {
										aModelList.push(aVF.MODEL_CODE);
									}
									if (aYearList.indexOf(aVF.YEAR) < 0) {
										aYearList.push(aVF.YEAR);
									}
									/*for (var y = 0; y < that.seriesSet.length; y++) {
										if (lvResult.to_ProgramPartsModelYearsSet.results[x].MODEL_CODE == that.seriesSet[y].MODEL_CODE) {
											if (that.getCurrentLanguageKey() == that.seriesSet[y].LANGUAGE_KEY) {
												// lvBooking.seriesDesc = that.seriesSet.results[y].SERIES_DESC;
												lvBooking.series = that.seriesSet[y].SERIES_CODE;
											}
											// console.log(lvBooking.seriesDesc);
										}
									}*/
								}
							}
							lvBooking.brands = aBrandList.join();
							lvBooking.models = aModelList.join();
							lvBooking.years = aYearList.join();
							lvBooking.total = lvResult.I6_TOTAL;
							var iCatVInsert = true;

							if (lvResult.I6_TOTAL > 0) {
								that._aCategoryVisible.forEach(function (obj) {
									if (obj.categoryId === lvBooking.categoryId && obj.vendorId === lvBooking.vendorId) {
										iCatVInsert = false;
									}
								});
								if (iCatVInsert) {
									that._aCategoryVisible.push({
										"categoryId": lvBooking.categoryId,
										"vendorId": lvBooking.vendorId
									});
								}
							}
							currentBooking.partsBookings.push(lvBooking);

							// lvGrantTotal = lvGrantTotal + lvBooking.total;

						}
					}

					currentBooking.loaded = true;
					// currentBooking.partsBookingsTotal = lvGrantTotal;
					sap.ui.core.BusyIndicator.hide();
					viewModel.setProperty("/currentBooking", currentBooking);
					viewModel.setProperty(
						"/currentDetailTab", "BP");

					// that.prepareTheNewPartsBookings();
					that.setBookingStatus();
					viewModel.refresh(true);
				});
			}
		},

		click_ViewDealerNet: function (partNum) {
			var partNum = partNum.getSource().getParent().getBindingContext("viewModel").getProperty(partNum.getSource().getParent().getBindingContext(
				"viewModel").sPath).partNumber
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var partsBookings = viewModel.getProperty("/currentBooking/partsBookings");
			var lvDealer = viewModel.getProperty("/currentBooking/summary/dealerId");
			if (!!partsBookings && partsBookings.length > 0) {
				for (var i = 0; i < partsBookings.length; i++) {
					if (partsBookings[i].isNew) {
						this.getDealerNet(partNum, lvDealer, function (rvPartNumber, rvDealer, rvDealerNet, isOk) {
							var dialog = that._get_onDealerNetView();
							var viewModel = that.getModel(CONST_VIEW_MODEL);
							var currentBooking = viewModel.getProperty("/currentBooking");
							if (isOk) {
								dialog.getModel("viewDealerViewModel").setProperty("/PartNumber", rvPartNumber)
								dialog.getModel("viewDealerViewModel").setProperty("/DealerNet", rvDealerNet);
								jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), dialog);
								dialog.open();
							} else {
								dialog.getModel("viewDealerViewModel").setProperty("/DealerNet", JSON.parse(rvDealerNet.responseText).error.message.value);
								jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), dialog);
								dialog.open();
							}
						});
					}
				}
			}
		},

		onDealerNetOk: function () {
			if (!!this.onDealerNetView) {
				this.onDealerNetView.close()
			}
			this.onDealerNetView.close();
		},

		_get_onDealerNetView: function () {
			if (!this.onDealerNetView) {
				this.onDealerNetView = sap.ui.xmlfragment(this.getView().getId(),
					"tci.wave2.ui.bookingProgram.view.fragments.DealerViewDialog", this);
				var viewDealerViewModel = new JSONModel();
				// this.setModel(viewDealerViewModel, viewDealerViewModel);
				this.onDealerNetView.setModel(viewDealerViewModel, "viewDealerViewModel");

				this.onDealerNetView.setContentWidth("400px");
				this.getView().addDependent(this.onDealerNetView);
			}
			return this.onDealerNetView;
		},

		prepareTheNewPartsBookings: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var partsBookings = viewModel.getProperty("/currentBooking/partsBookings");
			var lvDealer = viewModel.getProperty("/currentBooking/summary/dealerId");
			if (!!partsBookings && partsBookings.length > 0) {
				for (var i = 0; i < partsBookings.length; i++) {
					if (partsBookings[i].isNew) {
						this.getDealerNet(partsBookings[i].partNumber, lvDealer, function (rvPartNumber, rvDealer, rvDealerNet, isOk) {
							if (isOk) {
								that.setTheDealerNet(rvPartNumber, rvDealerNet);
							}
						});
					}
				}
			}
		},

		setTheDealerNet: function (rvPartNumber, rvDealerNet) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var partsBookings = viewModel.getProperty("/currentBooking/partsBookings");
			if (!!partsBookings && partsBookings.length > 0) {
				for (var i = 0; i < partsBookings.length; i++) {
					if (partsBookings[i].isNew && !partsBookings[i].dealerNetReady && partsBookings[i].partNumber === rvPartNumber) {
						partsBookings[i].dealerNet = rvDealerNet;
						partsBookings[i].dealerNetReady = true;
					}
				}
				viewModel.setProperty("/currentBooking/partsBookings", partsBookings);

			}

		},

		onBrandFilterChange: function (oEvent) {
			var x = oEvent;
		},

		onBpConfirmViewSettingsDialog: function (oEvent) {
			var mParams = oEvent.getParameters();
			var sPath;
			var bDescending;
			var aSorters = [];

			if (mParams.sortItem) {
				sPath = mParams.sortItem.getKey();
				bDescending = mParams.sortDescending;
				aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
			}
			var table = this.periodsTable;
			var binding = table.getBinding("items");

			binding.sort(aSorters);

			var selectedSeries = oEvent.getSource().getModel(CONST_VIEW_MODEL).getData().currentBooking.filters.bp.selectedSeries;
			var selectedSeriesText = oEvent.getSource().getModel(CONST_VIEW_MODEL).getData().currentBooking.filters.bp.selectedSeriesText;
			var selectedYear = oEvent.getSource().getModel(CONST_VIEW_MODEL).getData().currentBooking.filters.bp.selectedYear;
			if (oEvent.getParameters().filterString !== "" || (selectedSeries !== "" && selectedYear !== "")) {
				var that = this;
				var viewModel = this.getModel(CONST_VIEW_MODEL);
				var currentBooking = viewModel.getProperty("/currentBooking");
				var xFilters = [];
				var orFilters = [];

				var isAll = false;
				if (!!currentBooking.filters.bp.categories && currentBooking.filters.bp.categories.length > 0) {
					orFilters = [];
					isAll = false;
					for (var xc = 0; xc < currentBooking.filters.bp.categories.length; xc++) {
						if (currentBooking.filters.bp.categories[xc].selected) {
							orFilters.push(new sap.ui.model.Filter("categoryId", sap.ui.model.FilterOperator.EQ, currentBooking.filters.bp.categories[xc].key));
						}
					}
					if (!!orFilters && orFilters.length > 0) {
						xFilters.push(new sap.ui.model.Filter(orFilters, false));
					}
				}

				if (!!currentBooking.filters.bp.vendors && currentBooking.filters.bp.vendors.length > 0) {
					orFilters = [];
					isAll = false;
					for (var xv = 0; xv < currentBooking.filters.bp.vendors.length; xv++) {
						if (currentBooking.filters.bp.vendors[xv].selected) {
							orFilters.push(new sap.ui.model.Filter("vendorName", sap.ui.model.FilterOperator.EQ, currentBooking.filters.bp.vendors[xv].desc));
						}
					}
					if (!!orFilters && orFilters.length > 0) {
						xFilters.push(new sap.ui.model.Filter(orFilters, false));
					}
				}
				var selectedBrand = null;
				if (!!currentBooking.filters.bp.brands && currentBooking.filters.bp.brands.length > 0) {
					for (var xb = 0; xb < currentBooking.filters.bp.brands.length; xb++) {
						if (!!currentBooking.filters.bp.brands[xb] && currentBooking.filters.bp.brands[xb].selected) {
							if (!!selectedBrand) {
								selectedBrand = null;
							} else {
								selectedBrand = currentBooking.filters.bp.brands[xb].key;
							}
						}
					}
				}
				// if (!!currentBooking.filters.bp.selectedModel) {
				// 	var selectedModel = currentBooking.filters.bp.selectedModel;
				// }
				if (!!currentBooking.filters.bp.selectedYear) {
					var selectedYear = currentBooking.filters.bp.selectedYear;
				}
				if (!!currentBooking.filters.bp.selectedSeries) {
					var selectedSeries = currentBooking.filters.bp.selectedSeries;
				}
				if (!!selectedBrand) {
					xFilters.push(new sap.ui.model.Filter("brands", sap.ui.model.FilterOperator.Contains, selectedBrand));
				}
				// if (!!selectedModel) {
				// 	if (selectedModel.lenght < 1 || selectedModel[0] === "ALL") {
				// 		if (!!selectedBrand) {
				// 			xFilters.push(new sap.ui.model.Filter("brands", sap.ui.model.FilterOperator.Contains, selectedBrand));
				// 		}
				// 		if (selectedModel[0] == "ALL" && selectedSeries !== null) {
				// 			if (!!currentBooking.filters.bp.modelList) {
				// 				for (var xc1 = 0; xc1 < currentBooking.filters.bp.modelList.length; xc1++) {
				// 					var modelKey = currentBooking.filters.bp.modelList[xc1].key;
				// 					if (modelKey !== "ALL") {
				// 						orFilters.push(new sap.ui.model.Filter("models", sap.ui.model.FilterOperator.Contains, modelKey));
				// 					}
				// 				}
				// 			}
				// 			xFilters.push(new sap.ui.model.Filter(orFilters, false));
				// 		}
				// 	} else {
				// 		orFilters = [];
				// 		for (var xc1 = 0; xc1 < selectedModel.length; xc1++) {
				// 			orFilters.push(new sap.ui.model.Filter("models", sap.ui.model.FilterOperator.Contains, selectedModel[xc1]));
				// 		}
				// 		if (!!orFilters && orFilters.length > 0) {
				// 			xFilters.push(new sap.ui.model.Filter(orFilters, false));
				// 		}
				// 	}
				// }

				if (!!selectedYear) {
					if (selectedYear.length > 0 && selectedYear[0] !== "ALL") {
						// orFilters.push(new sap.ui.model.Filter("years", sap.ui.model.FilterOperator.Contains, selectedYear[xc2]));
						orFilters = [];
						for (var xc2 = 0; xc2 < selectedYear.length; xc2++) {
							orFilters.push(new sap.ui.model.Filter("years", sap.ui.model.FilterOperator.Contains, selectedYear[xc2]));
						}

						orFilters.push(new sap.ui.model.Filter("series", sap.ui.model.FilterOperator.Contains, selectedSeries));
						if (!!orFilters && orFilters.length > 0) {
							xFilters.push(new sap.ui.model.Filter(orFilters, true));
						}
					}
				}

				var isPPB = false;
				var isPPP = false;
				var isPCB = false;
				var isPNC = false;
				var fPCB = null;
				var fPNC = null;
				if (!!currentBooking.filters.bp.parts && currentBooking.filters.bp.parts.length > 0) {
					orFilters = [];
					isAll = false;
					for (var xp = 0; xp < currentBooking.filters.bp.parts.length; xp++) {
						if (currentBooking.filters.bp.parts[xp].key === 'PPB' && currentBooking.filters.bp.parts[xp].selected) {
							orFilters.push(new sap.ui.model.Filter("priorBook", sap.ui.model.FilterOperator.GT, 0));
							isPPB = true;
						}
						if (currentBooking.filters.bp.parts[xp].key === 'PPP' && currentBooking.filters.bp.parts[xp].selected) {
							orFilters.push(new sap.ui.model.Filter("priorPurcahse", sap.ui.model.FilterOperator.GT, 0));
							isPPP = true;
						}
						if (currentBooking.filters.bp.parts[xp].key === 'PCB' && currentBooking.filters.bp.parts[xp].selected) {
							orFilters.push(new sap.ui.model.Filter("total", sap.ui.model.FilterOperator.GT, 0));
							isPCB = true;
						}
						if (currentBooking.filters.bp.parts[xp].key === 'PNC' && currentBooking.filters.bp.parts[xp].selected) {
							orFilters.push(new sap.ui.model.Filter("total", sap.ui.model.FilterOperator.LE, 0));
							isPNC = true;
						}
					}
					if (!!orFilters && orFilters.length > 0) {
						xFilters.push(new sap.ui.model.Filter(orFilters, false));
					}

				}

				// get binding 
				var table = this.periodsTable;
				var binding = table.getBinding("items");
				binding.filter(xFilters);
			} else {
				var table = this.periodsTable;
				var binding = table.getBinding("items");
				binding.filter([]);
			}

		},
		resetBpFilter: function (oEvent) {
			//just add the additional filter clear code.
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			currentBooking.filters.bp.selectedYear = ["ALL"];
			currentBooking.filters.bp.selectedModel = ["ALL"];
			currentBooking.filters.bp.selectedSeries = null;
			viewModel.setProperty(CONST_VIEW_MODEL, currentBooking);
		},

		onYearFilterChanges: function (oEvent) {
			var selectedKeys = oEvent.getSource().getSelectedKeys();
			var currentKey = oEvent.getParameter("changedItem").getProperty("key");
			var i = -1;
			if (!!currentKey && currentKey === "ALL") {
				selectedKeys = ["ALL"];
			} else {
				i = selectedKeys.indexOf("ALL");
				if (i >= 0) {
					selectedKeys.splice(i, 1);
				}
			}
			oEvent.getSource().setSelectedKeys(selectedKeys);
		},

		onModelFilterChanges: function (oEvent) {
			var selectedKeys = oEvent.getSource().getSelectedKeys();
			var currentKey = oEvent.getParameter("changedItem").getProperty("key");
			var i = -1;
			if (!!currentKey && currentKey === "ALL") {
				selectedKeys = ["ALL"];
			} else {
				i = selectedKeys.indexOf("ALL");
				if (i >= 0) {
					selectedKeys.splice(i, 1);
				}
			}
			oEvent.getSource().setSelectedKeys(selectedKeys);
		},

		onModelFilterChanged: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var oldSelection = null;
			var foundOld = false;
			var selectedItems = oEvent.getParameter('selectedItems');
			var currentYears = null;
			var years = [];
			if (!!selectedItems && selectedItems.length > 0) {
				for (var x = 0; x < selectedItems.length; x++) {
					currentYears = selectedItems[x].getBindingContext("viewModel").getProperty("years");
					if (!!currentYears && currentYears.length > 1) { // more than all 
						for (var y = 0; y < currentYears.length; y++) {
							if (currentYears[y].key === "ALL" || years.indexOf(currentYears[y].key) > 0) {
								// DO NOTHI*NG 
							} else {
								years.push(currentYears[y].key);
							}
						}
					}
				}
				years.sort();
			}
			years.unshift("ALL");
			currentBooking.filters.bp.yearList = [];
			for (var z = 0; z < years.length; z++) {
				currentBooking.filters.bp.yearList.push({
					key: years[z]
				});
			}

			oldSelection = currentBooking.filters.bp.selectedYear;
			currentBooking.filters.bp.selectedYear = [];
			if (!!oldSelection) {
				for (var y = 0; y < currentBooking.filters.bp.yearList.length; y++) {
					if (oldSelection.indexOf(currentBooking.filters.bp.yearList[y].key) > 0) {
						currentBooking.filters.bp.selectedYear.push(currentBooking.filters.bp.yearList[y].key);
					}
				}
			}
			if (currentBooking.filters.bp.selectedYear.length <= 0) {
				currentBooking.filters.bp.selectedYear = ["ALL"];
			}
			viewModel.setProperty("/currentBooking", currentBooking);
		},

		onSeriesFilterChange: function (oEvent) {
			var modelList = [];
			var allModelList = [];
			var yearList = [];
			var lvAllYearList = [];
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var selectedSeries = currentBooking.filters.bp.selectedSeries;
			var selectedOption = this.SearchOptionList.getSelectedKey();

			// var selectedSeriesText = oEvent.getParameter("selectedItem").getProperty("text");
			currentBooking.filters.bp.selectedSeriesText = oEvent.getParameter("selectedItem").getProperty("text");
			var oldSelect = null;
			var isAll = false;
			var oldSelection = null;
			var foundOld = false;

			if (!!currentBooking.filters.bp.brands && currentBooking.filters.bp.brands.length > 0) {
				for (var x = 0; x < currentBooking.filters.bp.brands.length; x++) {
					for (var y = 0; y < currentBooking.filters.bp.brands[x].series.length; y++) {
						if (selectedSeries === currentBooking.filters.bp.brands[x].series[y].key) {
							allModelList = allModelList.concat(currentBooking.filters.bp.brands[x].series[y].models);
						}
					}
					if (oldSelect === null) {
						oldSelect = currentBooking.filters.bp.brands[x].selected;
					}
					if (oldSelect !== currentBooking.filters.bp.brands[x].selected) {
						isAll = false;
					}

				}

				// sorting 
				// allModelList.sort(function alphabetical(a, b) {
				// 	var A = a.desc.toLowerCase();
				// 	var B = b.desc.toLowerCase();
				// 	if (A < B) {
				// 		return -1;
				// 	} else if (A > B) {
				// 		return 1;
				// 	} else {
				// 		return 0;
				// 	}
				// });

				// propare the local all year s
				// PREPARE THE YEAR LIST FOR ALL MODEL  OF THE BRAND 
				for (var y = 0; y < allModelList.length; y++) {
					yearList = allModelList[y].years;
					for (var z = 0; z < yearList.length; z++) {
						if (lvAllYearList.indexOf(yearList[z].key) < 0 && yearList[z].key !== 'ALL') {
							lvAllYearList.push(yearList[z].key);
						}
					}
				}
				// reuse yearList
				/*	if (isAll) {
						yearList = currentBooking.filters.bp.allYears;
						modelList = allModelList;
					} else {*/
				yearList = [];
				lvAllYearList.sort();
				lvAllYearList.unshift("ALL");

				for (var x1 = 0; x1 < lvAllYearList.length; x1++) {
					yearList.push({
						key: lvAllYearList[x1]
					});

				}
				//}
				if (selectedOption == resourceBundle.getText("Label.Vechicle.Series")) {
					yearList = [];
					yearList.push({
						key: "ALL"
					});

					yearList.push({
						key: this.FilterValue1
					});

				}
				allModelList.unshift({
					key: "ALL",
					desc: resourceBundle.getText("Label.All.Models"),
					years: yearList
				});

				currentBooking.filters.bp.modelList = allModelList;
				oldSelection = currentBooking.filters.bp.selectedModel;
				currentBooking.filters.bp.selectedModel = ["ALL"];
				//currentBooking.filters.bp.yearList = currentBooking.filters.bp.allYears;

				currentBooking.filters.bp.yearList = yearList;
				if (!!oldSelection) {
					for (var y = 0; y < currentBooking.filters.bp.modelList.length; y++) {
						if (currentBooking.filters.bp.modelList[y].key === oldSelection) {
							currentBooking.filters.bp.yearList = currentBooking.filters.bp.modelList[y].years;
							foundOld = true;
						}
					}
					if (foundOld) {
						currentBooking.filters.bp.selectedModel = oldSelection;
					}
				}

				oldSelection = currentBooking.filters.bp.selectedYear;
				foundOld = false;
				currentBooking.filters.bp.selectedYear = ["ALL"];
				if (!!oldSelection) {
					for (var y1 = 0; y1 < currentBooking.filters.bp.yearList.length; y1++) {
						if (currentBooking.filters.bp.yearList[y1].key === oldSelection) {
							foundOld = true;
						}
					}
					if (foundOld) {
						currentBooking.filters.bp.selectedYear = oldSelection;
					}
				}

				viewModel.setProperty("/currentBooking", currentBooking);
			}

		},

		onFilterDetailPageOpened: function (oEvent) {
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentBooking = viewModel.getProperty("/currentBooking");
			var cId = oEvent.getParameter('parentFilterItem').getProperty("key");
			var oldSelect = null;
			var seriesList = [];
			var isAll = true;

			if (cId === "4") {
				if (!!currentBooking.filters.bp.brands && currentBooking.filters.bp.brands.length > 0) {
					for (var x = 0; x < currentBooking.filters.bp.brands.length; x++) {
						seriesList = seriesList.concat(currentBooking.filters.bp.brands[x].series);

						if (oldSelect === null) {
							oldSelect = currentBooking.filters.bp.brands[x].selected;
						}
						if (oldSelect !== currentBooking.filters.bp.brands[x].selected) {
							isAll = false;
						}
						if (currentBooking.filters.bp.brands[x].selected) {
							seriesList = seriesList.concat(currentBooking.filters.bp.brands[x].series);
						}
					}
				}

				seriesList = seriesList.filter((item, index, array) => {
					return seriesList.map((mapItem) => mapItem['key']).indexOf(item['key']) === index
				});

				var newList = [];
				for (var m = 0; m < seriesList.length; m++) {
					for (var n = 0; n < currentBooking.filters.bp.seriesCode.length; n++) {
						if (currentBooking.filters.bp.seriesCode[n] === seriesList[m].key) {
							newList.push(seriesList[m]);
						}

					}
				}
				currentBooking.filters.bp.seriesList = newList;

				viewModel.setProperty("/currentBooking", currentBooking);
			}

		},
		onConfirmViewSettingsDialog: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var conditions = viewModel.getProperty("/selectCondotions");
			var currentBooking = viewModel.getProperty("/currentBooking");
		},

		// for now, only for 
		setDynamicColumn: function (periods) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var dynamicHeader = viewModel.getProperty("/dynamicHeader");
			for (var i = 0; i < dynamicHeader.length; i++) {
				if (!!periods && periods.length > i) {
					dynamicHeader[i].title = periods[i].nameTitle1;
					dynamicHeader[i].enable = true;
				} else {
					dynamicHeader[i].title = "";
					dynamicHeader[i].enable = false;
				}
			}
			viewModel.setProperty("/dynamicHeader", dynamicHeader);
		},

		// for now, only for 
		getColumnIndex: function (periods, aPeriod) {
			var index = -1;
			if (!!periods && periods.length > 0) {
				for (var i = 0; i < periods.length; i++) {
					if (periods[i].name === aPeriod) {
						index = i;
					}
				}
			}
			return index;
		},

		onSelectTab: function (oEvent) {
			var key = oEvent.getParameter("selectedKey");
			if (!!key && key === "SD") {
				this.loadDeliverySchedule();
			}
		},

		handleDealerKeyDialogPress: function (oEvent) {
			var dialog = this._get_oDealerSelectDialog();
			var binding = dialog.getBinding("items");
			var resourceBundle = this.getResourceBundle();
			// clear the filter 
			binding.filter([]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
			this.SearchOptionList.setSelectedKey(resourceBundle.getText("Label.Vendor"));
			this.SearchOptionList.setEnabled(false);

			this.getView().byId("VendorSearchCombo").setEnabled(false);
			this.getView().byId("TiresizeSearchCombo").setEnabled(false);
			this.getView().byId("SeriesCombo").setEnabled(false);
			this.getView().byId("YearCombo").setEnabled(false);

		},

		handleDealerSearchDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var conditions = viewModel.getProperty("/selectCondotions");

			if (!!oSelectedItem) {
				conditions.dealerCode = oSelectedItem.getTitle();
				conditions.dealerId = oSelectedItem.getInfo();
				conditions.dealerName = oSelectedItem.getDescription();
			} else {
				// do nothing 					
			}
			viewModel.setProperty("/selectCondotions", conditions);
		},

		handleDealerSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilters = [];
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			var oFilter = null;
			if (!!sValue) {
				oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("BusinessPartner", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("OrganizationBPName1", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("SearchTerm2", sap.ui.model.FilterOperator.Contains, sValue)
				],
					"false"
				);
				oFilters.push(oFilter);
			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilters);
		}

	});
});