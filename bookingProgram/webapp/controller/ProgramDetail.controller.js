/* global moment:true */
/* global XLSX:true */
/* global Uint8Array:true */
sap.ui.define([
	"tci/wave2/ui/bookingProgram/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"tci/wave2/ui/bookingProgram/model/formatter",
	"sap/ui/core/util/Export",
	"sap/ui/core/util/ExportTypeCSV",
	"sap/m/MessageToast",
	'sap/ui/model/Filter',
], function (BaseController, MessageBox, JSONModel, formatter, Export, ExportTypeCSV, MessageToast, Filter) {
	"use strict";

	var CONT_PROGRAM_MODEL = "programModel";
	// var CONT_PRODUCT_MODEL = "productModel";
	var CONT_VENDOR_MODEL = "vendorModel";
	var CONST_VIEW_MODEL = "viewModel";
	var CONST_DEP_MODEL = "depModel";

	var CONT_CA_CATEGORY_MODEL = "caCategoryModel";
	var CONT_DM_CATEGORY_MODEL = "dmCategoryModel";
	var CONT_DM_VENDOR_MODEL = "dmVendorModel";
	var CONT_DEL_METHOD_MODEL = "dmDelMethodModel";
	var CONT_DL_VENDOR_MODEL = "dlVendorModel";
	var thisView;

	return BaseController.extend("tci.wave2.ui.bookingProgram.controller.ProgramDetail", {
		formatter: formatter,

		onInit: function () {
			var that = this;
			thisView = this;

			// EST Clock - start
			this.clockServices();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ProgramDetail").attachPatternMatched(this._onObjectMatched, this);

			//message
			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.setModel(oMessageManager.getMessageModel(), "message");
			// or just do it for the whole view
			oMessageManager.registerObject(this.getView(), true);

			// register models
			// default mode
			var appStateModel = this.getAppStateModel();
			appStateModel.setProperty("/tabKey", "PA");
			this.getView().setModel(appStateModel);

			var viewState = this.getDefualtViewState();
			var viewModel = new JSONModel();
			viewModel.setData(viewState);
			this.setModel(viewModel, CONST_VIEW_MODEL);

			this.getOwnerComponent().getDepartmentModel(function (theModel) {
				that.setModel(theModel, CONST_DEP_MODEL);
			});

			//this.setCategoryModel();
			this.setVendorModel();
			this.setBookingModel();

			// object level attributes 	
			this.orDealerCondition = this.getDealerCondition();
			this.draftInd = this.byId("draftInd");
			this.hasDirtyContent = false;
			this.innerNavi = this.byId("tabNaviContainer");

			// the category
			if (!!!this._categoryFragmentId) {
				this._categoryFragmentId = this.getView().createId("categoryFragment");
			}

			if (!!!this._categoryTable) {
				this._categoryTable = sap.ui.core.Fragment.byId(this._categoryFragmentId, "categoryTable");
			}
			this._categoryTable.setModel(that.getBookingOdataV2Model());

			if (!!!this._categoryRowT) {
				this._categoryRowT = sap.ui.core.Fragment.byId(this._categoryFragmentId, "categoryRowT").clone();
			}

			if (!!!this._deliveryLocFragmentId) {
				this._deliveryLocFragmentId = this.getView().createId("delLocFragment");
			}

			if (!!!this._delLocTable) {
				this._delLocTable = sap.ui.core.Fragment.byId(this._deliveryLocFragmentId, "deliveryLocationTable");
				this._delLocTableNoneditable = sap.ui.core.Fragment.byId(this._deliveryLocFragmentId, "deliveryLocationTableNonEditable");
			}

			// if (!!!this._categorySelector) {
			// 	this._categorySelector = sap.ui.core.Fragment.byId(this._categoryFragmentId, "categorySelector1");
			// }

			// the vendor
			if (!!!this._vendorFragmentId) {
				this._vendorFragmentId = this.getView().createId("vendorFragment");
			}

			if (!!!this._vendorTable) {
				this._vendorTable = sap.ui.core.Fragment.byId(this._vendorFragmentId, "vendorTable");
			}
			this._vendorTable.setModel(that.getBookingOdataV2Model());

			if (!!!this._vendorRowT) {
				this._vendorRowT = sap.ui.core.Fragment.byId(this._vendorFragmentId, "vendorRowT").clone();
			}

			// the deliveryMethods
			if (!!!this._deliveryMethodsFragmentId) {
				this._deliveryMethodsFragmentId = this.getView().createId("deliveryMethodsFragment");
			}

			if (!!!this._deliveryMethodsTable) {
				this._deliveryMethodsTable = sap.ui.core.Fragment.byId(this._deliveryMethodsFragmentId, "deliveryMethodsTable");
			}
			this._deliveryMethodsTable.setModel(that.getBookingOdataV2Model());

			if (!!!this._deliveryMethodsRowT) {
				this._deliveryMethodsRowT = sap.ui.core.Fragment.byId(this._deliveryMethodsFragmentId, "deliveryMethodsRowT").clone();
			}

			// the partsTable
			if (!!!this._partsFragmentId) {
				this._partsFragmentId = this.getView().createId("partsFragment");
			}

			if (!!!this._partsTable) {
				this._partsTable = sap.ui.core.Fragment.byId(this._partsFragmentId, "partsTable");
			}
			this._partsTable.setModel(that.getBookingOdataV2Model());

			if (!!!this._partsRowT) {
				this._partsRowT = sap.ui.core.Fragment.byId(this._partsFragmentId, "partsRowT").clone();
			}

			// the partFitmentTable
			if (!!!this._partFitmentFragmentId) {
				this._partFitmentFragmentId = this.getView().createId("partFitmentFragment");
			}

			if (!!!this._partFitmentTable) {
				this._partFitmentTable = sap.ui.core.Fragment.byId(this._partFitmentFragmentId, "partFitmentTable");
			}
			this._partFitmentTable.setModel(that.getBookingOdataV2Model());

			if (!!!this.nextPartFitmentBtn) {
				this.nextPartFitmentBtn = sap.ui.core.Fragment.byId(this._partFitmentFragmentId, "partFitmentNextBtn");
			}
			if (!!!this.prevPartFitmentBtn) {
				this.prevPartFitmentBtn = sap.ui.core.Fragment.byId(this._partFitmentFragmentId, "partFitmentPrevBtn");
			}
			if (!!!this.nextPartsBtn) {
				this.nextPartsBtn = sap.ui.core.Fragment.byId(this._partsFragmentId, "partsNextBtn");
			}
			if (!!!this.prevPartsBtn) {
				this.prevPartsBtn = sap.ui.core.Fragment.byId(this._partsFragmentId, "partsPrevBtn");
			}

			if (!!!this._partFitmentRowT) {
				this._partFitmentRowT = sap.ui.core.Fragment.byId(this._partFitmentFragmentId, "partFitmentRowT").clone();
			}

			// the priorPurchasesTable
			if (!!!this._priorPurchasesFragmentId) {
				this._priorPurchasesFragmentId = this.getView().createId("priorPurchasesFragment");
			}

			if (!!!this._priorPurchasesTable) {
				this._priorPurchasesTable = sap.ui.core.Fragment.byId(this._priorPurchasesFragmentId, "priorPurchasesTable");
			}
			this._priorPurchasesTable.setModel(that.getBookingOdataV2Model());

			if (!!!this._priorPurchasesRowT) {
				this._priorPurchasesRowT = sap.ui.core.Fragment.byId(this._priorPurchasesFragmentId, "priorPurchasesRowT").clone();
			}
			this.getView().addStyleClass("sapUiSizeCompact");
		},

		_onObjectMatched: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var isNew = false;
			var encodedKey = oEvent.getParameter("arguments").encodedKey;
			var uuid = null;
			var defaultViewData = null;

			var appStateModel = this.getAppStateModel();
			appStateModel.setProperty("/tabKey", "PA");

			// load the security based profile 
			sap.ui.core.BusyIndicator.show(0);
			//viewModel.setProperty("/selectedTabKey", "Summary");
			viewModel.setProperty("/selectedTabKey", sap.ui.getCore().getModel("CurrentProgressModel").CurrentSubTab);
			defaultViewData = this.defaultcurrentProgramData();
			viewModel.setProperty("/currentProgram", defaultViewData);

			viewModel.setProperty("/displayMode", true);
			if (!!encodedKey) {
				viewModel.setProperty("/selectedTabKey", "Summary");
				if (encodedKey === "NEW") {
					isNew = true;

					viewModel.setProperty("/displayMode", false);
				} else {
					uuid = encodedKey;
				}
			}

			viewModel.setProperty("/editable", false);
			viewModel.setProperty("/submitable", false);
			this.dealerList = [];

			if (!isNew && !!uuid) {
				this.getDistinctDealersList(uuid, function (data, ok) {
					if (ok && data) {
						for (var i = 0; i < data.length; i++) {

							if (!that.dealerList.includes(data[i].DEALER_CODE) && data[i].DEALER_CODE) {
								that.dealerList.push(data[i].DEALER_CODE);

							}
						}
					}

				});
			}

			this.getAppProfile(function (profileModel) {
				sap.ui.core.BusyIndicator.hide();

				if (!!profileModel) {
					var profileModelData = profileModel.getData();
					appStateModel.setProperty("/division", profileModelData.userData.division);

					if (!isNew && !!uuid) {
						that.loadSummary(uuid, profileModelData);
					} else { //consider is new - set the default view 
						defaultViewData.summary.department = profileModelData.userData.department;
						viewModel.setProperty("/currentProgram", defaultViewData);
					}

				} else {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(resourceBundle.getText("Message.error.system"));
				}
			});
			//this.innerNavi.to(this.byId("Summary"), "show");
			this.innerNavi.to(this.byId(sap.ui.getCore().getModel("CurrentProgressModel").CurrentSubTab), "show");
		},

		refresh: function () {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var appStateModel = this.getAppStateModel();

			this.getAppProfile(function (profileModel) {
				sap.ui.core.BusyIndicator.hide();
				if (!!profileModel) {
					var profileModelData = profileModel.getData();
					appStateModel.setProperty("/division", profileModelData.userData.division);

					that.loadSummary(currentProgram.programUUId, profileModelData);
				} else {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(resourceBundle.getText("Message.error.system"));
				}
			});
		},

		getDefualtViewState: function () {
			var viewState = {
				selectedTabKey: "Summary",
				displayMode: false,
				editable: false,
				submitable: false,

				tabs: {
					Category: {
						contHigh: "70%"
					},
					Vendor: {
						contHigh: "70%"
					},
					DeliveryMethod: {
						contHigh: "70%"
					},
					DeliveryLocation: {
						contHigh: "65%"
					},
					Parts: {
						contHigh: "80%"
					},
					PartFitments: {
						contHigh: "80%"
					},
					PriorPurchases: {
						contHigh: "70%"
					}
				},
				hasDirtyContent: true,

				currentProgram: this.defaultcurrentProgramData(),

				filteredItems: 0,
				filterPanelEnable: true,
				contHigh: "30%",
				sortDescending: false,
				sortKey: "TCI_order_no",
				orders: [],
				filterAll: true,
				filterAllx: true
			};
			return viewState;
		},

		// will be called by timer 
		updatePageStatus: function () {

			var today = new Date();
			var aday = 86400000;

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			//currentProgram.summary.bWindowOpenDateEst.t - 
			var wOpen = moment(currentProgram.summary.bWindowOpenDateEst);
			var wClose = moment(currentProgram.summary.bWindowCloseDateEst);
			var fPeriod = Number(currentProgram.summary.finalWarningDays);
			var iPeriod = Number(currentProgram.summary.initialWaringDays);
			if (currentProgram.summary.status === "CP") {
				// completed
			} else {
				if (wOpen.isAfter(today)) {
					// future
					currentProgram.summary.status = "FT";
				} else {
					if ((wClose.valueOf() + aday) <= today.getTime()) {
						// close
						currentProgram.summary.status = "CL";
					} else {
						// open 
						currentProgram.summary.status = "OP";
					}
				}
			}

			viewModel.setProperty("/currentProgram", currentProgram);

			// periods calculation
			var inidays = this.getView().byId("initialWaringDays");
			var findays = this.getView().byId("finalWarningDays").addStyleClass("myRedText");
			wClose.subtract(fPeriod - 1, "days");
			if (currentProgram.summary.status === "OP") {
				if (wClose.isBefore(today)) {
					inidays.addStyleClass("myYellowText");
					findays.addStyleClass("myRedText");
				} else {
					wClose.subtract(iPeriod - fPeriod, "days");
					if (wClose.isBefore(today)) {
						inidays.addStyleClass("myYellowText");
						findays.removeStyleClass("myRedText");
					} else {
						inidays.removeStyleClass("myYellowText");
						findays.removeStyleClass("myRedText");
					}
				}
			} else {
				inidays.removeStyleClass("myYellowText");
				findays.removeStyleClass("myRedText");
			}

			if (currentProgram.summary.status === "CL") {
				viewModel.setProperty("/submitable", true);
			} else {
				viewModel.setProperty("/submitable", false);
			}
		},

		setBookingModel: function () {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			that.setModel(bModel, CONT_PROGRAM_MODEL);
		},

		setVendorModel: function () {
			var that = this;
			var bModel = this.getBPModel();
			that.setModel(bModel, CONT_VENDOR_MODEL);
		},

		_get_oVendorSelectDialog: function () {
			if (!this._oVendorSelectDialog) {
				this._oVendorSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.VendorSelectDialog", this);
				this._oVendorSelectDialog.setModel(this.getBPModel());
				this._oVendorSelectDialog.getBinding("items").attachChange(this.updateVendorFinished, this);
				this.getView().addDependent(this._oVendorSelectDialog);
				this._oVendorSelectDialog.setGrowing(true);
				this._oVendorSelectDialog.setGrowingThreshold(20);
			}
			return this._oVendorSelectDialog;
		},

		_get_oVModelSelectDialog: function () {
			if (!this._oVModelSelectDialog) {
				this._oVModelSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.ModelSelectDialog", this);
				this._oVModelSelectDialog.setModel(this.getVehicleCatalogModel());
				// this._oVendorSelectDialog.getBinding("items").attachChange(this.updateVendorFinished, this);
				this.getView().addDependent(this._oVModelSelectDialog);
				this._oVModelSelectDialog.setGrowing(true);
				this._oVModelSelectDialog.setGrowingThreshold(20);
			}
			return this._oVModelSelectDialog;
		},

		_get_oDealerSelectDialog: function () {
			if (!this._oDealerSelectDialog) {
				this._oDealerSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.DealerSelectDialog", this);
				this._oDealerSelectDialog.setModel(this.getBPModel());
				this._oDealerSelectDialog.getBinding("items").attachChange(this.updateDealerFinished, this);
				this.getView().addDependent(this._oDealerSelectDialog);
				this._oDealerSelectDialog.setGrowing(true);
				this._oDealerSelectDialog.setGrowingThreshold(20);
			}
			return this._oDealerSelectDialog;
		},

		_get_oPartsSelectDialog: function () {
			if (!this._oPartsSelectDialog) {
				this._oPartsSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.PartsSelectDialog", this);
				this._oPartsSelectDialog.setModel(this.getVendorMeterialModel());
				//this._oPartsSelectDialog.getBinding("items").attachChange(this.updatePartsFinished, this);
				this.getView().addDependent(this._oPartsSelectDialog);
				this._oPartsSelectDialog.setGrowing(true);
				this._oPartsSelectDialog.setGrowingThreshold(20);
			}
			return this._oPartsSelectDialog;
		},

		_get_oCatPartsSelectDialog: function () {
			if (!this._oCatPartsSelectDialog) {
				this._oCatPartsSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.CategoryPartsSelectDialog", this);
				this._oCatPartsSelectDialog.setModel(this.getProductModel());
				this._oCatPartsSelectDialog.getBinding("items").attachChange(this.updatePartsFinished, this);
				this.getView().addDependent(this._oCatPartsSelectDialog);
				this._oCatPartsSelectDialog.setGrowing(true);
				this._oCatPartsSelectDialog.setGrowingThreshold(20);
			}
			return this._oCatPartsSelectDialog;
		},

		_get_oCpProgramSelectDialog: function () {
			if (!this._oCpProgramSelectDialog) {
				this._oCpProgramSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.CpProgramSelectDialog", this);
				this._oCpProgramSelectDialog.setModel(this.getBookingOdataV2Model());
				// this._oCpProgramSelectDialog.getBinding("items").attachChange(this.updateCpProgramFinished, this);
				this.getView().addDependent(this._oCpProgramSelectDialog);
				this._oCpProgramSelectDialog.setGrowing(true);
				this._oCpProgramSelectDialog.setGrowingThreshold(20);
			}
			return this._oCpProgramSelectDialog;
		},

		_get_oProgramPartsSelectDialog: function () {
			var bModel = this.getBookingOdataV2Model();
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			var currentProgram = viewModel.getProperty("/currentProgram");
			if (!this._oProgramPartsSelectDialog) {
				this._oProgramPartsSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.ProgramPartsSelectDialog", this);
				this.getView().addDependent(this._oProgramPartsSelectDialog);

			}
			var filters = [];
			filters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));
			filters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));
			filters.push(new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, 'X'));

			var key = "/ProgramPartLangSet";

			bModel.read(key, {
				urlParameters: {

					"$skip": 0,
					"$top": 100
				},
				filters: filters,
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel(oData.results);
					jQuery.sap.syncStyleClass("sapUiSizeCompact", thisView.getView(), thisView._oProgramPartsSelectDialog);
					thisView._oProgramPartsSelectDialog.setModel(JSONModel);
					//thisView._oProgramPartsSelectDialog.open();
					//sap.ui.core.BusyIndicator.hide();

					thisView._oProgramPartsSelectDialog.setGrowing(true);
					thisView._oProgramPartsSelectDialog.setGrowingThreshold(20);

				},
				error: function (err) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					thisView._oProgramPartsSelectDialog.setModel(JSONModel);

					//sap.ui.core.BusyIndicator.hide();
					console.log(err);
				}
			});
			this._oProgramPartsSelectDialog.open();

		},

		_get_oProgramDmVenSelectDialog: function () {
			/*	var viewModel = this.getModel(CONST_VIEW_MODEL);

				if (!this._oProgramDmVenSelectDialog) {
					this._oProgramDmVenSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.ProgramDmVenSelectDialog", this);
					this._oProgramDmVenSelectDialog.setModel(this.getBookingOdataV2Model())
					// this._oCpProgramSelectDialog.getBinding("items").attachChange(this.updateCpProgramFinished, this);
					this.getView().addDependent(this._oProgramDmVenSelectDialog);
					this._oProgramDmVenSelectDialog.setGrowing(true);
					this._oProgramDmVenSelectDialog.setGrowingThreshold(20);
				}*/
			var bModel = this.getBookingOdataV2Model();
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			var currentProgram = viewModel.getProperty("/currentProgram");
			if (!this._oProgramDmVenSelectDialog) {
				this._oProgramDmVenSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.ProgramDmVenSelectDialog", this);
				this.getView().addDependent(this._oProgramDmVenSelectDialog);

			}
			var filters = [];
			filters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));
			filters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));
			filters.push(new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, 'X'));

			var key = "/ProgramVendorLangSet";

			bModel.read(key, {
				urlParameters: {

					"$skip": 0,
					"$top": 100
				},
				filters: filters,
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel(oData.results);
					jQuery.sap.syncStyleClass("sapUiSizeCompact", thisView.getView(), thisView._oProgramDmVenSelectDialog);
					thisView._oProgramDmVenSelectDialog.setModel(JSONModel);
					//thisView._oProgramPartsSelectDialog.open();
					//sap.ui.core.BusyIndicator.hide();

					thisView._oProgramDmVenSelectDialog.setGrowing(true);
					thisView._oProgramDmVenSelectDialog.setGrowingThreshold(20);

				},
				error: function (err) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					thisView._oProgramDmVenSelectDialog.setModel(JSONModel);

					//sap.ui.core.BusyIndicator.hide();
					console.log(err);
				}
			});

			return this._oProgramDmVenSelectDialog;
		},

		_get_oProgramDmSelectDialog: function () {
			if (!this._oProgramDmSelectDialog) {
				this._oProgramDmSelectDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.ProgramDmSelectDialog", this);
				this._oProgramDmSelectDialog.setModel(this.getBookingOdataV2Model());
				// this._oCpProgramSelectDialog.getBinding("items").attachChange(this.updateCpProgramFinished, this);
				this.getView().addDependent(this._oProgramDmSelectDialog);
				this._oProgramDmSelectDialog.setGrowing(true);
				this._oProgramDmSelectDialog.setGrowingThreshold(20);
			}
			return this._oProgramDmSelectDialog;
		},

		handleVModelDialogPress: function (oEvent) {
			var dialog = this._get_oVModelSelectDialog();
			var oBinding = dialog.getBinding("items");
			oBinding.aFilters = null;
			dialog.getModel().refresh(true);
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
		},

		handleAddressInputDialogPress: function (oEvent) {
			var that = this;
			var sPath = oEvent.getSource().getParent().getBindingContext("viewModel").sPath;
			if (!this._oAddressInputDialog) {
				this._oAddressInputDialog = sap.ui.xmlfragment(this.getView().getId(),
					"tci.wave2.ui.bookingProgram.view.fragments.AddressInputDialog", this);
				this.getView().addDependent(this._oAddressInputDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), that._oAddressInputDialog);
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var modelX = new JSONModel();
			var data = viewModel.getProperty(sPath);
			data.sPath = sPath;
			modelX.setData(data);
			that._oAddressInputDialog.setModel(modelX);
			that._oAddressInputDialog.open();
		},

		onItemImportDialogCancel: function (oEvent) {
			if (!!this._oItemImportDialog) {
				this._oItemImportDialog.close();
			}
		},

		onItemImportDialogOk: function (oEvent) {
			if (!!this._oItemImportDialog) {
				this._oItemImportDialog.close();
			}
		},

		onError: function (oEvent) {
			var that = this;
			var lineObject = oEvent.getSource().getBindingContext('viewModel').getObject();
			var messages = [];

			if (!!lineObject && lineObject.hasError && !!lineObject.to_messages && !!lineObject.to_messages.results && lineObject.to_messages.results
				.length > 0) {
				if (!this._oErrorPopover /*Not Null*/) {
					this._oErrorPopover = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.LineErrorPopover", this);
					this.getView().addDependent(this._oErrorPopover);
				}
				for (var i = 0; i < lineObject.to_messages.results.length; i++) {
					messages.push(lineObject.to_messages.results[i].ERROR_DESC);
				}
				var oModel = new JSONModel();
				var mData = {};

				mData.message = messages.join("<BR/>");
				oModel.setData(mData);
				this._oErrorPopover.setModel(oModel);
				this._oErrorPopover.openBy(oEvent.getSource());
			}
		},

		handleCloseButton: function (oEvent) {
			this._oErrorPopover.close();
		},

		updateDeliveryLocation: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var currentVendor = currentProgram.deliveryLocations.currentVendor.toString();

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var obj = null;
			var aKey = null;

			var perT = 0;
			var todoCountF = 0;

			var addedKeys = [];
			var objectList = [];
			var errorCode = [];

			//sap.ui.core.BusyIndicator.show(0);

			this.onOpenDialog();

			if (!!currentImportitems && currentImportitems.length > 0) {
				todoCountF = currentImportitems.length;

				for (var x1 = 0; x1 < currentImportitems.length; x1++) {
					errorCode = [];
					obj = {};

					if (!!currentImportitems[x1].vendorid) {
						obj.vendorId = currentImportitems[x1].vendorid.toString();
					} else {
						obj.vendorId = "";
					}

					// obj.vendorId = currentVendor;
					if (!!currentImportitems[x1].locationid) {
						obj.locationId = currentImportitems[x1].locationid.toString();
					} else {
						obj.locationId = "";
					}

					if (!!currentImportitems[x1].englishName) {
						obj.enDesc = currentImportitems[x1].englishName.toString();
					} else {
						obj.enDesc = "";
					}

					if (!!currentImportitems[x1].frenchName) {
						obj.frDesc = currentImportitems[x1].frenchName.toString();
					} else {
						obj.frDesc = "";
					}
					//Changed by Devika on 05-01-2024 (added toString() )
					obj.address1 = !!(currentImportitems[x1].address1) ? (currentImportitems[x1].address1).toString() : "";
					obj.address2 = !!(currentImportitems[x1].address2) ? (currentImportitems[x1].address2).toString() : "";

					if (!!currentImportitems[x1].city) {
						obj.city = currentImportitems[x1].city.toString();
					} else {
						obj.city = "";
					}

					if (!!currentImportitems[x1].province) {
						obj.province = currentImportitems[x1].province.toString();
					} else {
						obj.province = "";
					}

					if (!!currentImportitems[x1].zip) {
						obj.postalCode = currentImportitems[x1].zip.toString();
					} else {
						obj.postalCode = "";
					}

					if (!!currentImportitems[x1].phone) {
						obj.phoneNumber = currentImportitems[x1].phone.toString();
					} else {
						obj.phoneNumber = "";
					}

					currentImportitems[x1].status = "UP";

					if (errorCode.length > 0) {
						obj.hasError = true;
						obj.errorCodes = errorCode.join();
					} else {
						obj.hasError = false;
						obj.errorCodes = "";
					}
					objectList.push(obj);
				}

				perT = 50;
				theModel.setProperty("/progressValue", perT);
				theModel.setProperty("/progressValueP", "" + perT + "%");
				theModel.setProperty("/currentImportitems", currentImportitems);

				var finalData = {};
				finalData.updateList = objectList;
				finalData.updatedBy = that.getUserId();
				finalData.programUuid = currentProgram.programUUId;

				that.saveUploadedDeliveryLocationList(finalData, function (ok) {
					perT = 100;
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");
					theModel.setProperty("/isOk", true);
					theModel.setProperty("/isProgressing", false);
					//						that.refreshListPriorPurchases();
					that.loadListDeliveryLocation();
					that.refreshCounts();
					//sap.ui.core.BusyIndicator.hide();
					that._dialog.close();
				});

			}
		},

		updateDeliveryLocationX: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var currentVendor = currentProgram.deliveryLocations.currentVendor.toString();

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var todoCountF = 0;
			var todoCount = 0;
			var doneCount = 0;
			var errorCount = 0;
			var obj = null;
			var aKey = null;
			var perT = 0;
			var addedKeys = [];
			var errorCodes = [];

			that.deleteProgramDelLocAll(currentProgram.programUUId, currentVendor, function (uuid, isOk) {
				if (!!isOk) {
					if (!!currentImportitems && currentImportitems.length > 0) {
						todoCount = currentImportitems.length;
						todoCountF = currentImportitems.length;
						doneCount = 0;
						errorCount = 0;

						// star 
						sap.ui.core.BusyIndicator.show(0);

						for (var x2 = 0; x2 < currentImportitems.length; x2++) {
							obj = {};
							obj.PROGRAM_UUID = currentProgram.programUUId;
							//obj.VENDOR_ID = currentImportitems[x2].vendorid.toString();
							obj.VENDOR_ID = currentVendor;
							obj.VALID = "X";
							obj.BATCH_MODE = "X";
							obj.DEL_LOCATION_ID = currentImportitems[x2].locationid.toString();
							obj.LANG = "EN";
							obj.DEL_LOCATION_NAME = currentImportitems[x2].englishName.toString();
							obj.VENDOR_TYPE = ""; //?
							obj.EN_DEL_LOCATION_NAME = currentImportitems[x2].englishName.toString();
							obj.FR_DEL_LOCATION_NAME = currentImportitems[x2].frenchName.toString();
							obj.DEL_ADDRESS1 = currentImportitems[x2].address1.toString();
							obj.DEL_ADDRESS2 = !!(currentImportitems[x2].address2) ? currentImportitems[x2].address2 : "";
							obj.DEL_CITY = currentImportitems[x2].city.toString();
							obj.DEL_PROVINCE = currentImportitems[x2].province.toString();
							if (!!currentImportitems[x2].zip) {
								obj.DEL_POSTAL_CODE = currentImportitems[x2].zip.toString();
							} else {
								obj.DEL_POSTAL_CODE = "";
							}
							if (!!currentImportitems[x2].phone) {
								obj.DEL_PHONE_NUMBER = currentImportitems[x2].phone.toString();
							} else {
								obj.DEL_PHONE_NUMBER = "";
							}

							that.createProgramDelLoc(x2, obj,
								function (index, inObj, isOK) {
									todoCount -= 1;
									doneCount += 1;
									perT = Math.round(doneCount * 100 / todoCountF);
									theModel.setProperty("/progressValue", perT);
									theModel.setProperty("/progressValueP", "" + perT + "%");
									if (!!isOK) {
										currentImportitems[index].status = "UP";
									} else {
										currentImportitems[index].status = "FD";
									}
									if (todoCount <= 0) {
										theModel.setProperty("/currentProgram", currentProgram);
										theModel.setProperty("/isOk", true);
										theModel.setProperty("/isProgressing", false);

										sap.ui.core.BusyIndicator.hide();

										that.loadListDeliveryLocation();
									}
								});
						}
					}
				}
			});
		},

		insertIfNotThere: function (item, list) {
			var found = false;
			for (var i = 0; i < list.length; i++) {
				if (list[i].key === item.Category) {
					found = true;
				}
			}
			if (!!!found) {
				list.unshift({
					key: item.Category,
					enDesc: item.en_desc,
					frDesc: item.fr_desc,
					desc: item.en_desc
				});
			}
		},

		handleUploadComplete: function (oEvent) {
			var sResponse = oEvent.getParameter("response");
			MessageToast.show("sMsg");
		},

		_get_oItemImportDialog: function () {
			if (!this._oItemImportDialog) {
				this._oItemImportDialog = sap.ui.xmlfragment(this.getView().getId(),
					"tci.wave2.ui.bookingProgram.view.fragments.ItemImportDialog", this);
				this.getView().addDependent(this._oItemImportDialog);
			}
			return this._oItemImportDialog;
		},

		onImportCategory: function (oEven) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), oDialog);
			oDialog.setContentWidth("400px");

			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.setValue("");

			var model = new JSONModel();
			var data = {};
			data.title = resourceBundle.getText("Label.Header.Import.Category");
			data.currentTab = "Category";
			data.isOk = false;
			data.isProgressing = false;
			data.showBar = false;
			data.progressValue = 0;
			data.progressValueP = "0%";
			data.currentImportitems = [];
			model.setData(data);
			oDialog.setModel(model);
			oDialog.open();
		},

		onLine1Changed: function (oEvent) {
			var newValue = oEvent.getParameter("value");
			if (!!newValue) {
				oEvent.getSource().setValueState(null);
				oEvent.getSource().setValueStateText(null);
			}
		},

		onProvinceChanged: function (oEvent) {
			var newValue = oEvent.getParameter("selectedItem").getKey();
			if (!!newValue) {
				oEvent.getSource().setValueState(null);
				oEvent.getSource().setValueStateText(null);
			}
		},

		onCityChanged: function (oEvent) {
			var newValue = oEvent.getParameter("value");
			if (!!newValue) {
				oEvent.getSource().setValueState(null);
				oEvent.getSource().setValueStateText(null);
			}
		},

		onZipChanged: function (oEvent) {
			var resourceBundle = this.getResourceBundle();
			var newValue = oEvent.getParameter("value");
			var isError = false;
			if (!!newValue) {

				if (newValue.indexOf("_") >= 0) {
					oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
					oEvent.getSource().setValueStateText(resourceBundle.getText("Message.error.badZip"));
					isError = true;
				} else {
					oEvent.getSource().setValueState(null);
					oEvent.getSource().setValueStateText(null);
					isError = false;
				}
				oEvent.getSource().setValue(newValue.toUpperCase());
			} else {
				oEvent.getSource().setValueState(sap.ui.core.ValueState.Error);
				oEvent.getSource().setValueStateText(resourceBundle.getText("Message.error.noZip"));

				isError = true;
			}
			return !isError;
		},

		onAddressInputDialogCancel: function (oEvent) {
			if (!!this._oAddressInputDialog) {
				this._oAddressInputDialog.close();
			}
		},

		validAddressInputs: function () {
			// validate inputs
			var hasError = false;
			var resourceBundle = this.getResourceBundle();

			var line1Input = this.getView().byId("line1");
			var line1 = line1Input.getValue();

			if (!!!line1) {
				line1Input.setValueState(sap.ui.core.ValueState.Error);
				line1Input.setValueStateText(resourceBundle.getText("Message.error.noLine1"));
				hasError = true;
			} else {
				line1Input.setValueState(sap.ui.core.ValueState.None);
				line1Input.setValueStateText(null);
			}

			var line1City = this.getView().byId("city");
			var city = line1City.getValue();

			if (!!!city) {
				line1City.setValueState(sap.ui.core.ValueState.Error);
				line1City.setValueStateText(resourceBundle.getText("Message.error.noCity"));
				hasError = true;
			} else {
				line1City.setValueState(sap.ui.core.ValueState.None);
				line1City.setValueStateText(null);
			}

			var provinceInput = this.getView().byId("province");
			var province = provinceInput.getSelectedKey();

			if (!!!province) {
				provinceInput.setValueState(sap.ui.core.ValueState.Error);
				provinceInput.setValueStateText(resourceBundle.getText("Message.error.noProvince"));
				hasError = true;
			} else {
				provinceInput.setValueState(sap.ui.core.ValueState.None);
				provinceInput.setValueStateText(null);
			}

			var zipInput = this.getView().byId("zip");
			var zip = zipInput.getValue();

			if (!!!zip) {
				zipInput.setValueState(sap.ui.core.ValueState.Error);
				zipInput.setValueStateText(resourceBundle.getText("Message.error.noZip"));
				hasError = true;
			} else {
				zipInput.setValueState(sap.ui.core.ValueState.None);
				zipInput.setValueStateText(null);
			}
			return hasError;
		},

		afterAddressInputDialogOpen: function (oEvent) {
			this.validAddressInputs();
		},

		onAddressInputDialogOk: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			if (this.validAddressInputs()) {
				return false;
			}
			if (!!this._oAddressInputDialog) {
				var innerModel = this._oAddressInputDialog.getModel();
				var sPath = innerModel.getProperty("/sPath");
				var addressDetail = innerModel.getProperty("/addressDetail");
				this._oAddressInputDialog.close();
				var theLine = viewModel.getProperty(sPath);
				var oldaddressDetail = theLine.addressDetail;
				//					if (this.isAddressChanged(oldaddressDetail, addressDetail)) {
				theLine.addressDetail = addressDetail;
				this.saveDeliveryLocationEntry(sPath, theLine, function (isOk) {
					theLine.address = formatter.addresses(addressDetail);
					viewModel.setProperty(sPath, theLine);
				});
			}
		},

		isAddressChanged: function (olde, newOne) {
			if (!!olde && !!newOne) {
				if ((olde.line1 !== newOne.line1) ||
					(olde.line2 !== newOne.line2) ||
					(olde.city !== newOne.city) ||
					(olde.province !== newOne.province) ||
					(olde.zip !== newOne.zip)) {
					return true;
				}
			}
			return false;
		},

		onLocationLineChange: function (oEvent) {
			var sPath = oEvent.getSource().getParent().getBindingContext("viewModel").sPath;
			this.saveDeliveryLocationEntry(sPath, null, function (isOk) {

			});
		},

		saveDeliveryLocationEntry: function (sPath, entry, callback) {
			if ("/currentProgram/deliveryLocations/newline/0" === sPath) {
				callback(true);
			} else {
				// do the saving 
				var that = this;
				var viewModel = this.getModel(CONST_VIEW_MODEL);
				var currentProgram = viewModel.getProperty("/currentProgram");

				var dellocObj = viewModel.getProperty(sPath);
				var dellocs = viewModel.getProperty("/currentProgram/deliveryLocations/");

				if (!!entry) {
					dellocObj = entry;
				}
				var resourceBundle = this.getResourceBundle();
				var bModel = this.getBookingOdataV2Model();
				// var key = bModel.createKey("/ProgramDeliveryLocationSet", {
				// 	"OBJECT_KEY": dellocObj.objectKey
				// });

				var obj = {};
				obj.OBJECT_KEY = dellocObj.objectKey;
				// prepare the data set
				obj.PROGRAM_UUID = currentProgram.programUUId;
				// obj.DEPART = currentProgram.summary.department;
				obj.DEL_LOCATION_ID = dellocObj.key;
				obj.VALID = dellocObj.isValid;
				obj.VENDOR_TYPE = "";
				obj.VENDOR_ID = dellocs.currentVendor;
				obj.EN_DEL_LOCATION_NAME = "N/A";
				obj.FR_DEL_LOCATION_NAME = "N/A";
				obj.DEL_LOCATION_NAME = dellocObj.name;
				obj.LANG = this.getCurrentLanguageKey();

				obj.DEL_ADDRESS1 = dellocObj.addressDetail.line1;
				obj.DEL_ADDRESS2 = dellocObj.addressDetail.line2;
				obj.DEL_CITY = dellocObj.addressDetail.city;
				obj.DEL_PROVINCE = dellocObj.addressDetail.province;
				obj.DEL_POSTAL_CODE = dellocObj.addressDetail.zip.replace(/\s/g, "");

				// get rid of mask	
				obj.DEL_PHONE_NUMBER = dellocObj.phone.replace(/\)/g, "").replace(/\(/g, "").replace(/\-/g, "").replace(/\s/g, "");
				obj.CHANGED_BY = that.getUserId();
				this.draftInd.showDraftSaving();
				//bModel.update(key, obj, {
				bModel.create("/programDeliveryLocationUpdate", obj, {
					success: function (oData, oResponse) {
						if (oData.value.HTTP_STATUS_CODE === "554" || oData.value.HTTP_STATUS_CODE === 554) {
							MessageBox.error(resourceBundle.getText("Message.error.delloc.noexist"));
						} else if (oData.value.HTTP_STATUS_CODE === "552" || oData.value.HTTP_STATUS_CODE === 552) {
							MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
						} else {
							that.draftInd.showDraftSaved();
							callback(true);
						}
					},
					error: function (oError) {
						if (oError.statusCode === "554" || oError.statusCode === 554) {
							MessageBox.error(resourceBundle.getText("Message.error.delloc.noexist"));
						} else if (oError.statusCode === "552" || oError.statusCode === 552) {
							MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
						}
						callback(true);
					}
				});
			}
		},

		onPhoneChaneg: function (oEvent) { },

		handleVendorKeyDialogPress: function (oEvent) {
			var dialog = this._get_oVendorSelectDialog();
			var binding = dialog.getBinding("items");
			//sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("Supplier", false));
			binding.sort(aSorters);

			binding.filter([new sap.ui.model.Filter("DeletionIndicator", sap.ui.model.FilterOperator.EQ, "false")]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
		},

		handleDealerKeyDialogPress: function (oEvent) {
			var dialog = this._get_oDealerSelectDialog();
			var binding = dialog.getBinding("items");
			//sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("BusinessPartner", false));
			binding.sort(aSorters);

			binding.filter([this.orDealerCondition]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
		},

		handleSummitOrder: function (oEvent) {
			// first, get the order json payload 
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var appStateModel = this.getAppStateModel();
			var resourceBundle = this.getResourceBundle();
			var header = {};
			header.ORDER_TYPE = "ZBO";
			header.SALES_ORG = "7000";
			header.DIST_CHANNEL = "10";
			header.PARTNER_TYPE = "AG";

			//++
			header.DIVISON = appStateModel.getProperty("/division");

			var conds = {};

			conds.PROGRAM_UUID = currentProgram.programUUId;
			sap.ui.core.BusyIndicator.show(0);

			MessageBox.show(resourceBundle.getText("Message.information.order.confirmation"), {
				icon: MessageBox.Icon.INFORMATION,
				title: "Alert",
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {

					if (oAction === "YES") {

						that.getBookingLines(conds, function (rDataOut) {
							////////////**********Incident INC0168133 **************///////////////

							function search(nameKey, myArray) {
								for (var i = 0; i < myArray.length; i++) {
									if (myArray[i].CATEGORY_ID === nameKey) {
										return true;
										break;
									}
								}
							}

							var sTireFlag = false;
							sTireFlag = search('PARP05F15', rDataOut);

							if (sTireFlag) {
								currentProgram.summary.status = "CP";
								viewModel.setProperty("/displayMode", false);
								viewModel.setProperty("/currentProgram", currentProgram);
								that.doSaveSummary();
								sap.ui.core.BusyIndicator.hide();
							} else {

								var iArray = that.formatSubmitJsonfunction(header, rDataOut);
								MessageBox.show(resourceBundle.getText("Message.information.order.payload"), {
									icon: MessageBox.Icon.INFORMATION,
									title: resourceBundle.getText("Message.information.order.sent"),
									actions: [MessageBox.Action.YES, MessageBox.Action.NO],
									emphasizedAction: MessageBox.Action.YES,
									details: JSON.stringify(iArray),
									contentWidth: "150px",
									onClose: function (oAction) {

										if (oAction === "YES") {
											that.send2XIPI(iArray, function (rData) {
												currentProgram.summary.status = "CP";
												viewModel.setProperty("/displayMode", false);
												viewModel.setProperty("/currentProgram", currentProgram);
												that.doSaveSummary();
												sap.ui.core.BusyIndicator.hide();

											});
										} else {
											sap.ui.core.BusyIndicator.hide();
										}
									}
								});

							}
							////////////**********Incident INC0168133 **************///////////////
						});

					} else {
						sap.ui.core.BusyIndicator.hide();
					}
				}
			});

		},

		formatSubmitJsonfunction: function (header, oData) {
			var dataArray = [];
			var iDate = null;
			var dtFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "YYYY-MM-dd"
			});
			var currentHeader = null;
			var currentItem = null;
			var currentLine = null;
			var currentItemCount = 0;
			var currentLineCount = 0;
			var iStartScheduleLineDate = null;
			var iQty = 0;

			// if (!!oData && !!oData.results && oData.results.length > 0) {
			if (!!oData && oData.length > 0) {
				for (var i = 0; i < oData.length; i++) {
					iDate = oData[i];
					//iStartScheduleLine = oData[0];
					// header level 
					if (i == 0) {
						currentHeader = {};
						Object.assign(currentHeader, header);
						currentHeader.DEALER_BP = iDate.DEALER_CODE;
						currentHeader.PROGRAM_ID = iDate.PROGRAM_UUID;
						currentHeader.ITEMS = [];
					} else {
						if (currentHeader.DEALER_BP !== iDate.DEALER_CODE || currentHeader.PROGRAM_ID !== iDate.PROGRAM_UUID) {
							// add the  header to array
							if (currentHeader.ITEMS.length > 0 || currentItemCount > 0) {
								currentHeader.ITEMS.push(currentItem); //GSR
								///////////////////////////******************CR1079************************************/////////////
								iQty = 0;
								for (var j = 0; j < currentHeader.ITEMS.length; j++) {
									if (currentHeader.ITEMS[j].CATEGORY_ID == 'PARP05F23') {
										var scheduleLine = null;
										for (var k = 0; k < currentHeader.ITEMS[j].current_lines.length; k++) {
											iStartScheduleLineDate = currentHeader.ITEMS[j].current_lines[0].Schedule_date;
											iQty += parseInt(currentHeader.ITEMS[j].current_lines[k].Order_Qty);
											var l = k;
											if (l + 1 == currentHeader.ITEMS[j].current_lines.length) {
												scheduleLine = {};
												scheduleLine.Order_Qty = iQty.toString();
												scheduleLine.Schedule_date = iStartScheduleLineDate;

												iQty = 0;
												currentHeader.ITEMS[j].schedule_lines.push(scheduleLine);
											}
										}

									} else {
										currentHeader.ITEMS[j].VENDOR_ID = '';
										currentHeader.ITEMS[j].schedule_lines = currentHeader.ITEMS[j].current_lines;
									}
									delete currentHeader.ITEMS[j].current_lines;
									////////////**********Incident INC0168133 **************///////////////

									delete currentHeader.ITEMS[j].CATEGORY_ID;
									////////////**********Incident INC0168133 **************///////////////

								}
								////////////////////////////******************CR1079************************************//////////////////////////////////
								dataArray.push(currentHeader);
								currentItem = null; //GSR
							}
							currentItemCount = 0;
							// get new header 
							currentHeader = {};
							Object.assign(currentHeader, header);
							currentHeader.DEALER_BP = iDate.DEALER_CODE;
							currentHeader.PROGRAM_ID = iDate.PROGRAM_UUID; //GSR
							currentHeader.ITEMS = [];
						}
					}

					//item level 
					if (currentItem === null) {
						currentItem = {};
						currentItem.CATEGORY_ID = iDate.CATEGORY_ID; //////////////**********Incident INC0168133 **************///////////////
						currentItem.VENDOR_ID = iDate.VENDOR_ID;
						currentItem.PART_NUMBER = iDate.PART_NUM;
						currentItem.schedule_lines = [];
						currentItem.current_lines = [];

					} else {
						if (currentItem.VENDOR_ID !== iDate.VENDOR_ID || currentItem.PART_NUMBER !== iDate.PART_NUM) {
							currentHeader.ITEMS.push(currentItem);
							currentItem = {};
							currentItem.CATEGORY_ID = iDate.CATEGORY_ID; //////////////**********Incident INC0168133 **************///////////////
							currentItem.VENDOR_ID = iDate.VENDOR_ID;
							currentItem.PART_NUMBER = iDate.PART_NUM;
							currentItem.schedule_lines = [];
							currentItem.current_lines = [];

						}
					}

					// line level - always
					currentLine = {};
					currentLine.Order_Qty = iDate.ORDER_QTY;
					currentLine.Schedule_date = dtFormat.format(iDate.SCHEDULE_DATE);
					//currentItem.schedule_lines.push(currentLine); //comment this for CR1079
					currentItem.current_lines.push(currentLine); // uncomment for CR1079 changes 
					if (currentLine.Order_Qty > 0) { // consider only items where quantity greater than zero. 
						currentItemCount = currentItemCount + 1;
					}

				}

				if (!!currentHeader) {
					if (!!currentItem) {
						currentHeader.ITEMS.push(currentItem); //GSR
					}
					if (currentHeader.ITEMS.length > 0) {
						///////////////////////////******************CR1079************************************////////////////
						iQty = 0;
						for (var j = 0; j < currentHeader.ITEMS.length; j++) {
							if (currentHeader.ITEMS[j].CATEGORY_ID == 'PARP05F23') {
								var scheduleLine = null;
								for (var k = 0; k < currentHeader.ITEMS[j].current_lines.length; k++) {
									iStartScheduleLineDate = currentHeader.ITEMS[j].current_lines[0].Schedule_date;
									iQty += parseInt(currentHeader.ITEMS[j].current_lines[k].Order_Qty);
									var l = k;
									if (l + 1 == currentHeader.ITEMS[j].current_lines.length) {
										scheduleLine = {};
										scheduleLine.Order_Qty = iQty.toString();
										scheduleLine.Schedule_date = iStartScheduleLineDate;

										iQty = 0;
										currentHeader.ITEMS[j].schedule_lines.push(scheduleLine);
									}
								}

							} else {
								currentHeader.ITEMS[j].VENDOR_ID = '';
								currentHeader.ITEMS[j].schedule_lines = currentHeader.ITEMS[j].current_lines;
							}
							delete currentHeader.ITEMS[j].current_lines;
							////////////**********Incident INC0168133 **************///////////////

							delete currentHeader.ITEMS[j].CATEGORY_ID;
							////////////**********Incident INC0168133 **************///////////////

						}
						////////////////////////////******************CR1079************************************//////////////////////////////////
						dataArray.push(currentHeader);
					}
				}
			}
			return dataArray;
		},

		handlePartsDialogPress: function (oEvent) {
			var dialog = this._get_oPartsSelectDialog();

			var binding = dialog.getBinding("items");
			// clear the old search filter
			var filters = this.getPartBaseDFilter();
			binding.filter(filters);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
		},

		handleCatPartsDialogPress: function (oEvent) {
			var dialog = this._get_oCatPartsSelectDialog();
			var binding = dialog.getBinding("items");
			//sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("PRODH", false));
			binding.sort(aSorters);

			// clear the old search filter
			var cat = this.byId("partsCatSelection");
			var index = cat.getSelectedIndex();
			if (index < 0) {
				cat.setSelectedIndex(0);
			}

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var newLine = viewModel.getProperty("/currentProgram/parts/newline");

			binding.filter([new sap.ui.model.Filter("PRODH", sap.ui.model.FilterOperator.EQ, newLine[0].categoryId)]);
			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
		},

		handleProPartsDialogPress: function (oEvent) {

			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			this._get_oProgramPartsSelectDialog();
			//var binding = dialog.getBinding("items");

			// var key = "/ProgramVendorLangSet";

			// binding.sPath = key;
			// binding.refresh();

			/*	var filters = [];
				filters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));
				filters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));
				binding.filter(filters);*/
			// // //sort by key 
			// var aSorters = [];
			// aSorters.push(new sap.ui.model.Sorter("VENDOR_DESC", false));
			// binding.sort(aSorters);

			// toggle compact style
			//jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			//dialog.open();

		},

		handleProPartsSearch: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var sValue = oEvent.getParameter("value");
			var oFilters = [];

			var oFilter = null;
			oFilters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));
			oFilters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));
			oFilters.push(new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, 'X'));
			if (!!sValue) {
				oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("PART_NUM", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("PART_DESC", sap.ui.model.FilterOperator.Contains, sValue)
				],
					"false"
				);
				oFilters.push(oFilter);
			}

			/*var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilters);*/
			var bModel = this.getBookingOdataV2Model();

			var key = "/ProgramPartLangSet";

			bModel.read(key, {
				urlParameters: {

					"$skip": 0,
					"$top": 100
				},
				filters: oFilters,
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel(oData.results);
					thisView._oProgramPartsSelectDialog.setModel(JSONModel);

					thisView._oProgramPartsSelectDialog.setGrowing(true);
					thisView._oProgramPartsSelectDialog.setGrowingThreshold(20);

				},
				error: function (err) {

					console.log(err);
				}
			});

		},
		handleProPartsSearchDialogCancel: function (oEvent) {
			sap.ui.BusyIndicator.hide();
			oEvent.getSource().close();
		},

		handleProPartsSearchDialogConfirm: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			var tab = viewModel.getProperty("/selectedTabKey");
			var oContext = null;
			var newLine = null;
			if (tab === "PartFitments") {
				newLine = viewModel.getProperty("/currentProgram/partfitments/newline");

				if (!!oSelectedItem) {
					oContext = oSelectedItem.getBindingContext();
					newLine[0].partId = oContext.getProperty("PART_NUM");
					newLine[0].partDesc = oContext.getProperty("PART_DESC");
					viewModel.setProperty("/currentProgram/partfitments/newline", newLine);
				}

			} else { // by default parts
				newLine = viewModel.getProperty("/currentProgram/priorPurchases/newline");

				if (!!oSelectedItem) {
					oContext = oSelectedItem.getBindingContext();
					newLine[0].partId = oContext.getProperty("PART_NUM");
					newLine[0].partDesc = oContext.getProperty("PART_DESC");
					viewModel.setProperty("/currentProgram/priorPurchases/newline", newLine);
				}
			}

		},

		handleDmKeyDialogPress: function (oEvent) {

			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var dialog = this._get_oProgramDmSelectDialog();
			var binding = dialog.getBinding("items");

			// var key = "/ProgramVendorLangSet";

			// binding.sPath = key;
			// binding.refresh();

			var orfilters = [];
			orfilters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, '!!!--!!!'));
			orfilters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));
			var filters = [];
			filters.push(new sap.ui.model.Filter(orfilters, false));
			filters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));
			binding.filter(filters);
			// //sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("PROGRAM_UUID", false));
			aSorters.push(new sap.ui.model.Sorter("DEL_METHOD_NAME", false));
			binding.sort(aSorters);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();

		},

		handleDmSearch: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var sValue = oEvent.getParameter("value");
			var oFilters = [];

			var orfilters = [];
			orfilters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, '!!!--!!!'));
			orfilters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));

			oFilters.push(new sap.ui.model.Filter(orfilters, false));
			oFilters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));

			var oFilter = null;

			if (!!sValue) {
				oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("DEL_METHOD", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("DEL_METHOD_NAME", sap.ui.model.FilterOperator.Contains, sValue.toLowerCase()),
					new sap.ui.model.Filter("DEL_METHOD_NAME", sap.ui.model.FilterOperator.Contains, sValue.toUpperCase())
				],
					"false"
				);
				oFilters.push(oFilter);
			}

			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilters);
		},

		handleDmSearchDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var vendorNewLine = viewModel.getProperty("/currentProgram/deliveryMethods/newline");
			if (!!oSelectedItem) {
				vendorNewLine[0].dmName = oSelectedItem.getTitle();
				vendorNewLine[0].dmId = oSelectedItem.getDescription();
			}
			viewModel.setProperty("/currentProgram/deliveryMethods/newline", vendorNewLine);
		},

		handleDmVendorKeyDialogPress: function (oEvent) {

			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var dialog = this._get_oProgramDmVenSelectDialog();
			/*var binding = dialog.getBinding("items");

			// var key = "/ProgramVendorLangSet";

			// binding.sPath = key;
			// binding.refresh();

			var filters = [];
			filters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));
			filters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));
			binding.filter(filters);
			// //sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("VENDOR_DESC", false));
			binding.sort(aSorters);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			*/
			dialog.open();

		},

		handleDmVenSearch: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var sValue = oEvent.getParameter("value");
			var oFilters = [];

			var oFilter = null;
			oFilters.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, currentProgram.programUUId));
			oFilters.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));

			if (!!sValue) {
				oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("VENDOR_DESC", sap.ui.model.FilterOperator.Contains, sValue.toLowerCase()),
					new sap.ui.model.Filter("VENDOR_DESC", sap.ui.model.FilterOperator.Contains, sValue.toUpperCase())
				],
					"false"
				);
				oFilters.push(oFilter);
			}

			var bModel = this.getBookingOdataV2Model();

			var key = "/ProgramVendorLangSet";

			bModel.read(key, {
				urlParameters: {

					"$skip": 0,
					"$top": 100
				},
				filters: oFilters,
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel(oData.results);
					thisView._oProgramDmVenSelectDialog.setModel(JSONModel);

					thisView._oProgramDmVenSelectDialog.setGrowing(true);
					thisView._oProgramDmVenSelectDialog.setGrowingThreshold(20);

				},
				error: function (err) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					thisView._oProgramDmVenSelectDialog.setModel(JSONModel);

					//sap.ui.core.BusyIndicator.hide();
					console.log(err);
				}
			});
		},

		handleDmVenSearchDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var currentTab = viewModel.getProperty("/selectedTabKey");
			if (currentTab === 'DeliveryMethod') {
				var vendorNewLine = viewModel.getProperty("/currentProgram/deliveryMethods/newline");
				if (!!oSelectedItem) {
					vendorNewLine[0].vendorName = oSelectedItem.getTitle();
					vendorNewLine[0].vendorId = oSelectedItem.getDescription();
				}
				viewModel.setProperty("/currentProgram/deliveryMethods/newline", vendorNewLine);

			} else if (currentTab === 'DeliveryLocation') {

				var currentVendor = oSelectedItem.getDescription();
				sap.ui.core.BusyIndicator.show(0);
				viewModel.setProperty("/currentProgram/deliveryLocations/currentVendor", currentVendor);
				this.getListProgramDelLocMessages(currentProgram.programUUId, false, currentVendor, function (
					rdItems) {
					if (!!rdItems && rdItems.length > 0) {
						currentProgram.deliveryLocations.countOnVendor = rdItems.length;
						currentProgram.deliveryLocations.items = rdItems;
					} else {
						currentProgram.deliveryLocations.countOnVendor = 0;
						currentProgram.deliveryLocations.items = [];
					}
					viewModel.setProperty("/currentProgram", currentProgram);
					sap.ui.core.BusyIndicator.hide();
				});

			}

		},

		handleProgramDialogPress: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var dialog = this._get_oCpProgramSelectDialog();
			var binding = dialog.getBinding("items");
			var filters = [];
			filters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.Contains, 'CP'));
			filters.push(new sap.ui.model.Filter("DEPART", sap.ui.model.FilterOperator.Contains, currentProgram.summary.department));

			// var key = "/ProgramSearchInput(IN_LANG='" + that.getCurrentLanguageKey() + "',IN_STATUS='CP',IN_DEPART='" +
			// 	currentProgram.summary.department + "')/Programs";
			// var key = "/ProgramSearchSet(IN_LANG='" + that.getCurrentLanguageKey() + "',IN_STATUS='CP',IN_DEPART='" +
			// 	currentProgram.summary.department + "')/Set";
			var key = "/ProgramSearchSet(IN_LANG='" + that.getCurrentLanguageKey() + "')/Set";
			binding.sPath = key;
			binding.refresh();
			binding.filter(filters);
			// //sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("PROGRAM_ID", false));
			binding.sort(aSorters);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
		},

		handleVendorSearchDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var vendorNewLine = viewModel.getProperty("/currentProgram/vendors/newline");
			if (!!oSelectedItem) {
				vendorNewLine[0].key = oSelectedItem.getTitle();
				vendorNewLine[0].desc = oSelectedItem.getDescription();
				vendorNewLine[0].enDesc = vendorNewLine[0].desc;
				vendorNewLine[0].frDesc = vendorNewLine[0].desc;
			}
			viewModel.setProperty("/currentProgram/vendors/newline", vendorNewLine);
		},

		handleDealerSearchDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var newLine = viewModel.getProperty("/currentProgram/priorPurchases/newline");

			if (!!oSelectedItem) {
				newLine[0].dealerId_s = oSelectedItem.getTitle();
				newLine[0].dealerId = oSelectedItem.getInfo();
				newLine[0].dealerName = oSelectedItem.getDescription();
			}
			viewModel.setProperty("/currentProgram/priorPurchases/newline", newLine);
		},

		handleVModelSearchDialogClose: function (oEvent) {
			var that = this;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var newLine = viewModel.getProperty("/currentProgram/partfitments/newline");
			if (!!oSelectedItem) {
				var oContext = oSelectedItem.getBindingContext();
				newLine[0].modelDesc = oContext.getProperty("ModelDescriptionEN");
				newLine[0].modelDescEn = oContext.getProperty("ModelDescriptionEN");
				newLine[0].modelDescFr = oContext.getProperty("ModelDescriptionFR");
				newLine[0].modelCode = oContext.getProperty("Model");

				newLine[0].brand = oContext.getProperty("Brand");
				// newLine[0].partDesc = oContext.getProperty("Description");
				that.getModelYears(newLine[0].modelCode, function (years) {
					newLine[0].year = "";
					if (!!years) {
						viewModel.setProperty("/currentProgram/partfitments/years", years);
					} else {
						viewModel.setProperty("/currentProgram/partfitments/years", []);
					}
				});

				viewModel.setProperty("/currentProgram/partfitments/newline", newLine);
			}

			viewModel.setProperty("/currentProgram/partfitments/newline", newLine);
		},

		handlePartsSearchDialogCancel: function (oEvent) { },

		handlePartsSearchDialogConfirm: function (oEvent) {
			var that = this;
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var tab = viewModel.getProperty("/selectedTabKey");
			var oContext = null;
			var newLine = null;
			if (tab === "PartFitments") {
				newLine = viewModel.getProperty("/currentProgram/partfitments/newline");

				if (!!oSelectedItem) {
					oContext = oSelectedItem.getBindingContext();
					newLine[0].partId = oContext.getProperty("MaterialNumber");
					newLine[0].partDesc = oContext.getProperty("Description");
					that.getTireSize(newLine[0].partId, function (tireSize) {
						if (!!tireSize) {
							newLine[0].details = tireSize;
						} else {
							newLine[0].details = "";
						}
						viewModel.setProperty("/currentProgram/partfitments/newline", newLine);
					});

				}

			} else { // by default parts
				newLine = viewModel.getProperty("/currentProgram/parts/newline");

				if (!!oSelectedItem) {
					oContext = oSelectedItem.getBindingContext();
					newLine[0].partId = oContext.getProperty("MaterialNumber");
					//newLine[0].partDesc = oContext.getProperty("Description") + " " + oContext.getProperty("TireSize");
					newLine[0].partDesc = oContext.getProperty("Description");
					newLine[0].vendorId = oContext.getProperty("Vendor");
					newLine[0].categoryId = formatter.categoryFormatter(oContext.getProperty("Category"));

					that.getTireSize(newLine[0].partId, function (tireSize) {
						if (!!tireSize) {
							newLine[0].details = tireSize;
						} else {
							newLine[0].details = "";
						}
						viewModel.setProperty("/currentProgram/parts/newline", newLine);
					});

				}
			}
		},

		handleCatPartsSearchDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var newLine = null;
			newLine = viewModel.getProperty("/currentProgram/parts/newline");

			if (!!oSelectedItem) {
				newLine[0].partId = oSelectedItem.getTitle();
				newLine[0].partDesc = oSelectedItem.getDescription();
			}

			viewModel.setProperty("/currentProgram/parts/newline", newLine);
		},

		handleProgramDialogClose: function (oEvent) {
			var oSelectedItem = oEvent.getParameter("selectedItem");
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			var summary = viewModel.getProperty("/currentProgram/summary");

			if (!!oSelectedItem) {
				var bModel = oSelectedItem.getParent().getModel();
				var path = oSelectedItem.getParent().getSelectedContextPaths()[0];
				var data = bModel.getProperty(path);
				summary.cpprogram.id = data.PROGRAM_ID;
				summary.cpprogram.uuid = data.PROGRAM_UUID;
				summary.cpprogram.desc = data.PROGRAM_DESC;
			}
			viewModel.setProperty("/currentProgram/summary", summary);
		},

		handleVendorNameDialogPress: function (oEvent) {
			var dialog = this._get_oVendorSelectDialog();
			var binding = dialog.getBinding("items");
			//sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("SupplierName", false));
			binding.sort(aSorters);

			// clear the old search filter
			binding.filter([new sap.ui.model.Filter("DeletionIndicator", sap.ui.model.FilterOperator.EQ, "false")]);

			// toggle compact style
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), dialog);
			dialog.open();
		},

		defaultcurrentProgramData: function () {
			var iniDates = formatter.getIniPrograDates();
			var wOpenDate = iniDates.wOpen;
			var wCloseDate = iniDates.wClose;
			var delFromDate = iniDates.dOpen;
			var delToDate = iniDates.dClose;

			var currentProgram = {
				programId: "",
				programUUId: "",
				isNew: true,
				readOnly: true,
				isClosed: false,
				summary: {
					status: "OP",
					division: "10",
					department: "D002",
					programId: "",
					enDesc: "",
					frDesc: "",
					dealerGroup: 1,
					dealerToyota: false,
					dealerLexus: false,
					bWindowOpen: formatter.valueDate(wOpenDate),
					bWindowOpenDate: wOpenDate,
					bWindowOpenDateEst: formatter.valueESTDate(wOpenDate),
					bWindowClose: formatter.valueDate(wCloseDate),
					bWindowCloseDate: wCloseDate,
					bWindowCloseDateEst: formatter.valueESTDate(wCloseDate),
					deliveryFrom: formatter.valueDate(delFromDate),
					deliveryFromDate: delFromDate,
					deliveryTO: formatter.valueDate(delToDate),
					deliveryTODate: delToDate,

					initialWaringDays: 5,
					finalWarningDays: 3,
					cpprogram: {
						id: "",
						uuid: "",
						desc: ""
					}
				},
				categories: {
					allSelected: false,
					count: 0,
					newline: [{
						key: "",
						enDesc: "",
						frDesc: "",
						desc: ""
					}],
					items: [],
					currentImportitems: []
				},
				vendors: {
					allSelected: false,
					count: 0,
					newline: [{
						key: "",
						desc: "",
						isDistributor: false,
						enDesc: "",
						frDesc: ""
					}],
					items: []
				},
				deliveryMethods: {
					allSelected: false,
					count: 0,
					newline: [{
						dmId: "",
						dmName: "",
						vendorId: "",
						vendorName: "",
						categoryId: "",
						categoryName: ""
					}],
					items: []
				},
				deliveryLocations: {
					allSelected: false,
					currentVendor: "",
					countOnVendor: 0,
					count: 0,
					newline: [{
						key: "",
						name: "",
						address: "",
						addressDetail: {
							line1: "",
							line2: "",
							city: "",
							province: "",
							zip: ""
						},
						phone: ""
					}],
					items: []
				},
				parts: {
					allSelected: false,
					count: 0,
					newline: [{
						partId: "",
						partDesc: "",
						vendorId: "",
						details: "",
						vendorName: "",
						categoryId: "",
						categoryName: ""
					}],
					items: []
				},
				partfitments: {
					allSelected: false,
					count: 0,
					years: [],
					newline: [{
						partId: "",
						partDesc: "",
						details: "",
						modelCode: "",
						modelDesc: "",
						modelDescFr: "",
						modelDescEn: "",
						brand: "",
						year: "",
						seriesCode: "",
						seriesDesc: "",
						seriesDescEn: "",
						seriesDescFr: ""
					}],
					items: []
				},
				priorPurchases: {
					allSelected: false,
					count: 0,
					newline: [{
						programId: "",
						partId: "",
						partDesc: "",
						dealerId: "",
						dealerName: "",
						purchases: 0
					}],
					items: []
				}
			};
			return currentProgram;
		},

		handleVendorSuggest: function (oEvent) {
			var sTerm = oEvent.getParameter("suggestValue");
			var aFilters = [];
			if (sTerm) {
				aFilters.push(new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sTerm));
			}
			var oSource = oEvent.getSource();
			var oBinding = oSource.getBinding("suggestionItems");
			oBinding.filter(aFilters);
			oBinding.attachEventOnce("dataReceived", function () {
				// now activate suggestion popup
				oSource.suggest();
			});
		},

		updateDealerFinished: function (oEvent) { },

		updateVendorFinished: function (oEvent) { },

		updatePartsFinished: function (oEvent) { },

		updateCatPartsFinished: function (oEvent) { },

		updateCpProgramFinished: function (oEvent) { },

		handleVendorSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilters = [];

			var oFilter = null;
			oFilter = new sap.ui.model.Filter("DeletionIndicator", sap.ui.model.FilterOperator.EQ, "false");
			oFilters.push(oFilter);

			if (!!sValue) {
				oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("SupplierName", sap.ui.model.FilterOperator.Contains, sValue)
				],
					"false"
				);
				oFilters.push(oFilter);
			}

			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilters);
		},

		handleDealerSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilters = [];
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

		},

		handleVModelSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilters = [];
			var oFilter = null;

			if (!!sValue) {
				oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("Brand", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("ModelDescriptionEN", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("ModelDescriptionFR", sap.ui.model.FilterOperator.Contains, sValue)
				],
					"false"
				);
				oFilters.push(oFilter);

			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilters);
		},

		getPartBaseDFilter: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			// var vendorList = currentProgram.vendors.items;
			var vendorList = [];
			var categoryList = currentProgram.parts.categoryList;
			var andFilters = [];
			var orFilters = null;
			var aFilter = null;

			// the vendor condition 
			if (!!vendorList && vendorList.length > 1) {
				orFilters = [];
				for (var i1 = 0; i1 < vendorList.length; i1++) {
					if (!!vendorList[i1].key) {
						aFilter = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, vendorList[i1].key);
						orFilters.push(aFilter);
					}
				}
				andFilters.push(new sap.ui.model.Filter(orFilters, false));
			}
			// the Catergory condition 
			if (!!categoryList && categoryList.length > 1) {
				orFilters = [];
				for (var i2 = 0; i2 < categoryList.length; i2++) {
					if (!!categoryList[i2].key) {
						aFilter = new sap.ui.model.Filter("Category", sap.ui.model.FilterOperator.Contains, categoryList[i2].key);
						orFilters.push(aFilter);
					}
				}
				andFilters.push(new sap.ui.model.Filter(orFilters, false));
			}
			andFilters.push(new sap.ui.model.Filter("LanguageKey", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey()));
			return andFilters;
		},

		handlePartsSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilters = this.getPartBaseDFilter();
			var oFilter = null;

			if (!!sValue) {
				oFilter = new sap.ui.model.Filter([
					new sap.ui.model.Filter("Description", sap.ui.model.FilterOperator.Contains, sValue),
					new sap.ui.model.Filter("MaterialNumber", sap.ui.model.FilterOperator.Contains, sValue)
				],
					"false"
				);
				oFilters.push(oFilter);

			}
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter(oFilters);
		},

		handleProgramSearch: function (oEvent) {
			var that = this;
			var sValue = oEvent.getParameter("value");
			var oBinding = oEvent.getSource().getBinding("items");

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			// var key = "/ProgramSearchInput(IN_LANG='" + that.getCurrentLanguageKey() + "',IN_STATUS='CP',IN_DEPART='" +
			// 	currentProgram.summary.department + "',IN_PNUM='" + sValue + "')/Programs ";
			// var key = "/ProgramSearchSet(IN_LANG='" + that.getCurrentLanguageKey() + "',IN_STATUS='CP',IN_DEPART='" +
			// 	currentProgram.summary.department + "',IN_PNUM='" + sValue + "')/Set ";
			var key = "/ProgramSearchSet(IN_LANG='" + that.getCurrentLanguageKey() + "')/Set";
			var filters = [];
			filters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.Contains, 'CP'));
			filters.push(new sap.ui.model.Filter("DEPART", sap.ui.model.FilterOperator.Contains, currentProgram.summary.department));
			filters.push(new sap.ui.model.Filter("PROGRAM_ID", sap.ui.model.FilterOperator.Contains, sValue));
			oBinding.filter(filters);
			oBinding.sPath = key;
			oBinding.refresh();

			// //sort by key 
			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("PROGRAM_ID", false));
			oBinding.sort(aSorters);
		},

		onBack: function (oEvent) {
			this.getRouter().navTo("SearchProgram", null, false);
			sap.ui.getCore().getModel("CurrentProgressModel").currentTab = "MP";
			sap.ui.getCore().getModel("CurrentProgressModel").CurrentSubTab = "Summary"
		},

		checkButtonVisible: function (tab, readOnly) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var lvMode = viewModel.getProperty("/displayMode");
			var lvTab = viewModel.getProperty("/selectedTabKey");

			if (lvTab === tab && lvMode === readOnly) {
				return true;
			}
			return false;
		},

		toggleDispalyWirteMode: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			if (!viewModel.getData().selectedTabKey) {
				viewModel.getData().selectedTabKey = sap.ui.getCore().getModel("CurrentProgressModel").getData().CurrentSubTab;
			}
			var mode;
			var resourceBundle = this.getResourceBundle();
			if (viewModel.oData.currentProgram.summary.status === "CP") {
				mode = false;
			} else {
				mode = viewModel.getProperty("/displayMode");
			}

			if (!!mode) {
				mode = !mode;
				viewModel.setProperty("/displayMode", mode);
				viewModel.setProperty("/tabs", {
					Category: {
						contHigh: "55%"
					},
					Vendor: {
						contHigh: "55%"
					},
					DeliveryMethod: {
						contHigh: "55%"
					},
					DeliveryLocation: {
						contHigh: "55%"
					},
					Parts: {
						contHigh: "55%"
					},
					PartFitments: {
						contHigh: "55%"
					},
					PriorPurchases: {
						contHigh: "55%"
					}
				});
			} else {
				if (!!that.hasDirtyContent) {
					MessageBox.confirm(
						resourceBundle.getText("Message.unsaved.confirm.mode"), {
						onClose: function (sAction) {
							if (sAction === "OK") {
								mode = !mode;
								viewModel.setProperty("/displayMode", mode);
								viewModel.setProperty("/tabs", {
									Category: {
										contHigh: "70%"
									},
									Vendor: {
										contHigh: "70%"
									},
									DeliveryMethod: {
										contHigh: "70%"
									},
									DeliveryLocation: {
										contHigh: "65%"
									},
									Parts: {
										contHigh: "80%"
									},
									PartFitments: {
										contHigh: "80%"
									},
									PriorPurchases: {
										contHigh: "70%"
									}
								});

								that.refresh();
							}
						}
					}
					);

				} else {
					mode = !mode;
					viewModel.setProperty("/displayMode", mode);

					viewModel.setProperty("/tabs", {
						Category: {
							contHigh: "70%"
						},
						Vendor: {
							contHigh: "70%"
						},
						DeliveryMethod: {
							contHigh: "70%"
						},
						DeliveryLocation: {
							contHigh: "65%"
						},
						Parts: {
							contHigh: "80%"
						},
						PartFitments: {
							contHigh: "80%"
						},
						PriorPurchases: {
							contHigh: "70%"
						}
					});

				}
			}

			if (!mode) {
				// write 
				this._categoryTable.setMode("MultiSelect");
				this._vendorTable.setMode("MultiSelect");
				this._deliveryMethodsTable.setMode("MultiSelect");

				this._partsTable.setMode("MultiSelect");
				this._partFitmentTable.setMode("MultiSelect");
				this._priorPurchasesTable.setMode("MultiSelect");
			} else {
				if (viewModel.getData().selectedTabKey == "Category") {
					this.loadListCategory();
				}
				if (viewModel.getData().selectedTabKey == "Vendor") {
					this.loadListVendor();
				}
				if (viewModel.getData().selectedTabKey == "DeliveryMethod") {
					this.loadListDeliveryMethod();
				}
				if (viewModel.getData().selectedTabKey == "Parts") {
					this.loadListParts();
				}
				if (viewModel.getData().selectedTabKey == "PartFitments") {
					this.loadListPartFitments();
				}
				if (viewModel.getData().selectedTabKey == "PriorPurchases") {
					this.loadListPriorPurchases();
				}
				this._categoryTable.setMode("SingleSelectMaster");
				this._vendorTable.setMode("SingleSelectMaster");
				this._deliveryMethodsTable.setMode("SingleSelectMaster");

				this._partsTable.setMode("SingleSelectMaster");
				this._partFitmentTable.setMode("SingleSelectMaster");
				this._priorPurchasesTable.setMode("SingleSelectMaster");
			}
		},

		getViewModel: function (oEvent) {

		},

		handleIconTabHeaderSelect: function (oEvent) {
			var navCon = this.byId("tabNaviContainer");
			var target = oEvent.getParameter("selectedKey");
			if (!!target) {
				this.loadListData(target);
				navCon.to(this.byId(target), "show");
			}
			sap.ui.getCore().getModel("CurrentProgressModel").CurrentSubTab = target;
		},

		loadListData: function (target) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var mode = viewModel.getProperty("/displayMode");

			switch (target) {
				case "Category":
					if (!mode) {
						// write 
						this._categoryTable.setMode("MultiSelect");
					} else {
						this._categoryTable.setMode("SingleSelectMaster");
					}
					this.loadListCategory();
					break;
				case "Vendor":
					if (!mode) {
						// write 
						this._vendorTable.setMode("MultiSelect");
					} else {
						this._vendorTable.setMode("SingleSelectMaster");
					}
					this.loadListVendor();
					break;
				case "DeliveryMethod":
					if (!mode) {
						// write 
						this._deliveryMethodsTable.setMode("MultiSelect");
					} else {
						this._deliveryMethodsTable.setMode("SingleSelectMaster");
					}
					this.loadListDeliveryMethod();
					break;
				case "DeliveryLocation":
					this.loadListDeliveryLocation();
					break;
				case "Parts":
					if (!mode) {
						// write 
						this._partsTable.setMode("MultiSelect");
					} else {
						this._partsTable.setMode("SingleSelectMaster");
					}
					this.loadListParts();
					break;
				case "PartFitments":
					if (!mode) {
						// write 
						this._partFitmentTable.setMode("MultiSelect");
					} else {
						this._partFitmentTable.setMode("SingleSelectMaster");
					}
					this.loadListPartFitments();
					break;
				case "PriorPurchases":
					if (!mode) {
						// write 
						this._priorPurchasesTable.setMode("MultiSelect");
					} else {
						this._priorPurchasesTable.setMode("SingleSelectMaster");
					}
					this.loadListPriorPurchases();
					break;
				default:
					break;
			}
		},

		loadListCategoryX: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var categoryObj = viewModel.getProperty("/currentProgram/categories");

			//				this.getListCategoryMessages(currentProgram.programUUId, false, function (rItems) {
			this.getAllProgramCategoryMini(currentProgram.programUUId, function (rItems) {

				if (!!rItems && rItems.length > 0) {
					categoryObj.count = rItems.length;
					categoryObj.items = rItems;
					for (var i = 0; i < rItems.length; i++) {
						rItems[i].selected = false;
						rItems[i].key = rItems[i].CATEGORY_ID;
						rItems[i].desc = rItems[i].CATEGORY_DESC;
						if (!!rItems[i].VALID && rItems[i].VALID === "X") {
							rItems[i].hasError = false;
						} else {
							rItems[i].hasError = true;
						}
					}
				} else {
					categoryObj.count = 0;
					categoryObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		loadProgDelMethodListCategory: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var categoryObj = viewModel.getProperty("/currentProgram/categories");

			this.getListCategory(currentProgram.programUUId, true, function (rItems) {
				// if (!!rItems && rItems.length > 0) {
				// 	categoryObj.count = rItems.length;
				// 	categoryObj.items = rItems;
				// } else {
				// 	categoryObj.count = 0;
				// 	categoryObj.items = [];
				// }
				// viewModel.setProperty("/currentProgram", currentProgram);

				var localArray = [];
				if (!!rItems && rItems.length > 0) {
					localArray = rItems.slice(0);
				}

				var spaceItem = {
					selected: false,
					isNew: false,
					key: "",
					desc: "",
					frDesc: "",
					enDesc: ""
				};
				var lvModel = new JSONModel();
				localArray.push(spaceItem);
				lvModel.setData(localArray);
				that.setModel(lvModel, CONT_DM_CATEGORY_MODEL);
			});
		},

		loadProgDelMethodListVendor: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var vendorsObj = {};

			this.getListVendor(currentProgram.programUUId, true, function (rItems) {
				if (!!rItems && rItems.length > 0) {
					vendorsObj.count = rItems.length;
					vendorsObj.items = rItems;
				} else {
					vendorsObj.count = 0;
					vendorsObj.items = [];
				}

				that.getListDMitems(function (rTextItems) {
					var vendorArray = [];
					var dmArray = [];
					var spaceItem = {
						selected: false,
						isNew: false,
						key: "",
						desc: "",
						frDesc: "",
						enDesc: "",
						isDistributor: false
					};
					dmArray.push(spaceItem);
					dmArray = dmArray.concat(rTextItems);
					var lvItem = null;
					if (vendorsObj.items.length > 0) {
						for (var i = 0; i < vendorsObj.items.length; i++) {
							lvItem = vendorsObj.items[i];
							// if (!!lvItem.isDistributor) {
							// 	dmArray.push(lvItem);
							// } else {
							// 	vendorArray.push(lvItem);
							// }
							dmArray.push(lvItem);
							vendorArray.push(lvItem);
						}
					}

					vendorArray.push(spaceItem);

					var vendorModel = new JSONModel();

					var dmModel = new JSONModel();
					vendorModel.setData(vendorArray);
					dmModel.setData(dmArray);

					that.setModel(vendorModel, CONT_DM_VENDOR_MODEL);
					that.setModel(dmModel, CONT_DEL_METHOD_MODEL);
					//viewModel.setProperty("/currentProgram", currentProgram);

				});

			});
		},

		onCategoryChange: function (oEvent) { },

		onExportCategory: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var oModel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);
			this.getAllProgramCategoryMini(currentProgram.programUUId, function (items) {
				oModel.setData(items);
				var oEPExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					// Pass in the model created above
					//			models: this.getModel(CONST_VIEW_MODEL),
					models: oModel,

					// binding information for the rows aggregation
					rows: {
						path: "/"
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: resourceBundle.getText("Label.Category"),
						template: {
							content: {
								parts: ["CATEGORY_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Error"),
						template: {
							content: {
								parts: ["VALID"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "";

									} else {
										return "X";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Messages"),
						template: {
							content: {
								parts: ["to_messages"],
								formatter: function (value) {
									var messages = [];
									if (!!value && !!value.results && value.results.length > 0) {
										for (var i = 0; i < value.results.length; i++) {
											messages.push(value.results[i].ERROR_DESC);
										}
										return messages.join("|");

									} else {
										return "";
									}
								}
							}
						}
					}]
				});
				sap.ui.core.BusyIndicator.hide();
				// download exported file
				oEPExport.saveFile(resourceBundle.getText("Label.Category")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEPExport.destroy();
				});

			});
		},

		onExportVendor: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var oModel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);
			this.getAllProgramVendorMini(currentProgram.programUUId, function (items) {
				oModel.setData(items);
				var oEPExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					// Pass in the model created above
					//			models: this.getModel(CONST_VIEW_MODEL),
					models: oModel,

					// binding information for the rows aggregation
					rows: {
						path: "/"
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: resourceBundle.getText("Label.Vendor.Number"),
						template: {
							content: {
								parts: ["VENDOR_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Distributor"),
						template: {
							content: {
								parts: ["DISTRIBUTOR"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "X";

									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Error"),
						template: {
							content: {
								parts: ["VALID"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "";

									} else {
										return "X";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Messages"),
						template: {
							content: {
								parts: ["to_messages"],
								formatter: function (value) {
									var messages = [];
									if (!!value && !!value.results && value.results.length > 0) {
										for (var i = 0; i < value.results.length; i++) {
											messages.push(value.results[i].ERROR_DESC);
										}
										return messages.join("|");

									} else {
										return "";
									}
								}
							}
						}
					}]
				});
				sap.ui.core.BusyIndicator.hide();
				// download exported file
				oEPExport.saveFile(resourceBundle.getText("Label.Vendors")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEPExport.destroy();
				});

			});
		},

		onExportPartFitments: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var oModel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);
			this.getAllProgramPartFitmentMini(currentProgram.programUUId, function (items) {
				oModel.setData(items);
				var oEPExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					// Pass in the model created above
					//			models: this.getModel(CONST_VIEW_MODEL),
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
						name: resourceBundle.getText("Label.Vechicle.Model"),
						template: {
							content: {
								parts: ["MODEL_CODE"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Vechicle.Series"),
						template: {
							content: {
								parts: ["SERIES_CODE"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Vechicle.Year"),
						template: {
							content: {
								parts: ["YEAR"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Vechicle.Series.Desc.En"),
						template: {
							content: {
								parts: ["SERIES_DESC", "LANGUAGE_KEY"],
								formatter: function (value1, value2) {
									if (value2 == "EN") {
										return "" + value1;
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Vechicle.Series.Desc.Fr"),
						template: {
							content: {
								parts: ["SERIES_DESC", "LANGUAGE_KEY"],
								formatter: function (value1, value2) {
									if (value2 == "FR") {
										return "" + value1;
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Vechicle.Brand"),
						template: {
							content: {
								parts: ["BRAND"],
								formatter: function (value) {
									if (value == '10') {
										return 'TOYOTA';
									} else if (value == '20') {
										return 'LEXUS';
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Error"),
						template: {
							content: {
								parts: ["VALID"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "";

									} else {
										return "X";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Messages"),
						template: {
							content: {
								parts: ["to_messages"],
								formatter: function (value) {
									var messages = [];
									if (!!value && !!value.results && value.results.length > 0) {
										for (var i = 0; i < value.results.length; i++) {
											messages.push(value.results[i].ERROR_DESC);
										}
										return messages.join("|");

									} else {
										return "";
									}
								}
							}
						}
					}]
				});
				sap.ui.core.BusyIndicator.hide();
				// download exported file
				oEPExport.saveFile(resourceBundle.getText("Label.Part.fitment")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEPExport.destroy();
				});

			});
		},

		onExportParts: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var oModel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);
			this.getAllProgramPartMini(currentProgram.programUUId, function (items) {
				oModel.setData(items);
				var oEPExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

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
						name: resourceBundle.getText("Label.Vendor.Number"),
						template: {
							content: {
								parts: ["VENDOR_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Category.Code"),
						template: {
							content: {
								parts: ["CATEGORY_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.TireSize"),
						template: {
							content: {
								parts: ["TIRESIZE"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.LoadRating"),
						template: {
							content: {
								parts: ["LOADRATING"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.SpeedRating"),
						template: {
							content: {
								parts: ["SPEEDRATING"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Dealer.Net"),
						template: {
							content: {
								parts: ["DEALERNET"],
								formatter: function (value) {
									return "" + parseFloat(value).toFixed(2).toString();
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Error"),
						template: {
							content: {
								parts: ["VALID"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "";

									} else {
										return "X";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Messages"),
						template: {
							content: {
								parts: ["to_messages"],
								formatter: function (value) {
									var messages = [];
									if (!!value && !!value.results && value.results.length > 0) {
										for (var i = 0; i < value.results.length; i++) {
											messages.push(value.results[i].ERROR_DESC);
										}
										return messages.join("|");

									} else {
										return "";
									}
								}
							}
						}
					}]
				});
				sap.ui.core.BusyIndicator.hide();
				// download exported file
				oEPExport.saveFile(resourceBundle.getText("Label.Parts")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEPExport.destroy();
				});

			});
		},

		onExportDeliveryMethod: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var oModel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);
			this.getAllProgramDeliveryMethodMini(currentProgram.programUUId, function (items) {
				oModel.setData(items);
				var oEPExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					models: oModel,

					// binding information for the rows aggregation
					rows: {
						path: "/"
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: resourceBundle.getText("Label.Category.Code"),
						template: {
							content: {
								parts: ["CATEGORY_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Vendor.Number"),
						template: {
							content: {
								parts: ["VENDOR_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Delivery.Method"),
						template: {
							content: {
								parts: ["DEL_METHOD"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Error"),
						template: {
							content: {
								parts: ["VALID"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "";

									} else {
										return "X";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Messages"),
						template: {
							content: {
								parts: ["to_messages"],
								formatter: function (value) {
									var messages = [];
									if (!!value && !!value.results && value.results.length > 0) {
										for (var i = 0; i < value.results.length; i++) {
											messages.push(value.results[i].ERROR_DESC);
										}
										return messages.join("|");

									} else {
										return "";
									}
								}
							}
						}
					}]
				});
				sap.ui.core.BusyIndicator.hide();
				// download exported file
				oEPExport.saveFile(resourceBundle.getText("Label.Delivery.Method")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEPExport.destroy();
				});

			});
		},

		onExportPriorPurchases: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var oModel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);
			this.getAllProgramPriorPurchaseMini(currentProgram.programUUId, function (items) {
				oModel.setData(items);
				var oEPExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					models: oModel,

					// binding information for the rows aggregation
					rows: {
						path: "/"
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: resourceBundle.getText("Label.Dealer.Code"),
						template: {
							content: {
								parts: ["DEALER_CODE"],
								formatter: function (value) {
									if (!!value && value.length >= 10) {
										return value.substring(5).toString();
									} else {
										return "" + value;
									}
								}
							}
						}
					}, {
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
						name: resourceBundle.getText("Label.Prior.Purchase"),
						template: {
							content: {
								parts: ["PRIOR_PURCHASES"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Error"),
						template: {
							content: {
								parts: ["VALID"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "";

									} else {
										return "X";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Messages"),
						template: {
							content: {
								parts: ["to_messages"],
								formatter: function (value) {
									var messages = [];
									if (!!value && !!value.results && value.results.length > 0) {
										for (var i = 0; i < value.results.length; i++) {
											messages.push(value.results[i].ERROR_DESC);
										}
										return messages.join("|");

									} else {
										return "";
									}
								}
							}
						}
					}]
				});
				sap.ui.core.BusyIndicator.hide();
				// download exported file
				oEPExport.saveFile(resourceBundle.getText("Label.Prior.Purchases")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oEPExport.destroy();
				});

			});
		},

		onExportDeliveryLocation: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var oModel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);

			this.getAllProgramDeliveryLocationMini(currentProgram.programUUId, function (items) {
				oModel.setData(items);

				var oDMExport = new Export({

					// Type that will be used to generate the content. Own ExportType"s can be created to support other formats
					exportType: new ExportTypeCSV({
						separatorChar: ","
					}),

					// Pass in the model created above
					models: oModel,

					// binding information for the rows aggregation
					rows: {
						path: "/",
					},

					// column definitions with column name and binding info for the content
					columns: [{
						name: resourceBundle.getText("Label.Vendor.Number"),
						template: {
							content: {
								parts: ["VENDOR_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Delivery.Location.Id"),
						template: {
							content: {
								parts: ["DEL_LOCATION_ID"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Delivery.Location.Name.French"),
						template: {
							content: {
								// parts: ["FR_DEL_LOCATION_NAME"],
								parts: ["DEL_LOCATION_NAME"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Delivery.Location.Name.English"),
						template: {
							content: {
								// parts: ["EN_DEL_LOCATION_NAME"],
								parts: ["DEL_LOCATION_NAME"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Address1"),
						template: {
							content: {
								parts: ["DEL_ADDRESS1"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Address2"),
						template: {
							content: {
								parts: ["DEL_ADDRESS2"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Address.City"),
						template: {
							content: {
								parts: ["DEL_CITY"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Address.Province"),
						template: {
							content: {
								parts: ["DEL_PROVINCE"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Address.Zip"),
						template: {
							content: {
								parts: ["DEL_POSTAL_CODE"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Phone.Number"),
						template: {
							content: {
								parts: ["DEL_PHONE_NUMBER"],
								formatter: function (value) {
									return "" + value;
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Error"),
						template: {
							content: {
								parts: ["VALID"],
								formatter: function (value) {
									if (!!value && value === 'X') {
										return "";

									} else {
										return "X";
									}
								}
							}
						}
					}, {
						name: resourceBundle.getText("Label.Messages"),
						template: {
							content: {
								parts: ["to_messages"],
								formatter: function (value) {
									var messages = [];
									if (!!value && !!value.results && value.results.length > 0) {
										for (var i = 0; i < value.results.length; i++) {
											messages.push(value.results[i].ERROR_DESC);
										}
										return messages.join("|");

									} else {
										return "";
									}
								}
							}
						}
					}]
				});

				sap.ui.core.BusyIndicator.hide();
				// download exported file
				oDMExport.saveFile(resourceBundle.getText("Label.Delivery.Location")).catch(function (oError) {
					MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
				}).then(function () {
					oDMExport.destroy();
				});

			});

		},

		handleAddDelLoc: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var newlineObj = currentProgram.deliveryLocations.newline[0];
			var dellocObj = currentProgram.deliveryLocations;
			var resourceBundle = this.getResourceBundle();

			// has to have some key
			if (!!!dellocObj.currentVendor) {
				MessageBox.error(resourceBundle.getText("Message.error.delloc.novendor"));
				return false;
			}

			if (!!!newlineObj.key) {
				MessageBox.error(resourceBundle.getText("Message.error.delloc.nokey"));
				return false;
			}

			if (!!!newlineObj.name) {
				MessageBox.error(resourceBundle.getText("Message.error.delloc.noname"));
				return false;
			}

			if (!!!newlineObj.address) {
				MessageBox.error(resourceBundle.getText("Message.error.delloc.detail"));
				return false;
			}

			if (!!!newlineObj.phone) {
				// no longer validate the phone  number as mandatory field 
				// MessageBox.error(resourceBundle.getText("Message.error.delloc.phone"));
				// return false;
			} else if (newlineObj.phone.indexOf("_") >= 0) {
				MessageBox.error(resourceBundle.getText("Message.error.delloc.badphone"));
				return false;
			}

			// the xsa 
			var bModel = this.getBookingOdataV2Model();
			var entry = bModel.createEntry("/ProgramDeliveryLocationSet", {});
			var obj = entry.getObject();
			var obj = {};
			// prepare the data set
			obj.PROGRAM_UUID = currentProgram.programUUId;
			obj.VALID = "X";
			obj.VENDOR_ID = dellocObj.currentVendor;
			obj.DEL_LOCATION_ID = newlineObj.key;
			obj.DEL_LOCATION_NAME = newlineObj.name;
			obj.LANG = this.getCurrentLanguageKey();
			obj.DEL_ADDRESS1 = newlineObj.addressDetail.line1;
			obj.DEL_ADDRESS2 = newlineObj.addressDetail.line2;
			obj.DEL_CITY = newlineObj.addressDetail.city;
			obj.DEL_PROVINCE = newlineObj.addressDetail.province;
			obj.DEL_POSTAL_CODE = newlineObj.addressDetail.zip.replace(/\s/g, "");

			// get rid of mask	
			obj.DEL_PHONE_NUMBER = newlineObj.phone.replace(/\)/g, "").replace(/\(/g, "").replace(/\-/g, "");
			obj.CHANGED_BY = that.getUserId();

			sap.ui.core.BusyIndicator.show(0);

			bModel.create("/ProgramDeliveryLocationSet/" + 0 + "/BookingProgram.programDeliveryLocationCreate", obj, {
				success: function (oData, oResponse) {
					// get the details from the reload

					sap.ui.core.BusyIndicator.hide();
					if (!!oData) {
						currentProgram.deliveryLocations.newline[0].selected = false;
						currentProgram.deliveryLocations.newline[0].isNew = true;
						currentProgram.deliveryLocations.newline[0].isValid = oData.VALID;
						currentProgram.deliveryLocations.newline[0].hasError = false;
						currentProgram.deliveryLocations.newline[0].objectKey = oData.value.OBJECT_KEY;

						currentProgram.deliveryLocations.items.push(currentProgram.deliveryLocations.newline[0]);
						currentProgram.deliveryLocations.count = Number(currentProgram.deliveryLocations.count) + 1;
						currentProgram.deliveryLocations.countOnVendor = currentProgram.deliveryLocations.items.length;
						currentProgram.deliveryLocations.newline[0] = {
							key: "",
							name: "",
							address: "",
							addressDetail: {
								line1: "",
								line2: "",
								city: "",
								province: "",
								zip: ""
							},
							phone: ""
						};
						viewModel.setProperty("/currentProgram", currentProgram);
					}

				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					if (oError.statusCode === "551" || oError.statusCode === 551) {
						MessageBox.error(resourceBundle.getText("Message.error.delloc.exist"));
					} else if (oError.statusCode === "552" || oError.statusCode === 552) {
						MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
					}
					viewModel.setProperty("/currentProgram", currentProgram);
				}
			});
		},

		handleDeleteDelLoc: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var items = viewModel.getProperty("/currentProgram/deliveryLocations/items");

			var todoList = [];
			var todoList2 = [];
			var deletedList = [];
			var failedList = [];
			var comKey = [];
			var count = 0;
			if (!!items && items.length > 0) {
				for (var x1 = 0; x1 < items.length; x1++) {
					if (!!items[x1].selected) {
						comKey = [items[x1].objectKey];
						todoList.push(comKey);
						todoList2.push(comKey);
					}
				}
			}

			if (!!todoList && todoList.length > 0) {

				var confirmMessage = "";

				if (todoList.length > 1) {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.delloc", [todoList.length]);
				} else {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.delloc1", [todoList.length]);
				}

				MessageBox.confirm(confirmMessage, {
					onClose: function (sAction) {
						if (sAction === "OK") {
							sap.ui.core.BusyIndicator.show(0);

							for (var x2 = 0; x2 < todoList.length; x2++) {
								that.deleteProgramDelLoc(todoList[x2], function (comIds, isOK) {

									var lvKeyIds = null;
									for (var y1 = 0; y1 < todoList2.length; y1++) {
										lvKeyIds = todoList2[y1];
										if ((lvKeyIds[0] === comIds[0])) {
											todoList2.splice(y1, 1);
										}
									}
									if (!!isOK) {
										deletedList.push(comIds);
									} else {
										failedList.push(comIds);
									}

									// finished 
									if (todoList2.length <= 0) {
										if (!!deletedList && deletedList.length > 0) {
											for (var y2 = 0; y2 < deletedList.length; y2++) {
												for (var y3 = 0; y3 < items.length; y3++) {
													lvKeyIds = deletedList[y2];

													if ((items[y3].objectKey === lvKeyIds[0])) {
														items.splice(y3, 1);
														break;
													}
												}
											}
										}
										viewModel.setProperty("/currentProgram/deliveryLocations/items", items);
										count = viewModel.getProperty("/currentProgram/deliveryLocations/count");
										viewModel.setProperty("/currentProgram/deliveryLocations/count", count - 1);
										viewModel.setProperty("/currentProgram/deliveryLocations/countOnVendor", items.length);
										sap.ui.core.BusyIndicator.hide();
										if (!!failedList && failedList.length > 0) {
											MessageBox.error(resourceBundle.getText("Message.error.delete.failed"));
										} else {
											MessageBox.success(resourceBundle.getText("Message.delete.finished"));
										}
									}
								});
							}

						}
					}
				});
			} else {
				MessageBox.warning(resourceBundle.getText("Message.delete.nothing"));
			}
		},

		toggleVendorSelectX: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			if (!!currentProgram.vendors.items && !!currentProgram.vendors.items.length > 0) {
				for (var i = 0; i < currentProgram.vendors.items.length; i++) {
					currentProgram.vendors.items[i].selected = isSelected;
				}
			}
			viewModel.setProperty("/currentProgram", currentProgram);
		},

		toggleVendorRowSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var row = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getTable();
			if (isSelected) {
				table.setSelectedItem(row, true);
			} else {
				table.setSelectedItem(row, false);
			}
		},

		toggleCategorySelectX: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			if (!!currentProgram.categories.items && !!currentProgram.categories.items.length > 0) {
				for (var i = 0; i < currentProgram.categories.items.length; i++) {
					currentProgram.categories.items[i].selected = isSelected;
				}
			}
			viewModel.setProperty("/currentProgram", currentProgram);
		},

		toggleCategoryRowSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var row = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getTable();
			if (isSelected) {
				table.setSelectedItem(row, true);
			} else {
				table.setSelectedItem(row, false);
			}
		},

		toggleDMSelectX: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			if (!!currentProgram.deliveryMethods.items && !!currentProgram.deliveryMethods.items.length > 0) {
				for (var i = 0; i < currentProgram.deliveryMethods.items.length; i++) {
					currentProgram.deliveryMethods.items[i].selected = isSelected;
				}
			}
			viewModel.setProperty("/currentProgram", currentProgram);
		},

		toggleDMRowSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var row = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getTable();
			if (isSelected) {
				table.setSelectedItem(row, true);
			} else {
				table.setSelectedItem(row, false);
			}
		},

		togglePartFitmentsSelectX: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			if (!!isSelected) {
				this._partFitmentTable.selectAll();
			} else {
				this._partFitmentTable.removeSelections(true);
			}

			// var viewModel = this.getModel(CONST_VIEW_MODEL);
			// var currentProgram = viewModel.getProperty("/currentProgram");

			// if (!!currentProgram.partfitments.items && !!currentProgram.partfitments.items.length > 0) {
			// 	for (var i = 0; i < currentProgram.partfitments.items.length; i++) {
			// 		currentProgram.partfitments.items[i].selected = isSelected;
			// 	}
			// }
			// viewModel.setProperty("/currentProgram", currentProgram);
		},

		togglePartsSelectX: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;

			if (!!isSelected) {
				this._partsTable.selectAll();
			} else {
				this._partsTable.removeSelections(true);
			}
			// var viewModel = this.getModel(CONST_VIEW_MODEL);
			// var currentProgram = viewModel.getProperty("/currentProgram");

			// if (!!currentProgram.parts.items && !!currentProgram.parts.items.length > 0) {
			// 	for (var i = 0; i < currentProgram.parts.items.length; i++) {
			// 		currentProgram.parts.items[i].selected = isSelected;
			// 	}
			// }
			// viewModel.setProperty("/currentProgram", currentProgram);
		},

		togglePartRowSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var row = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getTable();
			if (isSelected) {
				table.setSelectedItem(row, true);
			} else {
				table.setSelectedItem(row, false);
			}
		},

		togglePartFitmentRowSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			if (!!isSelected) {
				this._priorPurchasesTable.selectAll();
			} else {
				this._priorPurchasesTable.removeSelections(true);
			}

			// var row = oEvent.getSource().getParent();
			// var table = oEvent.getSource().getParent().getTable();
			// if (isSelected) {
			// 	table.setSelectedItem(row, true);
			// } else {
			// 	table.setSelectedItem(row, false);
			// }
		},

		togglePriorSelectX: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			if (!!currentProgram.priorPurchases.items && !!currentProgram.priorPurchases.items.length > 0) {
				for (var i = 0; i < currentProgram.priorPurchases.items.length; i++) {
					currentProgram.priorPurchases.items[i].selected = isSelected;
				}
			}
			viewModel.setProperty("/currentProgram", currentProgram);
		},

		togglePriorRowSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var row = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getTable();
			if (isSelected) {
				table.setSelectedItem(row, true);
			} else {
				table.setSelectedItem(row, false);
			}
		},

		toggleDelLocSelect: function (oEvent) {
			var isSelected = oEvent.getParameters("Selected").selected;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			if (!!currentProgram.deliveryLocations.items && !!currentProgram.deliveryLocations.items.length > 0) {
				for (var i = 0; i < currentProgram.deliveryLocations.items.length; i++) {
					currentProgram.deliveryLocations.items[i].selected = isSelected;
				}
			}
			viewModel.setProperty("/currentProgram", currentProgram);
		},

		toggleDelLocRowSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			var row = oEvent.getSource().getParent();
			var table = oEvent.getSource().getParent().getTable();
			if (isSelected) {
				table.setSelectedItem(row, true);
			} else {
				table.setSelectedItem(row, false);
			}
		},

		loadListVendorX: function () {

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var vendorsObj = currentProgram.vendors;

			// this.getListVendorMessages(currentProgram.programUUId, false, function (rItems) {
			this.getAllProgramVendorMini(currentProgram.programUUId, function (rItems) {
				// sap.ui.core.BusyIndicator.hide();
				if (!!rItems && rItems.length > 0) {
					vendorsObj.count = rItems.length;
					vendorsObj.items = rItems;
					for (var i = 0; i < rItems.length; i++) {
						rItems[i].selected = false;
						rItems[i].objectKey = rItems[i].OBJECT_KEY;
						rItems[i].key = rItems[i].VENDOR_ID;
						rItems[i].desc = rItems[i].VENDOR_DESC;
						if (rItems[i].DISTRIBUTOR === "X") {
							rItems[i].isDistributor = true;
						} else {
							rItems[i].isDistributor = false;
						}

						if (!!rItems[i].VALID && rItems[i].VALID === "X") {
							rItems[i].hasError = false;
						} else {
							rItems[i].hasError = true;
						}
					}
				} else {
					vendorsObj.count = 0;
					vendorsObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		loadListDeliveryMethodX: function () {

			this.loadProgDelMethodListCategory();
			// this.loadProgDelMethodListVendor();

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.deliveryMethods;

			this.getAllProgramDeliveryMethodMini(currentProgram.programUUId, function (
				// this.Messages(currentProgram.programUUId, false, function (
				rItems) {
				if (!!rItems && rItems.length > 0) {
					theObj.count = rItems.length;
					theObj.items = rItems;
					for (var i = 0; i < rItems.length; i++) {
						rItems[i].selected = false;
						rItems[i].objectKey = rItems[i].OBJECT_KEY;
						rItems[i].vendorId = rItems[i].VENDOR_ID;
						rItems[i].vendorName = rItems[i].VENDOR_DESC;
						rItems[i].categoryId = rItems[i].CATEGORY_ID;
						rItems[i].categoryName = rItems[i].CATEGORY_DESC;
						rItems[i].dmId = rItems[i].DEL_METHOD;
						rItems[i].dmName = rItems[i].DEL_METHOD_NAME;

						if (!!rItems[i].VALID && rItems[i].VALID === "X") {
							rItems[i].hasError = false;
						} else {
							rItems[i].hasError = true;
						}
					}
				} else {
					theObj.count = 0;
					theObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		resetDMRelatedCategoryModel: function () {

		},

		resetDMRelatedVendorModel: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var vendorsObj = currentProgram.vendors;
			this.getListVendor(currentProgram.programUUId, true, function (rItems) {
				if (!!rItems && rItems.length > 0) {
					vendorsObj.count = rItems.length;
					vendorsObj.items = rItems;
				} else {
					vendorsObj.count = 0;
					vendorsObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		resetDMMetaModel: function () {

		},

		onDelLocVendorChange: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.deliveryLocations;
			var vendorSelector = this.byId("_delLocVendor");
			var vendorKey = vendorSelector.getSelectedKey();

			that.getListProgramDelLocMessages(currentProgram.programUUId, false, vendorKey, function (
				rdItems) {
				if (!!rdItems && rdItems.length > 0) {
					theObj.countOnVendor = rdItems.length;
					theObj.items = rdItems;
				} else {
					theObj.countOnVendor = 0;
					theObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		loadListDeliveryLocation: function () {
			// get the selected key. this is vendor dependent
			var that = this;
			// var vendorSelector = this.byId("_delLocVendor");
			// var vendorKey = vendorSelector.getSelectedKey();

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var currentVendor = viewModel.getProperty("/currentProgram/deliveryLocations/currentVendor");
			sap.ui.core.BusyIndicator.show(0);
			if (!!currentVendor) {
				that.getListProgramDelLocMessages(currentProgram.programUUId, false, currentVendor, function (
					rdItems) {
					if (!!rdItems && rdItems.length > 0) {
						currentProgram.deliveryLocations.countOnVendor = rdItems.length;
						currentProgram.deliveryLocations.items = rdItems;
					} else {
						currentProgram.deliveryLocations.countOnVendor = 0;
						currentProgram.deliveryLocations.items = [];
					}
					viewModel.setProperty("/currentProgram", currentProgram);
					sap.ui.core.BusyIndicator.hide();
				});
			} else {
				sap.ui.core.BusyIndicator.hide();
			}
			var aSorters = [];

			aSorters.push(new sap.ui.model.Sorter("key", false));
			aSorters.push(new sap.ui.model.Sorter("address", false));
			var oBinding = this._delLocTable.getBinding("items");
			var oBinding1 = this._delLocTableNoneditable.getBinding("items");
			oBinding.sort(aSorters);
			oBinding1.sort(aSorters);
		},

		loadListDeliveryLocationX: function () {
			// get the selected key. this is vendor dependent
			var that = this;
			var vendorSelector = this.byId("_delLocVendor");
			var vendorKey = vendorSelector.getSelectedKey();
			var vendorKey2 = null;

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.deliveryLocations;

			var vendorsObj = {};
			var vendorModel = new JSONModel();

			var isFound = false;
			this.getListVendor(currentProgram.programUUId, true, function (rItems) {
				if (!!rItems && rItems.length > 0) {
					vendorsObj.count = rItems.length;
					vendorsObj.items = rItems;
					vendorModel.setData(vendorsObj.items);
					that.setModel(vendorModel, CONT_DL_VENDOR_MODEL);
					for (var i = 0; i < rItems.length; i++) {
						if (rItems[i].key === vendorKey) {
							vendorKey2 = rItems[i].key;
							isFound = true;
						}
					}
					if (!isFound) {
						vendorKey2 = rItems[0].key;
					}
					theObj.currentVendor = vendorKey2;
					that.getListProgramDelLocMessages(currentProgram.programUUId, false, vendorKey2, function (
						rdItems) {
						// sap.ui.core.BusyIndicator.hide();
						if (!!rdItems && rdItems.length > 0) {
							theObj.countOnVendor = rdItems.length;
							theObj.items = rdItems;
						} else {
							theObj.countOnVendor = 0;
							theObj.items = [];
						}
						viewModel.setProperty("/currentProgram", currentProgram);
					});

				} else {
					// DO nothing here
					vendorsObj.count = 0;
					vendorsObj.items = [];
					vendorModel.setData(vendorsObj.items);
					that.setModel(vendorModel, CONT_DL_VENDOR_MODEL);
					//viewModel.setProperty("/currentProgram", currentProgram);
				}
			});
		},

		loadListPartFitmentsX: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.partfitments;

			// this.loadListCategory();
			// this.loadListVendor();

			//  load the parts in parallel
			this.getListProgramParts(currentProgram.programUUId, true, function (
				rItems) {
				theObj.partsList = [];

				var item = {
					partId: "",
					partDesc: ""
				};
				theObj.partsList.push(item);
				if (!!rItems && rItems.length > 0) {
					for (var x = 0; x < rItems.length; x++) {
						item = {
							partId: rItems[x].partId,
							partDesc: rItems[x].partDesc
						};
						theObj.partsList.push(item);
					}
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});

			this.getListProgramPartFitmentsMessages(currentProgram.programUUId, false, function (
				rItems) {
				if (!!rItems && rItems.length > 0) {
					theObj.count = rItems.length;
					theObj.items = rItems;
				} else {
					theObj.count = 0;
					theObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		loadListPartsX: function () {
			// console.log("calling load list part 2");
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.parts;

			// var key = "/MiniProgramCategoryInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + that.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramCategorySet(ProgramUid='" + currentProgram.programUUId + "',Language='" + that.getCurrentLanguageKey() +
				"')/Set";

			var theList = this.byId("partsTable");
			var theRow = this.byId("partsRowT").clone();

			// this.loadListCategory();
			// this.loadListVendor();

			this.getListCategory(currentProgram.programUUId, true, function (rItems) {
				if (!!rItems && rItems.length > 0) {
					theObj.categoryList = rItems;
				} else {
					theObj.categoryList = [];
				}
				theObj.categoryList.unshift({
					key: "",
					enDesc: "",
					frDesc: "",
					isDistributor: false,
					desc: ""
				});

				viewModel.setProperty("/currentProgram", currentProgram);
			});
			this.getListVendor(currentProgram.programUUId, true, function (rItems) {
				if (!!rItems && rItems.length > 0) {
					theObj.vendorList = rItems;
				} else {
					theObj.vendorList = [];
				}
				theObj.vendorList.unshift({
					key: "",
					enDesc: "",
					frDesc: "",
					desc: ""
				});
				viewModel.setProperty("/currentProgram", currentProgram);
			});

			this.getAllProgramPartMini(currentProgram.programUUId, function (
				rItems) {
				if (!!rItems && rItems.length > 0) {
					theObj.count = rItems.length;
					theObj.items = rItems;
					for (var i = 0; i < rItems.length; i++) {
						rItems[i].selected = false;
						rItems[i].objectKey = rItems[i].OBJECT_KEY;
						rItems[i].vendorId = rItems[i].VENDOR_ID;
						rItems[i].categoryId = rItems[i].CATEGORY_ID;
						rItems[i].partId = rItems[i].PART_NUM;
						rItems[i].details = rItems[i].DETAIL;

						rItems[i].partDesc = rItems[i].PART_DESC;
						rItems[i].vendorName = rItems[i].VENDOR_DESC;
						rItems[i].categoryName = rItems[i].CATEGORY_DESC;
						if (!!rItems[i].VALID && rItems[i].VALID === "X") {
							rItems[i].hasError = false;
						} else {
							rItems[i].hasError = true;
						}

					}
				} else {
					theObj.count = 0;
					theObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		loadListPriorPurchasesX: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.priorPurchases;

			this.getListProgramParts(currentProgram.programUUId, true, function (
				rItems) {
				if (!!rItems && rItems.length > 0) {
					theObj.allowedParts = rItems;
				} else {
					theObj.allowedParts = [];
				}

				theObj.allowedParts.unshift({
					selected: false,
					vendorId: "",
					categoryId: "",
					partId: "",
					partDesc: "",
					vendorName: "",
					categoryName: ""
				});

				viewModel.setProperty("/currentProgram", currentProgram);
			});

			this.getListProgramPriorPurMessages(currentProgram.programUUId, false, function (
				rItems) {
				// sap.ui.core.BusyIndicator.hide();
				if (!!rItems && rItems.length > 0) {
					theObj.count = rItems.length;
					theObj.items = rItems;
				} else {
					theObj.count = 0;
					theObj.items = [];
				}
				viewModel.setProperty("/currentProgram", currentProgram);
			});
		},

		onBackgroundDesignSelect: function () {
			this.hasDirtyContent = true;
		},

		onChange: function () {
			this.hasDirtyContent = true;
		},

		onWoChange: function (oEvent) {
			var oDP = oEvent.getSource();
			var bValid = oEvent.getParameter("valid");
			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
				var viewModel = this.getModel(CONST_VIEW_MODEL);
				var currentProgramSummary = viewModel.getProperty("/currentProgram/summary");
				currentProgramSummary.bWindowOpenDate = oDP.getDateValue();
				currentProgramSummary.bWindowOpenDateEst = formatter.valueESTDate(currentProgramSummary.bWindowOpenDate);
				viewModel.setProperty("/currentProgram/summary", currentProgramSummary);
			} else {
				//
				var oldValue = oDP.getDateValue();
				oDP.setValue(formatter.valueDate(oldValue));
			}
		},

		onFrDescChange: function (oEvent) {
			var oDP = oEvent.getSource();
			var sValue = oEvent.getParameter("value");

			if (!!sValue) {
				oDP.setValueState(sap.ui.core.ValueState.None);
			}
		},

		onEnDescChange: function (oEvent) {
			var oDP = oEvent.getSource();
			var sValue = oEvent.getParameter("value");

			if (!!sValue) {
				oDP.setValueState(sap.ui.core.ValueState.None);
			}
		},

		onWcChange: function (oEvent) {
			var oDP = oEvent.getSource();
			var bValid = oEvent.getParameter("valid");
			if (bValid) {
				oDP.setValueState(sap.ui.core.ValueState.None);
				var viewModel = this.getModel(CONST_VIEW_MODEL);
				var currentProgramSummary = viewModel.getProperty("/currentProgram/summary");
				currentProgramSummary.bWindowCloseDate = oDP.getDateValue();
				currentProgramSummary.bWindowCloseDateEst = formatter.valueESTDate(currentProgramSummary.bWindowCloseDate);
				viewModel.setProperty("/currentProgram/summary", currentProgramSummary);

			} else {
				var oldValue = oDP.getDateValue();
				oDP.setValue(formatter.valueDate(oldValue));
			}
		},

		onDfChange: function (oEvent) {
			var resourceBundle = this.getResourceBundle();
			var oDP = oEvent.getSource();
			var bValid = oEvent.getParameter("valid");
			var s = oDP._oCalendar.getSelectedDates();
			if (s.length > 0) {
				var h = s[0].getStartDate().getDay();
				if (h === 6 || h === 0) {
					MessageToast.show(resourceBundle.getText("noWeekendSelection"));
					oDP.setValue();
					return;
				} else {
					if (bValid) {
						oDP.setValueState(sap.ui.core.ValueState.None);
						var viewModel = this.getModel(CONST_VIEW_MODEL);
						var currentProgramSummary = viewModel.getProperty("/currentProgram/summary");
						currentProgramSummary.deliveryFromDate = oDP.getDateValue();
						viewModel.setProperty("/currentProgram/summary", currentProgramSummary);
					} else {
						var oldValue = oDP.getDateValue();
						oDP.setValue(formatter.valueDate(oldValue));
					}
				}
			}
		},

		onDtChange: function (oEvent) {
			var resourceBundle = this.getResourceBundle();
			var oDP = oEvent.getSource();
			var bValid = oEvent.getParameter("valid");
			var s = oDP._oCalendar.getSelectedDates();
			if (s.length > 0) {
				var h = s[0].getStartDate().getDay();
				if (h === 6 || h === 0) {
					MessageToast.show(resourceBundle.getText("noWeekendSelection"));
					oDP.setValue();
					return;
				} else {
					if (bValid) {
						oDP.setValueState(sap.ui.core.ValueState.None);
						var viewModel = this.getModel(CONST_VIEW_MODEL);
						var currentProgramSummary = viewModel.getProperty("/currentProgram/summary");
						currentProgramSummary.deliveryTODate = oDP.getDateValue();
						viewModel.setProperty("/currentProgram/summary", currentProgramSummary);
					} else {
						var oldValue = oDP.getDateValue();
						oDP.setValue(formatter.valueDate(oldValue));
					}
				}
			}
		},

		getModelYears: function (model, callback) {
			var bModel = this.getVehicleCatalogModel();
			var key = bModel.createKey("/zc_model", {
				"Model": model
			});
			bModel.read(key, {
				urlParameters: {
					"$expand": "to_modelyear"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.to_modelyear && !!oData.to_modelyear.results && oData.to_modelyear.results.length > 0) {
						var years = [];
						years.push({
							key: "",
							value: ""
						});
						for (var x = 0; x < oData.to_modelyear.results.length; x++) {

							years.push({
								key: oData.to_modelyear.results[x].ModelYear,
								value: oData.to_modelyear.results[x].ModelYear
							});
						}

						callback(years);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});

		},

		getModelTCISeries: function (model, callback) {
			var bModel = this.getVehicleCatalogModel();
			var that = this;
			bModel.read("/zc_configuration", {
				urlParameters: {
					"$expand": "to_Model/to_mmfields",
					"$filter": "Model eq '" + model + "'"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results[0].to_Model && !!oData.results[0].to_Model.to_mmfields && !!oData.results[
						0]
						.to_Model.to_mmfields.results.length > 0) {
						var tciSeriesData = {};
						var tciSeries = oData.results[0].to_Model.to_mmfields.results[0];
						tciSeriesData.ModelSeriesNo = tciSeries.ModelSeriesNo;
						tciSeriesData.TCISeriesDescriptionEN = tciSeries.TCISeriesDescriptionEN;
						tciSeriesData.TCISeriesDescriptionFR = tciSeries.TCISeriesDescriptionFR;

						callback(tciSeriesData);
					} else {
						MessageBox.error(that.getResourceBundle().getText("Message.error.no.tciSeries"));

						callback(null);
					}
				},
				error: function (err) {
					MessageBox.error(that.getResourceBundle().getText("Message.error.no.tciSeries"));
					callback(null);
				}
			});

		},

		loadSummary: function (uuid, userProfile) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var bModel = this.getBookingOdataV2Model();

			var key = bModel.createKey("/BookingProgramSummary", {
				"PROGRAM_UUID": uuid
			});

			bModel.read(key, {
				urlParameters: {
					"$expand": "to_programCounts,to_cpprogram"
				},
				success: function (oData, oResponse) {
					if (!!oData) {
						currentProgram.summary.department = oData.DEPART;
						switch (oData.BRAND) {
							case "00":
								currentProgram.summary.dealerToyota = true;
								currentProgram.summary.dealerLexus = true;
								break;
							case "10":
								currentProgram.summary.dealerToyota = true;
								currentProgram.summary.dealerLexus = false;
								break;
							case "20":
								currentProgram.summary.dealerToyota = false;
								currentProgram.summary.dealerLexus = true;
								break;
							default:
								currentProgram.summary.dealerToyota = false;
								currentProgram.summary.dealerLexus = false;
								break;
						}

						currentProgram.summary.dealerOriginToyota = currentProgram.summary.dealerToyota;
						currentProgram.summary.dealerOriginLexus = currentProgram.summary.dealerLexus;

						currentProgram.isNew = false;
						currentProgram.programUUId = oData.PROGRAM_UUID;
						currentProgram.programId = oData.PROGRAM_ID;
						currentProgram.programId = oData.PROGRAM_ID;
						currentProgram.summary.status = oData.STATUS;
						currentProgram.readOnly = true;
						if (oData.STATUS === "CP") {
							currentProgram.isClosed = true;
						} else {
							currentProgram.isClosed = false;
						}

						currentProgram.summary.programId = oData.PROGRAM_ID;
						currentProgram.summary.division = oData.BRAND;
						currentProgram.summary.bWindowOpen = formatter.valueDateFormat(oData.OPEN_DATE);
						currentProgram.summary.bWindowOpenDate = formatter.valueLocalDate(oData.OPEN_DATE);
						currentProgram.summary.bWindowOpenDateEst = formatter.valueUtcESTDate(oData.OPEN_DATE);
						currentProgram.summary.bWindowClose = formatter.valueDateFormat(oData.CLOSE_DATE);
						currentProgram.summary.bWindowCloseDate = formatter.valueLocalDate(oData.CLOSE_DATE);
						currentProgram.summary.bWindowCloseDateEst = formatter.valueUtcESTDate(oData.CLOSE_DATE);
						currentProgram.summary.deliveryFrom = formatter.valueDateFormat(oData.DELIVERY_FR);
						currentProgram.summary.deliveryFromDate = formatter.valueLocalDate(oData.DELIVERY_FR);
						currentProgram.summary.deliveryTO = formatter.valueDateFormat(oData.DELIVERY_TO);
						currentProgram.summary.deliveryTODate = formatter.valueLocalDate(oData.DELIVERY_TO);
						currentProgram.summary.initialWaringDays = oData.INITIAL_WARN;
						currentProgram.summary.finalWarningDays = parseInt(oData.FINAL_WARN, 10);
						currentProgram.summary.frDesc = oData.FR_DESC;
						currentProgram.summary.enDesc = oData.EN_DESC;

						if (!!oData.to_cpprogram) {
							currentProgram.summary.cpprogram.uuid = oData.to_cpprogram.PROGRAM_UUID;
							currentProgram.summary.cpprogram.id = oData.to_cpprogram.PROGRAM_ID;
						} else {
							currentProgram.summary.cpprogram.uuid = "";
							currentProgram.summary.cpprogram.id = "";
						}

						// saved one call, 
						if (!!oData.to_programCounts) {
							currentProgram.categories.count = Number(oData.to_programCounts.count_category);
							currentProgram.vendors.count = Number(oData.to_programCounts.count_vendor);
							currentProgram.deliveryMethods.count = Number(oData.to_programCounts.count_del_method);
							currentProgram.deliveryLocations.count = Number(oData.to_programCounts.count_del_location);
							currentProgram.parts.count = Number(oData.to_programCounts.count_part);
							currentProgram.partfitments.count = Number(oData.to_programCounts.count_part_fitment);
							currentProgram.priorPurchases.count = Number(oData.to_programCounts.count_p_purchase);

						} else {
							var dKey = bModel.createKey("/BookingProgramCount", {
								"PROGRAM_UUID": oData.PROGRAM_UUID
							});
							bModel.read(dKey, {
								urlParameters: {},
								success: function (iCounts, iResponse) {
									currentProgram.categories.count = iCounts.count_category;
									currentProgram.vendors.count = iCounts.count_vendor;
									currentProgram.deliveryMethods.count = iCounts.count_del_method;
									currentProgram.deliveryLocations.count = iCounts.count_del_location;
									currentProgram.parts.count = iCounts.count_part;
									currentProgram.partfitments.count = iCounts.count_part_fitment;
									currentProgram.priorPurchases.count = iCounts.count_p_purchase;

									// set the counts
									viewModel.setProperty("/currentProgram", currentProgram);

								},
								error: function (err) { }
							});
						}

						// to load the counts
						viewModel.setProperty("/currentProgram", currentProgram);
						viewModel.setProperty("/displayMode", true);
						if (!!userProfile.scopes.BookingAdmin && currentProgram.summary.department === userProfile.userData.department) {
							viewModel.setProperty("/editable", true);
							//	viewModel.setProperty("/submitable", true);
						}
						that.refreshValidCategoryListCache(function () {
							//TODO
						});
					}
				},
				error: function (err) { }
			});
		},

		onDeleteSummary: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var bModel = this.getBookingOdataV2Model();
			var key = bModel.createKey("/BookingProgramSummary", {
				"PROGRAM_UUID": currentProgram.programUUId
			});

			//chekc the dependence. 
			if (currentProgram.summary.status === 'FT') {
				// you can delete, 
				if (currentProgram.categories.count > 0 ||
					currentProgram.deliveryLocations.count > 0 ||
					currentProgram.deliveryMethods.count > 0 ||
					currentProgram.partfitments.count > 0 ||
					currentProgram.priorPurchases.count > 0 ||
					currentProgram.vendors.count > 0 ||
					currentProgram.parts.count > 0) {
					MessageBox.warning(resourceBundle.getText("Message.warning.dependent.deletion"));
					return false;
				} else {

					MessageBox.confirm(
						resourceBundle.getText("Message.warning.confirm.deletion", [currentProgram.programId]), {
						onClose: function (sAction) {
							if (sAction === "OK") {
								bModel.callFunction("/BookingProgramSummary/" + 0 + "/BookingProgram.bookingProgramDelete", {
									method: "POST",
									urlParameters: {
										PROGRAM_UUID: currentProgram.programUUId
									},
									success: function (oData, oResponse) {
										that.hasDirtyContent = false;
										MessageBox.success(
											resourceBundle.getText("Message.delete.ok", [currentProgram.programId]), {
											onClose: function (sActionInner) {
												that.getRouter().navTo("SearchProgram", null, false);
											}
										}
										);
									},
									error: function (oError) {
										if (oError.statusCode === "556" || oError.statusCode === 556) {
											var code = JSON.parse(err.responseText).error.message.value;
											MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code))
										}
									}
								});

							}
						}
					}
					);
				}
			} else {
				MessageBox.warning(resourceBundle.getText("Message.warning.notfuturestate.deletion"));
				return false;
			}
		},

		checkSummaryFileds: function () {
			var resourceBundle = this.getResourceBundle();
			var hasError = false;
			var errorMessage = [];
			var fuiwOpen = this.getView().byId("wOpenUi");
			var wOpenDate = fuiwOpen.getDateValue();
			if (wOpenDate === null) {
				errorMessage.push(resourceBundle.getText("Message.error.required.fuiwOpen"));
				fuiwOpen.setValueState(sap.ui.core.ValueState.Error);
				hasError = true;
			}

			var fuiwClose = this.getView().byId("wCloseUi");
			var wCloseDate = fuiwClose.getDateValue();
			if (wCloseDate === null) {
				errorMessage.push(resourceBundle.getText("Message.error.required.fuiwClose"));
				fuiwClose.setValueState(sap.ui.core.ValueState.Error);
				hasError = true;
			}

			var fuidFrom = this.getView().byId("dFromUi");
			var dFromDate = fuidFrom.getDateValue();
			if (dFromDate === null) {
				errorMessage.push(resourceBundle.getText("Message.error.required.fuidFrom"));
				fuidFrom.setValueState(sap.ui.core.ValueState.Error);
				hasError = true;
			}

			var fuidToUi = this.getView().byId("dToUi");
			var dToDate = fuidToUi.getDateValue();
			if (dToDate === null) {
				errorMessage.push(resourceBundle.getText("Message.error.required.fuidToUi"));
				fuidToUi.setValueState(sap.ui.core.ValueState.Error);
				hasError = true;
			}

			if (!!wOpenDate && !!wCloseDate && wOpenDate > wCloseDate) {
				errorMessage.push(resourceBundle.getText("Message.error.wOpen2wClos.bigger"));
				hasError = true;
			}

			if (!!dFromDate && !!dToDate && dFromDate > dToDate) {
				errorMessage.push(resourceBundle.getText("Message.error.dFrom2dTo.bigger"));
				hasError = true;
			}

			if (!!dFromDate && !!wOpenDate && wOpenDate > dFromDate) {
				errorMessage.push(resourceBundle.getText("Message.error.wOpen2dFrom.bigger"));
				hasError = true;
			}
			var fuiFrDesc = this.getView().byId("frDesc");
			if (!!fuiFrDesc.getValue()) {
				fuiFrDesc.setValueState(sap.ui.core.ValueState.None);
			} else {
				errorMessage.push(resourceBundle.getText("Message.error.required.frdesc"));
				fuiFrDesc.setValueState(sap.ui.core.ValueState.Error);
				hasError = true;
			}

			var fuiEnDesc = this.getView().byId("enDesc");
			if (!!fuiEnDesc.getValue()) {
				fuiEnDesc.setValueState(sap.ui.core.ValueState.None);
			} else {
				errorMessage.push(resourceBundle.getText("Message.error.required.endesc"));
				fuiEnDesc.setValueState(sap.ui.core.ValueState.Error);
				hasError = true;
			}

			var fuiCheck1 = this.getView().byId("check1");
			var fuiCheck2 = this.getView().byId("check2");
			if (!fuiCheck1.getSelected() && !fuiCheck2.getSelected()) {
				errorMessage.push(resourceBundle.getText("Message.error.required.dealer.pa"));
				fuiCheck1.setValueState(sap.ui.core.ValueState.Error);
				fuiCheck2.setValueState(sap.ui.core.ValueState.Error);
				hasError = true;
			} else {
				fuiCheck1.setValueState(sap.ui.core.ValueState.None);
				fuiCheck2.setValueState(sap.ui.core.ValueState.None);
			}

			if (hasError) {
				MessageBox.error(errorMessage.join("\n"));
				return false;
			} else {
				return true;
			}
		},

		onSaveSummary: function (oEvent) {
			this.doSaveSummary();
		},

		doSaveSummary: function () {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var bModel = this.getBookingOdataV2Model();
			// validate the 
			if (!this.checkSummaryFileds()) {
				return false;
			}
			if (!!currentProgram.summary) {
				if (!!currentProgram.isNew) {
					//var rand = Math.floor(Math.random() * 10000);
					var entry = bModel.createEntry("/BookingProgramSummary", {});
					var obj = entry.getObject();
					var obj = {};
					obj.PROGRAM_ID = currentProgram.programId;
					obj.DEPART = currentProgram.summary.department;
					if (!!currentProgram.summary.dealerToyota) {
						if (!!currentProgram.summary.dealerLexus) {
							obj.BRAND = "00";
						} else {
							obj.BRAND = "10";
						}
					} else {
						if (!!currentProgram.summary.dealerLexus) {
							obj.BRAND = "20";
						} else {
							obj.BRAND = "99";
						}
					}
					obj.OPEN_DATE = currentProgram.summary.bWindowOpen;
					obj.CLOSE_DATE = currentProgram.summary.bWindowClose;
					obj.DELIVERY_FR = currentProgram.summary.deliveryFrom;
					obj.DELIVERY_TO = currentProgram.summary.deliveryTO;

					// obj.OPEN_DATE = formatter.getESTDateNoDST(currentProgram.summary.bWindowOpen);
					// obj.CLOSE_DATE = formatter.getESTDateNoDST(currentProgram.summary.bWindowClose);
					// obj.DELIVERY_FR = formatter.getESTDateNoDST(currentProgram.summary.deliveryFrom);
					// obj.DELIVERY_TO = formatter.getESTDateNoDST(currentProgram.summary.deliveryTO);
					obj.INITIAL_WARN = currentProgram.summary.initialWaringDays.toString();
					obj.FINAL_WARN = currentProgram.summary.finalWarningDays.toString();
					obj.CPROGRAM_UUID = currentProgram.summary.cpprogram.uuid;
					obj.STATUS = currentProgram.summary.status;
					obj.FR_DESC = currentProgram.summary.frDesc;
					obj.EN_DESC = currentProgram.summary.enDesc;
					obj.CHANGED_BY = that.getUserId();

					bModel.create("/BookingProgramSummary/" + 0 + "/BookingProgram.bookingProgramCreate", obj, {
						success: function (oData, oResponse) {
							if (oData.value.HTTP_STATUS_CODE === "551" || oData.value.HTTP_STATUS_CODE === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.exist"));
							} else if (oData.value.HTTP_STATUS_CODE === "552" || oData.value.HTTP_STATUS_CODE === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							} else if (oData.value.HTTP_STATUS_CODE === "556" || oData.value.HTTP_STATUS_CODE === 556) {
								//var code = JSON.parse(oError.responseText).error.message.value;
								currentProgram.summary.dealerToyota = currentProgram.summary.adealerOriginToyota;
								currentProgram.summary.dealerLexus = currentProgram.summary.dealerOriginLexus;
								viewModel.setProperty("/currentProgram", currentProgram);
								MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.bookingProgramCreate.DETAIL))
							} else {
								currentProgram.isNew = false;
								that.hasDirtyContent = false;
								currentProgram.programUUId = oData.value.PROGRAM_UUID;
								console.log(currentProgram.programUUId);
								currentProgram.programId = oData.value.PROGRAM_ID;
								currentProgram.summary.status = oData.value.STATUS;
								currentProgram.summary.division = oData.value.BRAND;
								currentProgram.summary.dealerOriginToyota = currentProgram.summary.dealerToyota;
								currentProgram.summary.dealerOriginLexus = currentProgram.summary.dealerLexus;
								viewModel.setProperty("/currentProgram", currentProgram);
								that.refreshValidCategoryListCache(function () {
									//TODO
								});

								MessageBox.success(resourceBundle.getText("Message.saved.confirm"));
							}
						},
						error: function (oError) {
							if (oError.statusCode === "551" || oError.statusCode === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.exist"));
							} else if (oError.statusCode === "552" || oError.statusCode === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							} else if (oError.statusCode === "556" || oError.statusCode === 556) {
								var code = JSON.parse(oError.responseText).error.message.value;
								currentProgram.summary.dealerToyota = currentProgram.summary.adealerOriginToyota;
								currentProgram.summary.dealerLexus = currentProgram.summary.dealerOriginLexus;
								viewModel.setProperty("/currentProgram", currentProgram);
								MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code))
							}
						}
					});

				} else {
					//update
					// var key = bModel.createKey("/BookingProgramSummary", {
					// 	"PROGRAM_UUID": currentProgram.programUUId
					// });
					var key = "/BookingProgramSummary/" + currentProgram.programUUId + "/BookingProgram.bookingProgramUpdate";
					//var key =key+"/BookingProgram.bookingProgramUpdate";

					var updateObj = {};
					if (!!currentProgram.summary.dealerToyota) {
						if (!!currentProgram.summary.dealerLexus) {
							updateObj.BRAND = "00";
						} else {
							updateObj.BRAND = "10";
						}
					} else {
						if (!!currentProgram.summary.dealerLexus) {
							updateObj.BRAND = "20";
						} else {
							updateObj.BRAND = "99";
						}
					}
					updateObj.PROGRAM_UUID = currentProgram.programUUId;
					updateObj.PROGRAM_ID = currentProgram.programId;
					updateObj.DEPART = currentProgram.summary.department;
					// updateObj.OPEN_DATE = formatter.getESTDateNoDST(currentProgram.summary.bWindowOpen);
					// updateObj.CLOSE_DATE = formatter.getESTDateNoDST(currentProgram.summary.bWindowClose);
					// updateObj.DELIVERY_FR = formatter.getESTDateNoDST(currentProgram.summary.deliveryFrom);
					// updateObj.DELIVERY_TO = formatter.getESTDateNoDST(currentProgram.summary.deliveryTO);
					updateObj.OPEN_DATE = currentProgram.summary.bWindowOpen;
					updateObj.CLOSE_DATE = currentProgram.summary.bWindowClose;
					updateObj.DELIVERY_FR = currentProgram.summary.deliveryFrom;
					updateObj.DELIVERY_TO = currentProgram.summary.deliveryTO;

					updateObj.INITIAL_WARN = currentProgram.summary.initialWaringDays.toString();
					updateObj.FINAL_WARN = currentProgram.summary.finalWarningDays.toString();
					updateObj.CPROGRAM_UUID = currentProgram.summary.cpprogram.uuid;
					updateObj.STATUS = currentProgram.summary.status;
					updateObj.FR_DESC = currentProgram.summary.frDesc;
					updateObj.EN_DESC = currentProgram.summary.enDesc;
					updateObj.CHANGED_BY = that.getUserId();
					console.log(updateObj);
					//bModel.update(key, updateObj, {
					bModel.callFunction("/bookingProgramUpdate", {
						method: "POST",
						urlParameters: {
							BRAND: updateObj.BRAND,
							PROGRAM_UUID: updateObj.PROGRAM_UUID,
							PROGRAM_ID: updateObj.PROGRAM_ID,
							DEPART: updateObj.DEPART,
							OPEN_DATE: updateObj.OPEN_DATE,
							CLOSE_DATE: updateObj.CLOSE_DATE,
							DELIVERY_FR: updateObj.DELIVERY_FR,
							DELIVERY_TO: updateObj.DELIVERY_TO,
							INITIAL_WARN: updateObj.INITIAL_WARN,
							FINAL_WARN: updateObj.FINAL_WARN,
							CPROGRAM_UUID: updateObj.CPROGRAM_UUID,
							STATUS: updateObj.STATUS,
							FR_DESC: updateObj.FR_DESC,
							EN_DESC: updateObj.EN_DESC,
							CHANGED_BY: updateObj.CHANGED_BY
						},
						success: function (oData, oResponse) {
							that.hasDirtyContent = false;
							currentProgram.summary.dealerOriginToyota = currentProgram.summary.dealerToyota;
							currentProgram.summary.dealerOriginLexus = currentProgram.summary.dealerLexus;
							viewModel.setProperty("/currentProgram", currentProgram);
							MessageBox.success(resourceBundle.getText("Message.saved.confirm"));
						},
						error: function (oError) {
							if (oError.statusCode === "304" || oError.statusCode === 304) {
								MessageBox.warning(resourceBundle.getText("Message.warning.nothingtosave"));
							} else if (oError.statusCode === "556" || oError.statusCode === 556) {
								var code = JSON.parse(oError.responseText).error.message.value;
								currentProgram.summary.dealerToyota = currentProgram.summary.dealerOriginToyota;
								currentProgram.summary.dealerLexus = currentProgram.summary.dealerOriginLexus;
								viewModel.setProperty("/currentProgram", currentProgram);
								MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code));
							}
						}
					});
				}
			}
		},
		//----------------------------------------------------------------------------------------------------------STD--		
		// the import functions - new start

		onImportVendor: function (oEven) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), oDialog);
			oDialog.setContentWidth("500px");

			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.setValue("");

			var model = new JSONModel();
			var data = {};
			data.title = resourceBundle.getText("Label.Header.Import.Vendor");
			data.currentTab = "Vendor";
			data.isOk = false;
			data.isProgressing = false;
			data.showBar = false;
			data.progressValue = 0;
			data.progressValueP = "0%";
			data.currentImportitems = [];
			model.setData(data);
			oDialog.setModel(model);
			oDialog.open();
		},

		onImportDeliveryMethod: function (oEven) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), oDialog);
			oDialog.setContentWidth("700px");

			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.setValue("");

			var model = new JSONModel();
			var data = {};
			data.title = resourceBundle.getText("Label.Header.Import.DeliveryMethod");
			data.currentTab = "DeliveryMethod";
			data.isOk = false;
			data.isProgressing = false;
			data.showBar = false;

			data.progressValue = 0;
			data.progressValueP = "0%";

			data.currentImportitems = [];
			model.setData(data);
			oDialog.setModel(model);
			oDialog.open();
		},

		onImportDeliveryLocation: function (oEven) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), oDialog);
			oDialog.setContentWidth("1000px");

			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.setValue("");

			var model = new JSONModel();
			var data = {};
			data.title = resourceBundle.getText("Label.Header.Import.DeliveryLocation");
			data.currentTab = "DeliveryLocation";
			data.isOk = false;
			data.isProgressing = false;
			data.showBar = false;
			data.progressValue = 0;
			data.progressValueP = "0%";
			data.currentImportitems = [];
			model.setData(data);
			oDialog.setModel(model);
			oDialog.open();
		},

		onImportParts: function (oEven) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), oDialog);
			oDialog.setContentWidth("600px");

			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.setValue("");

			var model = new JSONModel();
			var data = {};
			data.title = resourceBundle.getText("Label.Header.Import.Part");
			data.currentTab = "Part";
			data.isOk = false;
			data.isProgressing = false;
			data.showBar = false;
			data.progressValue = 0;
			data.progressValueP = "0%";
			data.currentImportitems = [];
			model.setData(data);
			oDialog.setModel(model);
			oDialog.open();
		},

		onImportPartFitments: function (oEven) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), oDialog);
			oDialog.setContentWidth("500px");

			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.setValue("");

			var model = new JSONModel();
			var data = {};
			data.title = resourceBundle.getText("Label.Header.Import.PartFitment");
			data.currentTab = "PartFitment";
			data.isOk = false;
			data.isProgressing = false;
			data.showBar = false;
			data.progressValue = 0;
			data.progressValueP = "0%";
			data.currentImportitems = [];
			model.setData(data);
			oDialog.setModel(model);
			oDialog.open();

		},

		onImportPriorPurchases: function (oEven) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			jQuery.sap.syncStyleClass("sapUiSizeCompact", that.getView(), oDialog);
			oDialog.setContentWidth("600px");

			var oFileUploader = this.getView().byId("fileUploader");
			oFileUploader.setValue("");

			var model = new JSONModel();
			var data = {};
			data.title = resourceBundle.getText("Label.Header.Import.PriorPurchase");
			data.currentTab = "PriorPurchase";
			data.isOk = false;
			data.isProgressing = false;
			data.showBar = false;
			data.progressValue = 0;
			data.progressValueP = "0%";
			data.currentImportitems = [];
			model.setData(data);
			oDialog.setModel(model);
			oDialog.open();
		},

		getCategoryImportitems: function (sheet) {
			var exLines = [];
			var exLine = {};
			var lines = XLSX.utils.sheet_to_json(sheet, {
				header: ["A", "B"],
				skipHeader: false
			});
			// first line is title
			if (!!lines && lines.length > 1) {
				for (var i = 1; i < lines.length; i++) {
					exLine = {};
					exLine.category = lines[i].A;
					exLine.desc = lines[i].B;
					exLine.status = "PD";
					exLines.push(exLine);
				}
			}
			return exLines;
		},

		getVendorImportitems: function (sheet) {
			var exLines = [];
			var exLine = {};
			var lines = XLSX.utils.sheet_to_json(sheet, {
				// header: ["A", "B", "C"],
				header: ["A", "B"],
				skipHeader: false
			});
			// first line is title
			if (!!lines && lines.length > 1) {
				for (var i = 1; i < lines.length; i++) {
					exLine = {};
					exLine.vendorid = lines[i].A;
					if (!!(lines[i].B) && lines[i].B === "X") {
						exLine.isDistributor = true;
					} else {
						exLine.isDistributor = false;
					}
					// exLine.desc = lines[i].C;
					exLine.status = "PD";
					exLines.push(exLine);
				}
			}
			return exLines;
		},

		getDeliveryMethodImportitems: function (sheet) {
			var exLines = [];
			var exLine = {};
			var lines = XLSX.utils.sheet_to_json(sheet, {
				header: ["A", "B", "C"],
				skipHeader: false
			});
			// first line is title
			if (!!lines && lines.length > 1) {
				for (var i = 1; i < lines.length; i++) {
					exLine = {};
					exLine.category = lines[i].A;
					exLine.vendorid = lines[i].B;
					exLine.delMethod = lines[i].C;

					exLine.status = "PD";
					exLines.push(exLine);
				}
			}
			return exLines;
		},

		getDeliveryLocationImportitems: function (sheet) {
			var exLines = [];
			var exLine = {};
			var lines = XLSX.utils.sheet_to_json(sheet, {
				header: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
				skipHeader: false
			});
			// first line is title
			if (!!lines && lines.length > 1) {
				for (var i = 1; i < lines.length; i++) {
					exLine = {};
					exLine.vendorid = lines[i].A;
					exLine.locationid = lines[i].B;
					exLine.frenchName = lines[i].C;
					exLine.englishName = lines[i].D;
					exLine.address1 = lines[i].E;
					exLine.address2 = lines[i].F;
					exLine.city = lines[i].G;
					exLine.province = lines[i].H;
					exLine.zip = lines[i].I;
					exLine.phone = lines[i].J;

					exLine.status = "PD";
					exLines.push(exLine);
				}
			}
			return exLines;
		},

		getPartImportitems: function (sheet) {
			var exLines = [];
			var exLine = {};
			var lines = XLSX.utils.sheet_to_json(sheet, {
				// header: ["A", "B", "C", "D"],
				header: ["A", "B", "C"],
				skipHeader: false
			});
			// first line is title
			if (!!lines && lines.length > 1) {
				for (var i = 1; i < lines.length; i++) {
					exLine = {};
					exLine.part = lines[i].A;
					exLine.vendorid = lines[i].B;
					//						exLine.desc = lines[i].C;
					exLine.category = lines[i].C;
					exLine.status = "PD";
					exLines.push(exLine);
				}
			}
			return exLines;
		},

		getPartFitmentImportitems: function (sheet) {
			var exLines = [];
			var exLine = {};
			var lines = XLSX.utils.sheet_to_json(sheet, {
				// header: ["A", "B", "C", "D", "E"],
				header: ["A", "B", "C", "D", "E", "F", "G"],
				skipHeader: false
			});
			// first line is title
			if (!!lines && lines.length > 1) {
				for (var i = 1; i < lines.length; i++) {
					exLine = {};
					// exLine.part = lines[i].A;
					// exLine.model = lines[i].B;
					// exLine.modelDesc = lines[i].C;
					// exLine.year = lines[i].D;
					// exLine.brand = lines[i].E;
					exLine.part = lines[i].A;
					exLine.model = lines[i].B;
					exLine.series = lines[i].C;
					exLine.year = lines[i].D;
					exLine.seriesDescEn = lines[i].E;
					exLine.seriesDescFr = lines[i].F;
					exLine.brand = lines[i].G;
					exLine.status = "PD";
					exLines.push(exLine);
				}
			}
			return exLines;
		},

		getPriorPurchaseImportitems: function (sheet) {
			var exLines = [];
			var exLine = {};
			var obj = null;
			var lines = XLSX.utils.sheet_to_json(sheet, {
				// header: ["A", "B", "C", "D", "E", "F"],
				header: ["A", "B", "C"],
				skipHeader: false
			});
			// first line is title
			if (!!lines && lines.length > 1) {
				for (var i = 1; i < lines.length; i++) {
					exLine = {};
					//exLine.dealer = lines[i].A;
					obj = lines[i].A;
					if (!!obj) {
						obj = obj.toString();
						if (obj.length > 5) {
							obj = obj.substring(obj.length - 5);
						} else {
							obj = obj.padStart(5, '0');
						}
						exLine.dealer = obj;
					}
					// exLine.dealerBp = lines[i].B;
					// exLine.dealerDesc = lines[i].C;
					// exLine.part = lines[i].D;
					// exLine.partDesc = lines[i].E;
					// exLine.pp = lines[i].F;
					exLine.part = lines[i].B;
					exLine.pp = lines[i].C;

					exLine.status = "PD";
					exLines.push(exLine);
				}
			}
			return exLines;
		},

		getImportitems: function (tab, sheet) {
			switch (tab) {
				case "Category":
					return this.getCategoryImportitems(sheet);
				case "Vendor":
					return this.getVendorImportitems(sheet);
				case "DeliveryMethod":
					return this.getDeliveryMethodImportitems(sheet);
				case "DeliveryLocation":
					return this.getDeliveryLocationImportitems(sheet);
				case "PriorPurchase":
					return this.getPriorPurchaseImportitems(sheet);
				case "Part":
					return this.getPartImportitems(sheet);
				case "PartFitment":
					return this.getPartFitmentImportitems(sheet);
				default:
					return [];
			}
		},

		handleUploadPress: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oFileUploader = this.getView().byId("fileUploader");
			if (!oFileUploader.getValue()) {
				MessageToast.show(resourceBundle.getText("Message.error.import.nofile"));
				return;
			}

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");
			var currentTab = theModel.getProperty("/currentTab");

			var domRef = oFileUploader.getFocusDomRef();
			var file = domRef.files[0];
			var oUploadB = that.getView().byId("startUpload");
			// Create a File Reader object
			var reader = new FileReader();

			reader.onload = function (e) {
				var binary = "";
				var bytes = new Uint8Array(e.target.result);
				var length = bytes.byteLength;
				for (var i = 0; i < length; i++) {
					binary += String.fromCharCode(bytes[i]);
				}
				var workbook = XLSX.read(binary, {
					type: "binary"
				});

				if (!!workbook && !!workbook.SheetNames && workbook.SheetNames.length > 0) {
					var aSheet = workbook.Sheets[workbook.SheetNames[0]];
					currentImportitems = that.getImportitems(currentTab, aSheet);
					oUploadB.setEnabled(true);

				} else {
					MessageToast.show(resourceBundle.getText("Message.error.import.errorfile"));
					oUploadB.setEnabled(false);
					currentImportitems = [];
				}
				theModel.setProperty("/currentImportitems", currentImportitems);
			};
			reader.onerror = function (ex) {
				oUploadB.setEnabled(false);
				MessageToast.show(resourceBundle.getText("Message.error.import.errorfile"));
				theModel.setProperty("/currentImportitems", []);
			};
			reader.readAsArrayBuffer(file);
		},

		onItemImportDialogStartUpload: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentTab = theModel.getProperty("/currentTab");

			MessageBox.confirm(resourceBundle.getText("Message.confirm.import.data"), {
				onClose: function (sAction) {
					if (sAction === "OK") {
						switch (currentTab) {
							case "Category":
								return that.updateCategories();
							case "Vendor":
								return that.updateVendors();
							case "DeliveryMethod":
								return that.updateDeliveryMethod();
							case "DeliveryLocation":
								return that.updateDeliveryLocation();
							case "PriorPurchase":
								return that.updatePriorPurchase();
							case "PartFitment":
								return that.updatePartFitment();
							case "Part":
								return that.updatePart();
							default:
								return "";
						}
					}
					return "";
				}
			});
		},

		// The order report
		prepareOneVendorReport: function (dataList, vendorId, partsCache, callback) {
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
			callback(dataList, vendorId, partsCache);
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

		processProgramReport: function (programUUId, partsCache, callback) {
			var that = this;
			this.getAllDealersReport(programUUId, function (dataList) {
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
							})
						}
					}
				} else {
					that.prepareProgramReport([], partsCache, callback);
				}

			});
		},

		processOneVendorReport: function (programUUId, vendorId, partsCache, callback) {
			var that = this;
			this.getAllVendororderReport(programUUId, vendorId, function (dataList) {
				// first, make the cache
				var finished = 0;
				if (!!dataList && dataList.length > 0) {
					for (var x = 0; x < dataList.length; x++) {
						if (!!partsCache[dataList[x]]) {
							finished += 1;
							if (finished >= dataList.length) {
								that.prepareOneVendorReport(dataList, vendorId, partsCache, callback);
							}
						} else {
							that.getMaterialBom(dataList[x].PART_NUM, function (iPnum, theBoms) {
								finished += 1;
								partsCache[iPnum] = theBoms;
								if (finished >= dataList.length) {
									that.prepareOneVendorReport(dataList, vendorId, partsCache, callback);
								}
							});
						}
					}
				} else {
					that.prepareOneVendorReport([], vendorId, partsCache, callback);
				}

			});
		},

		onExportOrder: function (oEvent) {
			var that = this;
			sap.ui.core.BusyIndicator.show(0);
			var resourceBundle = this.getResourceBundle();
			// get the table vendor
			var vendorTable = this._vendorTable; //this.byId("iProgramVendorTable");

			var selectedContexts = vendorTable.getSelectedContexts();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var theObject = null;
			var partsCache = {};
			var processedLength = 0;
			var totoalVendors = selectedContexts.length;
			var progatrmId = currentProgram.summary.programId;

			if (!selectedContexts || selectedContexts.length < 1) {
				// MessageBox.warning(resourceBundle.getText("Message.warning.vendor.nokey"));
				// return;
				this.processProgramReport(currentProgram.programUUId, partsCache, processeProgramExportExcel)
			} else {
				theObject = selectedContexts[0].getObject();
				this.processOneVendorReport(currentProgram.programUUId, theObject.key, partsCache, processeTheExportExcel);
			}

			function exportExcel(aModel, vendor) {
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
						name: 'Dealer Order Status',
						template: {
							content: {
								parts: ["STATUS", "B_STATUS"],
								formatter: function (value1, value2) {
									if (!!value1 || !!value2) {
										if (value2 === "AT") {
											return "Confirmed";
										} else {

											var resourceBundle = that.getResourceBundle();
											var resourceName = "";
											switch (value1) {
												case "OP":
													resourceName = "Status.Open";
													break;
												case "CL":
													resourceName = "Status.Closed";
													break;
												case "CP":
													resourceName = "Status.Completed";
													break;
												case "FT":
													resourceName = "Status.Future";
													break;
											}
											return resourceBundle.getText(resourceName);
										}
									} else {
										return "";
									}
								}
							}
						}
					}, {
						name: 'Dealer Code',
						template: {
							content: {
								parts: ["DEALER_CODE", "DEALER_CODE_S"],
								formatter: function (value, value_s) {
									if (!!value_s) {
										return value_s.toString();
									} else {
										if (!!value) {
											return value.toString();
										} else {
											return "";
										}
									}

								}
							}
						}
					}, {
						name: 'Dealer Name',
						template: {
							content: {
								parts: ["DEALER_NAME"],
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
						name: 'Dealer Order Number',
						template: {
							content: {
								parts: ["PROGRAM_ID"],
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
						name: 'Special Instructions',
						template: {
							content: {
								parts: ["SPECIAL_INSTRUCTION"],
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
						name: 'Category Name',
						template: {
							content: {
								parts: ["CATEGORY_DESC"],
								formatter: function (value) {
									if (!!value) {
										return value.toString();
									} else {
										return "";
									}
								}
							}
						}
						// }, {
						// 	name: 'Vendor Code',
						// 	template: {
						// 		content: {
						// 			parts: ["VENDOR_ID"],
						// 			formatter: function (value) {
						// 				return "" + value;
						// 			}
						// 		}
						// 	}
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
						name: 'MAIN PRC Coder',
						template: {
							content: {
								parts: ["CATEGORY_ID"],
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
						name: 'MAIN RRC Desc ',
						template: {
							content: {
								parts: ["CATEGORY_DESC"],
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
						name: 'MAIN Parts Details',
						template: {
							content: {
								parts: ["DETAIL"],
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
						name: 'SUB Part Number 1',
						template: {
							content: {
								parts: ["BOM1"],
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
						name: 'SUB Part Number 2',
						template: {
							content: {
								parts: ["BOM2"],
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
						name: 'SUB Part Number 3',
						template: {
							content: {
								parts: ["BOM3"],
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
						name: 'SUB Part Number 4',
						template: {
							content: {
								parts: ["BOM4"],
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
						name: 'SUB Part Number 5',
						template: {
							content: {
								parts: ["BOM5"],
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
						name: 'Delivery Location ID',
						template: {
							content: {
								parts: ["DEL_LOCATION_ID"],
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
						name: 'Delivery Address 2',
						template: {
							content: {
								parts: ["DEL_ADDRESS2"],
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
								//Code Changed by Devika on 05-01-2024
								formatter: function (value) {
									if (!!value) {
										return value;//.toString();
									} else {
										return "";
									}
								}
								//formatter: formatter.valueDateFormatNow
							}
						}
					}]
				});

				if (!!vendor) {
					oEOExport.saveFile(resourceBundle.getText("Label.Parts.Booking.Order") + " for program " + progatrmId + " vendor " + vendor)
						.catch(
							function (oError) {
								MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
							}).then(function () {
								oEOExport.destroy();
							});

				} else {
					oEOExport.saveFile(resourceBundle.getText("Label.Parts.Booking.Order") + " for program " + progatrmId).catch(function (
						oError) {
						MessageBox.error(resourceBundle.getText("Message.error.export.technical") + oError);
					}).then(function () {
						oEOExport.destroy();
					});

				}

			}

			function processeTheExportExcel(dataList, vendor, fPartsCache) {
				partsCache = fPartsCache;
				processedLength += 1;

				if (processedLength < totoalVendors) {
					theObject = selectedContexts[processedLength].getObject();
					that.processOneVendorReport(currentProgram.programUUId, theObject.key, partsCache, processeTheExportExcel);
				}

				var aModel = new JSONModel();
				aModel.setSizeLimit(2000000);
				aModel.setData(dataList);
				exportExcel(aModel, vendor);
			}

			function processeProgramExportExcel(dataList, fPartsCache) {
				partsCache = fPartsCache;
				processedLength += 1;

				var aModel = new JSONModel();
				aModel.setSizeLimit(2000000);
				aModel.setData(dataList);
				exportExcel(aModel, null);
			}

		},

		// the new method to handle the volumn -- 

		onErrorX: function (oEvent) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var objectKey = oEvent.getSource().getBindingContext().getProperty('OBJECT_KEY');
			var iSource = oEvent.getSource();
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("OBJECT_KEY", sap.ui.model.FilterOperator.EQ, objectKey);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());

			bModel.read("/ObjectMessageSet", {

				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						var messages = [];
						var iObject = null;
						if (!that._oErrorPopover /*Not Null*/) {
							that._oErrorPopover = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.LineErrorPopover", that);
							that.getView().addDependent(that._oErrorPopover);
						}
						for (var i = 0; i < oData.results.length; i++) {
							messages.push(oData.results[i].ERROR_DESC);
						}
						var oModel = new JSONModel();
						var mData = {};

						mData.message = messages.join("<BR/>");
						oModel.setData(mData);
						that._oErrorPopover.setModel(oModel);
						that._oErrorPopover.openBy(iSource)
					} else {
						// DO nothing 
					}
				},
				error: function (err) {
					// DO nothing 
				}
			});
		},

		refreshCounts: function () {

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/BookingProgramCount", {
				"PROGRAM_UUID": currentProgram.programUUId
			});
			bModel.read(dKey, {
				urlParameters: {},
				success: function (iCounts, iResponse) {
					currentProgram.categories.count = iCounts.count_category;
					currentProgram.vendors.count = iCounts.count_vendor;
					currentProgram.deliveryMethods.count = iCounts.count_del_method;
					currentProgram.deliveryLocations.count = iCounts.count_del_location;
					currentProgram.parts.count = iCounts.count_part;
					currentProgram.partfitments.count = iCounts.count_part_fitment;
					currentProgram.priorPurchases.count = iCounts.count_p_purchase;

					// set the counts
					viewModel.setProperty("/currentProgram", currentProgram);
				},
				error: function (err) { }
			});
		},
		//Focus -1

		// category
		toggleCategorySelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;

			if (!!isSelected) {
				this._categoryTable.selectAll();
			} else {
				this._categoryTable.removeSelections(true);
			}
		},

		refreshValidCategoryListCache: function (callback) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			// var categoryModel = this.getCategoryModel();
			var avaValidCategories = [];
			var validKeys = null;
			var aValue = null;
			var aObj = null;

			that.getCategoryModel(function (categoryModel) {
				var validCateKeys = categoryModel.getProperty("/keys");
				var validCateValues = categoryModel.getProperty("/entries");
				that.getValidCategoryList(currentProgram.programUUId, function (cateList) {
					currentProgram.categories.validKeys = [];
					if (!!cateList && cateList.length > 0) {
						for (var i = 0; i < cateList.length; i++) {
							currentProgram.categories.validKeys.push(cateList[i].CATEGORY_ID);
						}
					}
					validKeys = currentProgram.categories.validKeys;

					if (!!validCateKeys && validCateKeys.length > 0) {
						for (var x = 0; x < validCateKeys.length; x++) {
							if (validKeys.indexOf(validCateKeys[x]) < 0) {
								aObj = validCateValues[validCateKeys[x]];
								aValue = {};
								aValue.key = aObj.key;
								if (that.isFrench()) {
									aValue.desc = aObj.frDesc;
								} else {
									aValue.desc = aObj.enDesc;
								}
								avaValidCategories.push(aValue);
							}
						}
					}

					currentProgram.categories.avaItems = avaValidCategories;
					currentProgram.categories.newline[0].key = avaValidCategories[0].key;
					viewModel.setProperty("/currentProgram", currentProgram);
					callback();
				});

			});

		},

		refreshListCategory: function () {
			var oBinding = this._categoryTable.getBinding("items");
			oBinding.refresh();
			this.refreshCounts();
		},

		// Checkbox for DONOTTRANSPORT flag-not to add selected row to json
		toggleCategoryTransferSelect: function (oCheck) {
			// console.log("ocheck", oCheck);
			debugger;

			var that = thisView;
			var viewModel = thisView.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			// var resourceBundle = thisView.getResourceBundle();
			var bModel = thisView.getBookingOdataV2Model();
			var obj = {};
			obj.OBJECT_KEY = bModel.getProperty(oCheck.getSource().getBindingContext().getPath()).OBJECT_KEY;
			obj.PROGRAM_UUID = bModel.getProperty(oCheck.getSource().getBindingContext().getPath()).PROGRAM_UUID;
			obj.CATEGORY_ID = bModel.getProperty(oCheck.getSource().getBindingContext().getPath()).CATEGORY_ID;
			obj.VALID = bModel.getProperty(oCheck.getSource().getBindingContext().getPath()).VALID;
			obj.BATCH_MODE = "";
			obj.ERROR_CODES = "";
			obj.EN_DESC = "";
			obj.FR_DESC = "";

			if (oCheck.getParameter("selected")) {
				obj.DONOTTRANSPORT = "X";
			} else {
				obj.DONOTTRANSPORT = "";
			}

			// console.log("obj", obj);
			that.updateProgramCategoryNew(obj.OBJECT_KEY, obj,
				function (catId, isOK) {
					that.refreshListCategory();
					viewModel.setProperty("/currentProgram", currentProgram);
				});

		},

		loadListCategory: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var categoryObj = viewModel.getProperty("/currentProgram/categories");

			// var key = "/MiniProgramCategoryInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramCategorySet(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";

			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("CATEGORY_DESC", false));
			aSorters.push(new sap.ui.model.Sorter("CATEGORY_ID", false));
			aSorters.push(new sap.ui.model.Sorter("VALID", true));
			// aSorters.push(new sap.ui.model.Sorter("DONOTTRANSPORT", false));

			this._categoryTable.bindItems({
				path: key,
				sorter: aSorters,
				template: this._categoryRowT
			});
			this.refreshCounts();

		},

		handleCategorySorter: function (oEvent) {
			if (!this._oDialogCategories) {
				this._oDialogCategories = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.CategorySorterDialog", this);
				this.getView().addDependent(this._oDialogCategories);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogCategories);
			this._oDialogCategories.open();
		},
		onCategorySortConfirm: function (oEvevnt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var mParams = oEvevnt.getParameters();
			var oBinding = this._categoryTable.getBinding("items");
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
		},

		handleCategoryAdd: function (oEvent) {

			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();
			// var seelctor = this.getView().byId("categorySelector1");
			// var iKey = seelctor.selectedKey();
			//debugger;
			var iKey = currentProgram.categories.newline[0].key;
			if (!!!iKey) {
				MessageBox.warning(resourceBundle.getText("Message.warning.category.nokey"));
				return;
			}
			sap.ui.core.BusyIndicator.show(0);
			var bModel = this.getBookingOdataV2Model();
			var entry = bModel.createEntry("/ProgramCategorySet", {});
			var obj = entry.getObject();
			var descText = "";
			var obj = {};
			// prepare the data set
			obj.PROGRAM_UUID = currentProgram.programUUId;
			obj.VALID = "X";
			obj.CATEGORY_ID = iKey;
			obj.CHANGED_BY = that.getUserId();

			this.getCategoryDetails(iKey, function (theDetail) {
				if (!!theDetail) {
					obj.EN_DESC = theDetail.enDesc;
					obj.FR_DESC = theDetail.frDesc;

					bModel.create("/programCategoryCreate", obj, {
						success: function (oData, oResponse) {
							sap.ui.core.BusyIndicator.hide();
							if (oData.programCategoryCreate.HTTP_STATUS_CODE === "551" || oData.programCategoryCreate.HTTP_STATUS_CODE === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.category.exist", [iKey,
									theDetail.desc
								]));
							} else if (oData.programCategoryCreate.HTTP_STATUS_CODE === "552" || oData.programCategoryCreate.HTTP_STATUS_CODE === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							}
							// if (that.isFrench()) {
							// 	descText = theDetail.frDesc;
							// } else {
							// 	descText = theDetail.enDesc;
							// }
							// currentProgram.categories.items.push({
							// 	selected: false,
							// 	objectKey: oData.OBJECT_KEY,
							// 	key: iKey,
							// 	desc: descText,
							// 	isValid: oData.VALID,
							// 	hasError: false,
							// 	message: "",
							// 	isNew: true
							// });
							//currentProgram.categories.newline[0].key = "";
							// currentProgram.categories.count = currentProgram.categories.items.length;
							//viewModel.setProperty("/currentProgram", currentProgram);
							else {
								that.refreshValidCategoryListCache(function () {
									that.refreshListCategory();
								});
							}
							that.refreshListCategory();

						},
						error: function (oError) {
							sap.ui.core.BusyIndicator.hide();
							if (oError.statusCode === "551" || oError.statusCode === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.category.exist", [iKey,
									theDetail.desc
								]));
							} else if (oError.statusCode === "552" || oError.statusCode === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							}
							that.refreshListCategory();
							// viewModel.setProperty("/currentProgram", currentProgram);
						}
					});

				} else {
					MessageBox.success(resourceBundle.getText("Message.error.category.load"), [iKey]);
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		handleCategoryDelete: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			// var catItems = viewModel.getProperty("/currentProgram/categories/items");
			var selectedItems = this._categoryTable.getSelectedContexts(false);

			var todoList = [];
			var todoList2 = [];
			var deletedList = [];
			var failedList = [];
			var comKey = [];

			if (!!selectedItems && selectedItems.length > 0) {
				for (var x1 = 0; x1 < selectedItems.length; x1++) {
					// if (!!items[x1].selected) {
					comKey = [selectedItems[x1].getProperty("OBJECT_KEY")];
					todoList.push(comKey);
					todoList2.push(comKey);
					// }
				}
			}

			if (!!todoList && todoList.length > 0) {

				var confirmMessage = "";

				if (todoList.length > 1) {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.category", [todoList.length]);
				} else {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.category1", [todoList.length]);
				}
				MessageBox.confirm(confirmMessage, {
					onClose: function (sAction) {
						if (sAction === "OK") {
							sap.ui.core.BusyIndicator.show(0);
							for (var x2 = 0; x2 < todoList.length; x2++) {
								that.deleteProgramCategory(todoList[x2],
									function (catId, isOK) {
										// remove from todo list 
										for (var y1 = 0; y1 < todoList2.length; y1++) {
											if (todoList2[y1] === catId) {
												todoList2.splice(y1, 1);
											}
										}
										if (!!isOK) {
											deletedList.push(catId);
										} else {
											failedList.push(catId);
										}

										// finished 
										if (todoList2.length <= 0) {
											// if (!!deletedList && deletedList.length > 0) {
											// 	for (var y2 = 0; y2 < deletedList.length; y2++) {
											// 		for (var y3 = 0; y3 < catItems.length; y3++) {
											// 			if (catItems[y3].objectKey === deletedList[y2]) {
											// 				catItems.splice(y3, 1);
											// 				break;
											// 			}
											// 		}
											// 	}
											// }
											// viewModel.setProperty("/currentProgram/categories/items", catItems);
											// viewModel.setProperty("/currentProgram/categories/count", catItems.length);

											that.refreshValidCategoryListCache(function () {
												that.refreshListCategory();
												sap.ui.core.BusyIndicator.hide();
												if (!!failedList && failedList.length > 0) {
													//MessageBox.error(resourceBundle.getText("Message.error.delete.failed"));
												} else {
													MessageBox.success(resourceBundle.getText("Message.delete.finished"));
												}

											});
										}
									}
								);
							}

						}
					}
				});
			} else {
				MessageBox.warning(resourceBundle.getText("Message.delete.category.nothing"));
			}
		},

		updateCategories: function () {

			this.onOpenDialog();

			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			// prepare the all the allowed category string array YYH
			var categoryAdded = [];

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");
			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var obj = null;
			var aKey = null;
			var todoCountF = 0;
			var doneCountF = 0;
			var perT = 0;

			var todoCount = 0;
			var doneCount = 0;
			var errorCount = 0;
			var addedKeys = [];
			var errorCodes = [];

			var cateExportList = [];

			//var categoryModel = that.getCategoryModel();

			that.getCategoryModel(function (categoryModel) {
				var categoryAllKey = categoryModel.getProperty("/keys");
				var categoryAllKeyValue = categoryModel.getProperty("/entries");;
				if (!!currentImportitems && currentImportitems.length > 0) {
					todoCount = currentImportitems.length;
					errorCount = 0;
					doneCount = 0;

					todoCountF = todoCount; // the send and receive all count 
					doneCountF = 0;

					// star 
					for (var x2 = 0; x2 < currentImportitems.length; x2++) {
						// initial the validation 
						errorCodes = [];

						aKey = currentImportitems[x2].category;

						obj = {};
						if (!!aKey) {
							obj.categoryId = aKey;
						} else {
							obj.categoryId = "";
						}
						// 						obj.programUuid = currentProgram.programUUId;

						if (categoryAllKey.indexOf(aKey) < 0) {
							errorCodes.push('BP01026');

							obj.enDesc = "";
							obj.frDesc = "";
						} else {
							// found the item
							obj.enDesc = categoryAllKeyValue[aKey].enDesc;
							obj.frDesc = categoryAllKeyValue[aKey].frDesc;
						}

						// check the duplication 
						if (addedKeys.indexOf(aKey) >= 0) {
							errorCodes.push('BP01027');
						} else {
							addedKeys.push(aKey);
						}

						if (errorCodes.length > 0) {
							obj.hasError = true;
							obj.errorCodes = errorCodes.join();
						} else {
							obj.hasError = false;
							obj.errorCodes = errorCodes.join();
						}

						cateExportList.push(obj);

						currentImportitems[x2].status = "UP";
						// update the pogress indicator as well
						doneCountF += 1;
					}
					perT = Math.round(doneCountF * 100 / todoCountF);
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");
					theModel.setProperty("/currentImportitems", currentImportitems);

				}

				var finalData = {};
				finalData.updateList = cateExportList;
				finalData.updatedBy = that.getUserId();
				finalData.programUuid = currentProgram.programUUId;

				that.saveUploadedCategoryList(finalData, function (ok) {
					theModel.setProperty("/currentImportitems", currentImportitems);
					theModel.setProperty("/isOk", true);
					theModel.setProperty("/isProgressing", false);
					that.refreshValidCategoryListCache(function () {
						that.refreshListCategory();
						// sap.ui.core.BusyIndicator.hide();
						that._dialog.close();

					});
				});

			});

		},

		updateCategoriesX: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			// prepare the all the allowed category string array YYH
			var categoryModel = that.getCategoryModel();
			var categoryAllKey = categoryModel.getProperty("/keys");
			var categoryAllKeyValue = categoryModel.getProperty("/entries");;
			var categoryAdded = [];

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");
			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var todoCountF = 0;
			var todoCount = 0;
			var doneCount = 0;
			var doneCountF = 0;
			var errorCount = 0;
			var obj = null;
			var aKey = null;
			var perT = 0;
			var addedKeys = [];
			var errorCodes = [];

			that.deleteProgramCategoryAll(currentProgram.programUUId, function (uuid, isOk) {
				if (!!isOk) {
					if (!!currentImportitems && currentImportitems.length > 0) {
						todoCount = currentImportitems.length;
						doneCount = 0;
						todoCountF = todoCount * 2; // the send and receive all count 
						doneCountF = 0;
						errorCount = 0;

						// star 
						sap.ui.core.BusyIndicator.show(0);
						for (var x2 = 0; x2 < currentImportitems.length; x2++) {
							errorCodes = [];
							obj = {};
							aKey = currentImportitems[x2].category;
							obj.EN_DESC = categoryAllKeyValue[aKey];
							obj.FR_DESC = categoryAllKeyValue[aKey];
							obj.PROGRAM_UUID = currentProgram.programUUId;
							obj.CATEGORY_ID = aKey;
							obj.BATCH_MODE = "X";
							obj.CHANGED_BY = that.getUserId();

							if (categoryAllKey.indexOf(aKey) < 0) {
								errorCodes.push('BP01026');
							}

							if (addedKeys.indexOf(aKey) >= 0) {
								errorCodes.push('BP01027');
							} else {
								addedKeys.push(aKey);
							}
							if (errorCodes.length > 0) {
								obj.VALID = "";
								obj.ERROR_CODES = errorCodes.join();
							} else {
								obj.VALID = "X";
								obj.ERROR_CODES = "";
							}

							// update the pogress indicator as well
							doneCountF += 1;
							perT = Math.round(doneCountF * 100 / todoCountF);
							theModel.setProperty("/progressValue", perT);
							theModel.setProperty("/progressValueP", "" + perT + "%");

							that.createProgramCategory(x2, obj,
								function (index, inObj, isOK) {
									// process controll
									todoCount -= 1;
									doneCount += 1;

									// update the pogress indicator as well
									doneCountF += 1;
									perT = Math.round(doneCountF * 100 / todoCountF);
									theModel.setProperty("/progressValue", perT);
									theModel.setProperty("/progressValueP", "" + perT + "%");

									if (!!isOK) {
										currentImportitems[index].status = "UP";
									} else {
										currentImportitems[index].status = "FD";
										errorCount += 1;
									}
									if (todoCount <= 0) {
										theModel.setProperty("/currentProgram", currentProgram);
										theModel.setProperty("/isOk", true);
										theModel.setProperty("/isProgressing", false);
										that.refreshListCategory();
										sap.ui.core.BusyIndicator.hide();
										//that.loadListCategory();
									}
								});
						}
					}
				}
			});
		},

		// vendor 
		toggleVendorSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;

			if (!!isSelected) {
				this._vendorTable.selectAll();
			} else {
				this._vendorTable.removeSelections(true);
			}
		},

		refreshListVendor: function () {
			var oBinding = this._vendorTable.getBinding("items");
			oBinding.refresh();
			this.refreshCounts();
		},

		loadListVendor: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var vendorsObj = currentProgram.vendors;

			// var key = "/MiniProgramVendorInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramVendorSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";

			var aSorters = [];
			aSorters.push(new sap.ui.model.Sorter("VENDOR_DESC", false));
			aSorters.push(new sap.ui.model.Sorter("VENDOR_ID", false));
			aSorters.push(new sap.ui.model.Sorter("DISTRIBUTOR", false));
			aSorters.push(new sap.ui.model.Sorter("VALID", true));

			this._vendorTable.bindItems({
				path: key,
				sorter: aSorters,
				template: this._vendorRowT
			});
			this.refreshCounts();
		},

		handleVendorAdd: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();

			var iKey = currentProgram.vendors.newline[0].key;
			if (!!!iKey) {
				MessageBox.warning(resourceBundle.getText("Message.warning.vendor.nokey"));
				return;
			}

			sap.ui.core.BusyIndicator.show(0);
			var bModel = this.getBookingOdataV2Model();
			var entry = bModel.createEntry("/ProgramVendorSet", {});
			var obj = entry.getObject();
			var descText = "";
			var isDistributor = false;
			var obj = {};
			// prepare the data set
			obj.PROGRAM_UUID = currentProgram.programUUId;
			obj.VENDOR_ID = iKey;
			obj.CHANGED_BY = that.getUserId();
			var oItem = currentProgram.vendors.newline[0];
			obj.EN_DESC = oItem.enDesc;
			obj.VALID = "X";
			obj.BATCH_MODE = "";
			obj.FR_DESC = oItem.frDesc;
			isDistributor = !!oItem.isDistributor;
			if (!!oItem.isDistributor) {
				obj.DISTRIBUTOR = "X";
			} else {
				obj.DISTRIBUTOR = "";
			}

			bModel.create("/ProgramVendorSet/" + 0 + "/BookingProgram.programVendorCreate", obj, {
				success: function (oData, oResponse) {
					sap.ui.core.BusyIndicator.hide();
					// if (that.isFrench()) {
					// 	descText = oData.FR_DESC;
					// } else {
					// 	descText = oData.EN_DESC;
					// }
					// currentProgram.vendors.items.push({
					// 	selected: false,
					// 	isNew: true,
					// 	isValid: oData.VALID,
					// 	hasError: false,
					// 	objectKey: oData.OBJECT_KEY,
					// 	key: iKey,
					// 	desc: descText,
					// 	isDistributor: isDistributor
					// });
					if (oData.value.HTTP_STATUS_CODE === "551" || oData.value.HTTP_STATUS_CODE === 551) {
						MessageBox.error(resourceBundle.getText("Message.error.vendor.exist", [iKey,
							oItem.desc
						]));
					} else if (oData.value.HTTP_STATUS_CODE === "552" || oData.value.HTTP_STATUS_CODE === 552) {
						MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
					}
					that.refreshListVendor();
					viewModel.setProperty("/currentProgram", currentProgram);
					currentProgram.vendors.newline[0] = {
						key: "",
						desc: "",
						isDistributor: false,
						enDesc: "",
						frDesc: ""
					};
					// currentProgram.vendors.count = currentProgram.vendors.items.length;
					that.refreshListVendor();
					viewModel.setProperty("/currentProgram", currentProgram);

				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					if (oError.statusCode === "551" || oError.statusCode === 551) {
						MessageBox.error(resourceBundle.getText("Message.error.vendor.exist", [iKey,
							oItem.desc
						]));
					} else if (oError.statusCode === "552" || oError.statusCode === 552) {
						MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
					}
					that.refreshListVendor();
					viewModel.setProperty("/currentProgram", currentProgram);
				}
			});
		},

		handleDelLocSettings: function (oEvent) {
			if (!this._oDialogDelLoc) {
				this._oDialogDelLoc = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.DelLocSorterDialog", this);
				this.getView().addDependent(this._oDialogDelLoc);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogDelLoc);

			function removeDuplicateValues(PropertyName, JSONModel, JSONModelName, Data) {
				var lookup = {};
				var items = Data;
				var ModelArray = [];
				for (var item, i = 0; item = items[i++];) {
					var name = item[PropertyName];
					if (!(name in lookup)) {
						lookup[name] = 1;
						var ModelObj = {};
						ModelObj[PropertyName] = name;
						ModelArray.push(ModelObj);
					}
				}
				JSONModel.setData(ModelArray);
				sap.ui.getCore().getElementById("DeliveryLocationFilterDialogId").setModel(JSONModel, JSONModelName);
			}
			removeDuplicateValues("key", new sap.ui.model.json.JSONModel(), "DeliveryLocationFilterJSON", this.getModel("viewModel").oData.currentProgram
				.deliveryLocations.items);
			removeDuplicateValues("name", new sap.ui.model.json.JSONModel(), "DeliveryLocationIDFilterJSON", this.getModel("viewModel").oData.currentProgram
				.deliveryLocations.items);
			removeDuplicateValues("phone", new sap.ui.model.json.JSONModel(), "DeliverPhoneFilterJSON", this.getModel("viewModel").oData.currentProgram
				.deliveryLocations.items);

			this._oDialogDelLoc.open();
		},
		onDelLocSortConfirm: function (oEvevnt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var mParams = oEvevnt.getParameters();

			var oBinding = this._delLocTable.getBinding("items");
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
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "StartsWith";
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				if (sPath2.indexOf("-") != -1) {
					sPath2 = oItem.getKey().split("-")[0];
					sValue1 = oItem.getKey().split("-")[1];
					sValue2 = oItem.getKey().split("-")[1];
				}

				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);
		},

		handleVendorSettings: function (oEvent) {
			if (!this._oDialogVendors) {
				this._oDialogVendors = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.VendorSorterDialog", this);
				this.getView().addDependent(this._oDialogVendors);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogVendors);
			var bModel = thisView.getBookingOdataV2Model();
			var viewModel = thisView.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var vendorsObj = currentProgram.vendors;
			// var key = "/MiniProgramVendorInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + thisView.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramVendorSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + thisView.getCurrentLanguageKey() +
				"')/Set";
			sap.ui.getCore().getElementById("VendorFilterDialogId").setModel(new sap.ui.model.json.JSONModel());
			bModel.read(key, {
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					JSONModel.setData(oData.results);
					sap.ui.getCore().getElementById("VendorFilterDialogId").setModel(JSONModel, "VendorDetailsJSON");
				}

			});
			this._oDialogVendors.open();
		},
		onVendorSortConfirm: function (oEvevnt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var mParams = oEvevnt.getParameters();
			var oBinding = this._vendorTable.getBinding("items");
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
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "StartsWith";
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				if (sPath2.indexOf("-") != -1) {
					sPath2 = oItem.getKey().split("-")[0];
					sValue1 = oItem.getKey().split("-")[1];
					sValue2 = oItem.getKey().split("-")[1];
				}

				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);

		},

		handleVendorDelete: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			// var items = viewModel.getProperty("/currentProgram/vendors/items");
			var selectedItems = this._vendorTable.getSelectedContexts(false);

			var todoList = [];
			var todoList2 = [];
			var deletedList = [];
			var failedList = [];
			var comKey = [];

			if (!!selectedItems && selectedItems.length > 0) {
				for (var x1 = 0; x1 < selectedItems.length; x1++) {
					// if (!!items[x1].selected) {
					comKey = [selectedItems[x1].getProperty("OBJECT_KEY")];
					todoList.push(comKey);
					todoList2.push(comKey);
					// }
				}
			}

			if (!!todoList && todoList.length > 0) {
				var confirmMessage = "";

				if (todoList.length > 1) {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.vendor", [todoList.length]);
				} else {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.vendor1", [todoList.length]);
				}

				MessageBox.confirm(confirmMessage, {
					onClose: function (sAction) {
						if (sAction === "OK") {
							sap.ui.core.BusyIndicator.show(0);
							for (var x2 = 0; x2 < todoList.length; x2++) {
								that.deleteProgramVendor(todoList[x2],
									function (catId, isOK) {
										// remove from todo list 
										for (var y1 = 0; y1 < todoList2.length; y1++) {
											if (todoList2[y1] === catId) {
												todoList2.splice(y1, 1);
											}
										}
										if (!!isOK) {
											deletedList.push(catId);
										} else {
											failedList.push(catId);
										}

										// finished 
										if (todoList2.length <= 0) {
											// if (!!deletedList && deletedList.length > 0) {
											// 	for (var y2 = 0; y2 < deletedList.length; y2++) {
											// 		for (var y3 = 0; y3 < items.length; y3++) {
											// 			if (items[y3].objectKey === deletedList[y2]) {
											// 				items.splice(y3, 1);
											// 				break;
											// 			}
											// 		}
											// 	}
											// }
											// viewModel.setProperty("/currentProgram/vendors/items", items);
											// viewModel.setProperty("/currentProgram/vendors/count", items.length);
											that.refreshListVendor();
											sap.ui.core.BusyIndicator.hide();
											if (!!failedList && failedList.length > 0) {
												//MessageBox.error(resourceBundle.getText("Message.error.delete.failed"));
											} else {
												MessageBox.success(resourceBundle.getText("Message.delete.finished"));
											}
										}
									}
								);
							}
						}
					}
				});

			} else {
				MessageBox.warning(resourceBundle.getText("Message.delete.nothing"));
			}
		},

		updateVendors: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");
			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var todoCountF = 0;
			var doneCountF = 0;
			var perT = 0;

			var obj = null;
			var aKey = null;
			var addedKeys = [];
			var validKeys = [];
			var vendorEntries = {};
			var isDuplicated = false;
			var objectList = [];
			var errorCode = [];

			// ==================================New logic to populte the busy indicator to screen ==================================Begin- 13384

			// sap.ui.core.BusyIndicator.show(0);

			// 	var that = this;
			// var promise = new Promise(function (resolve, reject) {
			// 	// sap.ui.core.BusyIndicator.show(0);
			// 	that.onOpenDialog();
			// 	setTimeout(function () {

			// 		resolve(that);
			// 	}, 1);

			// });

			// promise.then(function () {

			// 	that._onButtonPressSave1();

			// });

			this.onOpenDialog();

			// ==================================New logic to populte the busy indicator to screen ==================================End 

			if (!!currentImportitems && currentImportitems.length > 0) {
				todoCountF = currentImportitems.length * 2;

				// first step, prepare for the validation, and validate the duplidcated
				for (var x1 = 0; x1 < currentImportitems.length; x1++) {
					isDuplicated = false;
					obj = {};
					if (!!currentImportitems[x1].vendorid) {
						obj.vendorId = currentImportitems[x1].vendorid.toString();
					} else {
						obj.vendorId = "";
					}

					if (addedKeys.indexOf(obj.vendorId) < 0) {
						addedKeys.push(obj.vendorId);
						obj.isDuplicated = false;
					} else {
						obj.isDuplicated = true;
					}

					if (!!currentImportitems[x1].isDistributor) {
						obj.distributor = true;
					} else {
						obj.distributor = false;
					}

					objectList.push(obj);
					currentImportitems[x1].status = "UP";

					doneCountF += 1;

				}
				perT = Math.round(doneCountF * 100 / todoCountF);
				theModel.setProperty("/progressValue", perT);
				theModel.setProperty("/progressValueP", "" + perT + "%");
				theModel.setProperty("/currentImportitems", currentImportitems);

				that.validateVendorList(addedKeys, function (rList) {
					if (!!rList) {
						for (var x2 = 0; x2 < rList.length; x2++) {
							if (rList[x2].Message !== 'X') {
								validKeys.push(rList[x2].Vendor);
								if (rList[x2].Vendor_DescFR == "") {
									vendorEntries[rList[x2].Vendor] = {
										enDesc: rList[x2].Vendor_DescEN,
										frDesc: rList[x2].Vendor_DescEN
									};
								} else {
									vendorEntries[rList[x2].Vendor] = {
										enDesc: rList[x2].Vendor_DescEN,
										frDesc: rList[x2].Vendor_DescFR
									};
								}
							}
						}
					}
					for (var x3 = 0; x3 < objectList.length; x3++) {
						errorCode = [];
						doneCountF += 1;
						if (validKeys.indexOf(objectList[x3].vendorId) < 0) {
							errorCode.push('BP01035');
							objectList[x3].enDesc = "";
							objectList[x3].frDesc = "";
						} else {
							objectList[x3].enDesc = vendorEntries[objectList[x3].vendorId].enDesc;
							objectList[x3].frDesc = vendorEntries[objectList[x3].vendorId].frDesc;
						}
						if (objectList[x3].isDuplicated) {
							errorCode.push('BP01036');
						}
						if (errorCode.length > 0) {
							objectList[x3].hasError = true;
							objectList[x3].errorCodes = errorCode.join();
						} else {
							objectList[x3].hasError = false;
							objectList[x3].errorCodes = '';
						}
					}

					var finalData = {};
					finalData.updateList = objectList;
					finalData.updatedBy = that.getUserId();
					finalData.programUuid = currentProgram.programUUId;

					that.saveUploadedVendorList(finalData, function (ok) {
						perT = Math.round(doneCountF * 100 / todoCountF);
						theModel.setProperty("/progressValue", perT);
						theModel.setProperty("/progressValueP", "" + perT + "%");
						theModel.setProperty("/isOk", true);
						theModel.setProperty("/isProgressing", false);
						that.refreshListVendor();

						// ==================================New logic to populte the busy indicator to screen ==================================Begin- 13384			
						// sap.ui.core.BusyIndicator.hide();

						that._dialog.close();

						// ==================================New logic to populte the busy indicator to screen ==================================End- 13384		

					});

				});
			}
		},

		updateVendorsX: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");
			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var todoCount = 0;
			var obj = null;
			var aKey = null;
			var perT = 0;
			var todoCountF = 0;
			var doneCount = 0;
			var addedKeys = [];

			var isDuplicated = false;

			that.deleteProgramVendorAll(currentProgram.programUUId, function (uuid, isOk) {
				if (!!isOk) {
					if (!!currentImportitems && currentImportitems.length > 0) {
						todoCount = currentImportitems.length;
						todoCountF = currentImportitems.length;

						// sap.ui.core.BusyIndicator.show(0);
						this.onOpenDialog();
						for (var x2 = 0; x2 < currentImportitems.length; x2++) {
							obj = {};
							obj.EN_DESC = currentImportitems[x2].desc;
							obj.FR_DESC = currentImportitems[x2].desc;
							obj.PROGRAM_UUID = currentProgram.programUUId;
							obj.VALID = "";
							obj.VENDOR_ID = currentImportitems[x2].vendorid.toString();
							if (addedKeys.indexOf(obj.VENDOR_ID) < 0) {
								addedKeys.push(obj.VENDOR_ID);
								obj.isDuplicated = false;
							} else {
								obj.isDuplicated = true;
							}

							if (!!currentImportitems[x2].isDistributor) {
								obj.DISTRIBUTOR = "X";
							}
							//obj.CHANGED_BY = that.getUserId();

							that.createProgramVendorInBatch(x2, obj, function (index, inObj, isOK) {
								todoCount -= 1;
								doneCount += 1;
								perT = Math.round(doneCount * 100 / todoCountF);
								theModel.setProperty("/progressValue", perT);
								theModel.setProperty("/progressValueP", "" + perT + "%");

								if (!!isOK) {
									// currentProgram.categories.items = that.insertIfNotThere(indexList[catId], currentProgram.categories.items);
									currentImportitems[index].status = "UP";
								} else {
									currentImportitems[index].status = "FD";
								}
								if (todoCount <= 0) {
									theModel.setProperty("/currentProgram", currentProgram);
									theModel.setProperty("/isOk", true);
									theModel.setProperty("/isProgressing", false);
									that.refreshListVendor();
									// sap.ui.core.BusyIndicator.hide();
									// that.loadListVendor(); //???
									that._dialog.close();
								}
							});
						}
					}
				}
			});
		},

		// delivery method
		toggleDMSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;

			if (!!isSelected) {
				this._deliveryMethodsTable.selectAll();
			} else {
				this._deliveryMethodsTable.removeSelections(true);
			}
		},

		refreshListDeliveryMethods: function () {
			var oBinding = this._deliveryMethodsTable.getBinding("items");
			oBinding.refresh();
			this.refreshCounts();
		},

		loadListDeliveryMethod: function () {
			// will be outdated soon 
			this.loadProgDelMethodListCategory();
			// this.loadProgDelMethodListVendor();

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.deliveryMethods;

			// var key = "/MiniProgramDeliveryMethodInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramDeliveryMethodSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";


			this._deliveryMethodsTable.bindItems({
				path: key,
				template: this._deliveryMethodsRowT
			});
			this.refreshCounts();
			var aSorters = [];

			aSorters.push(new sap.ui.model.Sorter("CATEGORY_DESC", false));
			aSorters.push(new sap.ui.model.Sorter("VENDOR_DESC", false));
			aSorters.push(new sap.ui.model.Sorter("DEL_METHOD_NAME", false));
			var oBinding = this._deliveryMethodsTable.getBinding("items");
			oBinding.sort(aSorters);
		},

		handleDMAdd: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var dmNewLineObj = currentProgram.deliveryMethods.newline[0];
			var resourceBundle = this.getResourceBundle();

			if (!!!dmNewLineObj.dmId || !!!dmNewLineObj.vendorId || !!!dmNewLineObj.categoryId) {
				MessageBox.warning(resourceBundle.getText("Message.warning.deliveryMethods.nokey"));
				return;
			}

			sap.ui.core.BusyIndicator.show(0);

			var bModel = this.getBookingOdataV2Model();
			var entry = bModel.createEntry("/ProgramDeliveryMethodSet", {});
			var obj = entry.getObject();
			var obj = {};
			// prepare the data set
			obj.PROGRAM_UUID = currentProgram.programUUId;
			obj.VALID = "X";
			obj.VENDOR_ID = dmNewLineObj.vendorId;
			obj.CATEGORY_ID = dmNewLineObj.categoryId;
			obj.DEL_METHOD = dmNewLineObj.dmId;
			obj.CHANGED_BY = that.getUserId();

			// will be update if the add is Ok 
			obj.EN_DEL_M_NAME = "NA";
			obj.FR_DEL_M_NAME = "NA";
			obj.EN_VENDOR_DESC = "NA";
			obj.FR_VENDOR_DESC = "NA";
			obj.EN_CATEGORY_DESC = "NA";
			obj.FR_CATEGORY_DESC = "NA";

			sap.ui.core.BusyIndicator.show(0);

			bModel.create("/ProgramDeliveryMethodSet/" + 0 + "/BookingProgram.programDeliveryMethodCreate", obj, {
				success: function (oData, oResponse) {

					that.getProgramDeliveryMethod(oData.value.OBJECT_KEY,
						function (reObj) {
							sap.ui.core.BusyIndicator.hide();

							if (!!reObj) {
								// reObj.isNew = true;
								// reObj.hasError = false;
								// currentProgram.deliveryMethods.items.push(reObj);
								// currentProgram.deliveryMethods.count = currentProgram.deliveryMethods.items.length;
								currentProgram.deliveryMethods.newline[0] = {
									dmId: "",
									dmName: "",
									vendorId: "",
									vendorName: "",
									categoryId: "",
									categoryName: ""
								};
								that.refreshListDeliveryMethods();
								viewModel.setProperty("/currentProgram", currentProgram);
							}
						}
					);
				},
				error: function (oError) {
					sap.ui.core.BusyIndicator.hide();
					if (oError.statusCode === "551" || oError.statusCode === 551) {
						MessageBox.error(resourceBundle.getText("Message.error.delivery.method.exist"));
					} else if (oError.statusCode === "552" || oError.statusCode === 552) {
						MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
					}
					that.refreshListDeliveryMethods();
					//viewModel.setProperty("/currentProgram", currentProgram);
				}
			});
		},

		handleDMDelete: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			// var items = viewModel.getProperty("/currentProgram/deliveryMethods/items");
			var selectedItems = this._deliveryMethodsTable.getSelectedContexts(false);

			var todoList = [];
			var todoList2 = [];
			var deletedList = [];
			var failedList = [];
			var comKey = [];

			if (!!selectedItems && selectedItems.length > 0) {
				for (var x1 = 0; x1 < selectedItems.length; x1++) {
					// if (!!items[x1].selected) {
					comKey = [selectedItems[x1].getProperty("OBJECT_KEY")];
					todoList.push(comKey);
					todoList2.push(comKey);
					// }
				}
			}

			if (!!todoList && todoList.length > 0) {
				var confirmMessage = "";

				if (todoList.length > 1) {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.delmethod", [todoList.length]);
				} else {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.delmethod1", [todoList.length]);
				}

				MessageBox.confirm(confirmMessage, {
					onClose: function (sAction) {
						if (sAction === "OK") {
							sap.ui.core.BusyIndicator.show(0);
							for (var x2 = 0; x2 < todoList.length; x2++) {
								that.deleteProgramDeliveryMethod(todoList[x2],
									function (comIds, isOK) {
										// remove from todo list 
										var lvKeyIds = null;
										for (var y1 = 0; y1 < todoList2.length; y1++) {
											lvKeyIds = todoList2[y1];
											if (lvKeyIds[0] === comIds[0]) {
												todoList2.splice(y1, 1);
											}
										}
										if (!!isOK) {
											deletedList.push(comIds);
										} else {
											failedList.push(comIds);
										}

										// finished 
										if (todoList2.length <= 0) {
											// if (!!deletedList && deletedList.length > 0) {
											// 	for (var y2 = 0; y2 < deletedList.length; y2++) {
											// 		for (var y3 = 0; y3 < items.length; y3++) {
											// 			lvKeyIds = deletedList[y2];

											// 			if ((items[y3].objectKey === lvKeyIds[0])) {
											// 				items.splice(y3, 1);
											// 				break;
											// 			}
											// 		}
											// 	}
											// }
											// viewModel.setProperty("/currentProgram/deliveryMethods/items", items);
											// viewModel.setProperty("/currentProgram/deliveryMethods/count", items.length);
											that.refreshListDeliveryMethods();
											sap.ui.core.BusyIndicator.hide();
											if (!!failedList && failedList.length > 0) {
												MessageBox.error(resourceBundle.getText("Message.error.delete.failed"));
											} else {
												MessageBox.success(resourceBundle.getText("Message.delete.finished"));
											}
										}
									}
								);
							}
						}
					}
				});

			} else {
				MessageBox.warning(resourceBundle.getText("Message.delete.deliveryMethods.nothing"));
			}
		},

		updateDeliveryMethod: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var perT = 0;
			var todoCountF = 0;
			var doneCountF = 0;

			var obj = null;
			var aKey = null;
			var addedKeys = [];
			var objectList = [];
			var errorCodes = [];

			// sap.ui.core.BusyIndicator.show(0);
			this.onOpenDialog();

			if (!!currentImportitems && currentImportitems.length > 0) {
				todoCountF = currentImportitems.length * 2;

				for (var x1 = 0; x1 < currentImportitems.length; x1++) {
					errorCodes = [];
					obj = {};

					if (!!currentImportitems[x1].category) {
						obj.categoryId = currentImportitems[x1].category.toString();
					} else {
						obj.categoryId = "";
					}

					if (!!currentImportitems[x1].vendorid) {
						obj.vendorId = currentImportitems[x1].vendorid.toString();
					} else {
						obj.vendorId = "";
					}

					if (!!currentImportitems[x1].delMethod) {
						obj.delMethod = currentImportitems[x1].delMethod.toString();
					} else {
						obj.delMethod = "";
					}

					aKey = obj.categoryId + ':' + obj.vendorId + ':' + obj.delMethod;

					if (addedKeys.indexOf(aKey) >= 0) {
						errorCodes.push('BP01054');
					} else {
						addedKeys.push(aKey);
					}

					if (errorCodes.length > 0) {
						obj.hasError = true;
						obj.errorCodes = errorCodes.join();
					} else {
						obj.hasError = false;;
						obj.errorCodes = "";
					}
					objectList.push(obj);
					currentImportitems[x1].status = "UP";
					doneCountF += 1;
				}
				perT = Math.round(doneCountF * 100 / todoCountF);
				theModel.setProperty("/progressValue", perT);
				theModel.setProperty("/progressValueP", "" + perT + "%");
				theModel.setProperty("/currentImportitems", currentImportitems);

				// another 50%
				var finalData = {};
				finalData.updateList = objectList;
				finalData.updatedBy = that.getUserId();
				finalData.programUuid = currentProgram.programUUId;

				that.saveUploadedDeliveryMethodList(finalData, function (ok) {
					perT = 100;;
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");
					theModel.setProperty("/isOk", true);
					theModel.setProperty("/isProgressing", false);
					that.refreshListDeliveryMethods();
					// sap.ui.core.BusyIndicator.hide();
					that._dialog.close();
				});

			}
		},

		updateDeliveryMethodX: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var todoCount = 0;
			var obj = null;
			var aKey = null;
			var perT = 0;
			var todoCountF = 0;
			var doneCount = 0;
			var addedKeys = [];
			var errorCodes = [];

			that.deleteProgramDeliveryMethodAll(currentProgram.programUUId, function (uuid, isOk) {
				if (!!isOk) {
					if (!!currentImportitems && currentImportitems.length > 0) {
						todoCount = currentImportitems.length;
						todoCountF = currentImportitems.length;

						// star 
						sap.ui.core.BusyIndicator.show(0);
						// this.onOpenDialog();
						for (var x2 = 0; x2 < currentImportitems.length; x2++) {
							obj = {};
							obj.PROGRAM_UUID = currentProgram.programUUId;
							obj.CATEGORY_ID = currentImportitems[x2].category;
							obj.VENDOR_ID = currentImportitems[x2].vendorid.toString();
							obj.DEL_METHOD = currentImportitems[x2].delMethod.toString();

							aKey = obj.CATEGORY_ID + ':' + obj.VENDOR_ID + ':' + obj.DEL_METHOD;

							obj.EN_DEL_M_NAME = "";
							obj.FR_DEL_M_NAME = "";
							obj.EN_VENDOR_DESC = "";
							obj.FR_VENDOR_DESC = "";
							obj.EN_CATEGORY_DESC = "";
							obj.FR_CATEGORY_DESC = "";
							obj.BATCH_MODE = "X";
							if (addedKeys.indexOf(aKey) >= 0) {
								errorCodes.push('BP01054');
							} else {
								addedKeys.push(aKey);
							}

							if (errorCodes.length > 0) {
								obj.VALID = "";
								obj.ERROR_CODES = errorCodes.join();
							} else {
								obj.VALID = "X";
								obj.ERROR_CODES = "";
							}

							that.createProgramDeliveryMethod(x2, obj,
								function (index, inObj, isOK) {
									todoCount -= 1;
									doneCount += 1;
									perT = Math.round(doneCount * 100 / todoCountF);
									theModel.setProperty("/progressValue", perT);
									theModel.setProperty("/progressValueP", "" + perT + "%");

									if (!!isOK) {
										currentImportitems[index].status = "UP";
									} else {
										currentImportitems[index].status = "FD";
									}
									if (todoCount <= 0) {
										theModel.setProperty("/currentProgram", currentProgram);
										theModel.setProperty("/isOk", true);
										theModel.setProperty("/isProgressing", false);
										that.refreshListDeliveryMethods();
										sap.ui.core.BusyIndicator.hide();
										// that._dialog.close();
										// that.loadListDeliveryMethod();
									}
								});
						}
					}
				}
			});
		},

		// parts
		togglePartsSelect: function (oEvent) {
			var isSelected = oEvent.getParameters("Selected").selected;

			if (!!isSelected) {
				this._partsTable.selectAll();
			} else {
				this._partsTable.removeSelections(true);
			}
		},

		refreshListParts: function () {
			/*var oBinding = this._partsTable.getBinding("items");
			oBinding.refresh();
			*/
			this.loadListParts()
			this.refreshCounts();
		},

		loadListParts: function () {
			// console.log("calling load list part 1");
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.parts;
			var bModel = this.getBookingOdataV2Model();
			this.nextPartsBtn.setEnabled(true);
			this.prevPartsBtn.setEnabled(false);
			this.getListCategory(currentProgram.programUUId, true, function (rItems) {
				if (!!rItems && rItems.length > 0) {
					theObj.categoryList = rItems;
				} else {
					theObj.categoryList = [];
				}
				theObj.categoryList.unshift({
					key: "",
					enDesc: "",
					frDesc: "",
					isDistributor: false,
					desc: ""
				});

				viewModel.setProperty("/currentProgram", currentProgram);
			});

			// var key = "/MiniProgramPartsInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramPartsSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";

			/*	this._partsTable.bindItems({
					path: key,
					template: this._partsRowT
				});
				this.refreshCounts();*/
			this.numParts = 0;
			this.clickParts = 0;
			bModel.read(key, {
				urlParameters: {
					"$skip": this.numParts,
					"$top": 200
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						var JSONModel = new sap.ui.model.json.JSONModel();
						JSONModel.setSizeLimit(1000);
						JSONModel.setData(oData.results);
						thisView._partsTable.bindItems({
							path: "/",
							template: thisView._partsRowT
						});
						thisView._partsTable.setModel(JSONModel);

						thisView.refreshCounts();
						if (currentProgram.parts.count <= 200) {
							thisView.nextPartsBtn.setEnabled(false);
						}

					}

				},
				error: function (err) {

				}
			});

		},
		onNextParts: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			if (this.clickParts < 0) {
				this.clickParts = 0;
				this.clickParts += 1;
			} else {
				this.clickParts += 1;
			}
			this.numParts = this.clickParts * 200;
			this.count1 = currentProgram.parts.count;

			if (this.numParts <= this.count1 && parseInt(this.count1 / this.numParts) == 1 && parseInt(this.count1 % this.numParts) < 200) {
				this.nextPartsBtn.setEnabled(false);
			}
			if (this.numParts >= 200) {
				this.prevPartsBtn.setEnabled(true);

			}
			this.nextDataParts();
		},
		onPreviousParts: function () {

			this.clickParts -= 1;
			if (this.clickParts <= 0) {
				this.numParts = 0;
			} else {
				this.numParts = this.clickParts * 200;
			}
			if (this.numParts < this.count1) {

				this.nextPartsBtn.setEnabled(true);

			}
			if (this.numParts === 0) {

				this.prevPartsBtn.setEnabled(false);

			}

			this.nextDataParts();
		},
		nextDataParts: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.partfitments;

			var bModel = this.getBookingOdataV2Model();
			this.clicks = 0;
			// var key = bModel.createKey("/MiniProgramPartsInput", {
			// 	"ProgramUid": currentProgram.programUUId,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramPartsSet", {
				"ProgramUid": currentProgram.programUUId,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$skip": this.numParts,
			// 		"$top": 200
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					"$skip": this.numParts,
					"$top": 200
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						var JSONModel = new sap.ui.model.json.JSONModel();
						JSONModel.setSizeLimit(1000);
						JSONModel.setData(oData.results);
						thisView._partsTable.bindItems({
							path: "/",
							template: thisView._partsRowT
						});
						thisView._partsTable.setModel(JSONModel);
						thisView.refreshCounts();

					}

				},
				error: function (err) {

				}
			});

		},

		handleAddParts: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var newlineObj = currentProgram.parts.newline[0];
			var resourceBundle = this.getResourceBundle();

			if (!!!newlineObj.partId) {
				MessageBox.error(resourceBundle.getText("Message.error.parts.nokey"));
				return;
			}
			// the xsa 
			var bModel = this.getBookingOdataV2Model();
			var entry = bModel.createEntry("/ProgramPartSet", {});
			var obj = entry.getObject();
			var obj = {};
			/**************CR Booking Program*********/

			var newObj = {},
				vaList = [];
			if (!!newlineObj.vendorId) {
				newObj.Vendor = newlineObj.vendorId.toString();
			} else {
				newObj.Vendor = "";
			}

			if (!!newlineObj.partId) {
				newObj.Material = newlineObj.partId.toString();
			} else {
				newObj.Material = "";
			}

			if (!!newlineObj.categoryId) {
				newObj.Category = newlineObj.categoryId.toString();
			} else {
				newObj.Category = "";
			}

			vaList.push(newObj);

			// prepare the data set
			that.validatePartsList(vaList, function (rList) {
				if (!!rList && rList.length > 0) {

					if (!!rList[0].Tire_Size) {
						obj.TIRESIZE = rList[0].Tire_Size;

					} else {
						obj.TIRESIZE = "";

					}
					if (!!rList[0].LoadRating) {
						obj.LOADRATING = rList[0].LoadRating;

					} else {
						obj.LOADRATING = "";

					}
					if (!!rList[0].SpeedRating) {
						obj.SPEEDRATING = rList[0].SpeedRating;

					} else {
						obj.SPEEDRATING = "";

					}
					if (!!rList[0].DealerNet) {
						obj.DEALERNET = rList[0].DealerNet;

					} else {
						obj.DEALERNET = "";

					}
					/**************CR Booking Program*********/

					obj.PROGRAM_UUID = currentProgram.programUUId;
					obj.VALID = "X";
					obj.VENDOR_ID = newlineObj.vendorId;
					obj.CATEGORY_ID = newlineObj.categoryId;
					obj.PART_NUM = newlineObj.partId;
					obj.DETAIL = newlineObj.details;
					obj.EN_DESC = newlineObj.partDesc;
					obj.FR_DESC = newlineObj.partDesc;
					obj.CHANGED_BY = that.getUserId();
					obj.EN_VENDOR_DESC = "NA";
					obj.FR_VENDOR_DESC = "NA";
					obj.EN_CATEGORY_DESC = "NA";
					obj.FR_CATEGORY_DESC = "NA";

					sap.ui.core.BusyIndicator.show(0);

					bModel.create("/ProgramPartSet/" + 0 + "/BookingProgram.programPartCreate", obj, {
						success: function (oData, oResponse) {
							// get the details from the reload
							if (oData.value.HTTP_STATUS_CODE === "551" || oData.value.HTTP_STATUS_CODE === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.part.exist"));
							} else if (oData.value.HTTP_STATUS_CODE === "552" || oData.value.HTTP_STATUS_CODE === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							} else if (oData.value.HTTP_STATUS_CODE === "553" || oData.value.HTTP_STATUS_CODE === 553) {
								MessageBox.error(resourceBundle.getText("Message.xsdata.error.BP01026"));
							} else if (oData.value.HTTP_STATUS_CODE === "554" || oData.value.HTTP_STATUS_CODE === 554) {
								MessageBox.error(resourceBundle.getText("Message.xsdata.error.BP01035"));
							}
							that.getProgramParts(oData.value.OBJECT_KEY,
								function (reObj) {
									if (!!reObj) {
										// reObj.isNew = true;
										// reObj.hasError = false;
										// currentProgram.parts.items.unshift(reObj);
										// currentProgram.parts.count = currentProgram.parts.items.length;

										// clear the new line. 
										currentProgram.parts.newline[0].selected = false;
										currentProgram.parts.newline[0].isNew = true;

										currentProgram.parts.newline[0] = {
											partId: "",
											partDesc: "",
											vendorId: "",
											details: "",
											vendorName: "",
											categoryId: "",
											categoryName: ""
										};

										viewModel.setProperty("/currentProgram", currentProgram);
									}

									// that.refreshListParts();
									// sap.ui.core.BusyIndicator.hide();

								}
							);
							that.refreshListParts();
							sap.ui.core.BusyIndicator.hide();
						},
						error: function (oError) {
							sap.ui.core.BusyIndicator.hide();

							if (oError.statusCode === "551" || oError.statusCode === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.part.exist"));
							} else if (oError.statusCode === "552" || oError.statusCode === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							} else if (oError.statusCode === "553" || oError.statusCode === 553) {
								MessageBox.error(resourceBundle.getText("Message.xsdata.error.BP01026"));
							} else if (oError.statusCode === "554" || oError.statusCode === 554) {
								MessageBox.error(resourceBundle.getText("Message.xsdata.error.BP01035"));
							}
							that.refreshListParts();
						}
					});
				}
			});
		},

		onPressDelMethodsFilter: function () {
			if (!this._oDialogDelMethod) {
				this._oDialogDelMethod = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.DelMethodsFilterDialog", this);
				this.getView().addDependent(this._oDialogDelMethod);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogDelMethod);

			function removeDuplicateValues(PropertyName, JSONModel, JSONModelName, Data) {
				var lookup = {};
				var items = Data.results;
				var ModelArray = [];
				for (var item, i = 0; item = items[i++];) {
					var name = item[PropertyName];
					if (!(name in lookup)) {
						lookup[name] = 1;
						var ModelObj = {};
						ModelObj[PropertyName] = name;
						ModelArray.push(ModelObj);
					}
				}
				JSONModel.setData(ModelArray);
				sap.ui.getCore().getElementById("delmethodDialogId").setModel(JSONModel, JSONModelName);
			}
			var bModel = thisView.getBookingOdataV2Model();
			var viewModel = thisView.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			// var key = "/MiniProgramDeliveryMethodInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramDeliveryMethodSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";

			sap.ui.getCore().getElementById("delmethodDialogId").setModel(new sap.ui.model.json.JSONModel());
			bModel.read(key, {
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					JSONModel.setData(oData.results);
					removeDuplicateValues("CATEGORY_DESC", new sap.ui.model.json.JSONModel(), "CategoryDescJSON", oData);
					removeDuplicateValues("VENDOR_DESC", new sap.ui.model.json.JSONModel(), "VendorDescJSON", oData);
					removeDuplicateValues("DEL_METHOD_NAME", new sap.ui.model.json.JSONModel(), "DelMethodJSON", oData);

				}

			});

			this._oDialogDelMethod.open();
		},
		onDelMethodsConfirm: function (oEvevnt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var mParams = oEvevnt.getParameters();
			var oBinding = this._deliveryMethodsTable.getBinding("items");
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
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "StartsWith";
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				if (sPath2.indexOf("-") != -1) {
					sPath2 = oItem.getKey().split("-")[0];
					sValue1 = oItem.getKey().split("-")[1];
					sValue2 = oItem.getKey().split("-")[1];
				}

				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);
		},

		onPressPartsFilter: function () {
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.ProgramPartsFilterDialog", this);
				this.getView().addDependent(this._oDialog);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialog);

			function removeDuplicateValues(PropertyName, JSONModel, JSONModelName, Data) {
				var lookup = {};
				var items = Data.results;
				var ModelArray = [];
				for (var item, i = 0; item = items[i++];) {
					var name = item[PropertyName];
					if (!(name in lookup)) {
						lookup[name] = 1;
						var ModelObj = {};
						ModelObj[PropertyName] = name;
						ModelArray.push(ModelObj);
					}
				}
				JSONModel.setData(ModelArray);
				sap.ui.getCore().getElementById("PartsFilterDialogId").setModel(JSONModel, JSONModelName);
			}
			var bModel = thisView.getBookingOdataV2Model();
			var viewModel = thisView.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var vendorsObj = currentProgram.vendors;
			// var key = "/MiniProgramPartsInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + thisView.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramPartsSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + thisView.getCurrentLanguageKey() +
				"')/Set";
			sap.ui.getCore().getElementById("PartsFilterDialogId").setModel(new sap.ui.model.json.JSONModel());
			bModel.read(key, {
				urlParameters: {
					"$skip": this.numParts,
					"$top": 100
				},
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					JSONModel.setData(oData.results);
					removeDuplicateValues("PART_NUM", new sap.ui.model.json.JSONModel(), "PartsDetailsJSON", oData);
					removeDuplicateValues("CATEGORY_ID", new sap.ui.model.json.JSONModel(), "PartsCategoryJSON", oData);
					removeDuplicateValues("VENDOR_ID", new sap.ui.model.json.JSONModel(), "PartsVendorJSON", oData);
				}

			});
			this._oDialog.open();
		},
		onProgramPartsConfirm: function (oEvevnt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var mParams = oEvevnt.getParameters();
			var oBinding = this._partsTable.getBinding("items");
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
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "StartsWith";
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				if (sPath2.indexOf("-") != -1) {
					sPath2 = oItem.getKey().split("-")[0];
					sValue1 = oItem.getText().split("-")[0];
					sValue2 = oItem.getText().split("-")[1];
				}

				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);
			// var aFilters = [];
			// var filter = null;
			// var xFilters = [];

			// var vendorList = [];
			// var partsList = [];
			// var categoryList = currentProgram.parts.categoryList;

			// for (var i1 = 0; i1 < categoryList.length; i1++) {
			// 	filter = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, categoryList[i1].key);
			// 	aFilters.push(filter);
			// }
			// // for (var i2 = 0; i2 < vendorList.length; i2++) {
			// // 	filter = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.Contains, vendorList[i2].key);
			// // 	aFilters.push(filter);
			// // }
			// // for (var i2 = 0; i2 < partsList.length; i2++) {
			// // 	filter = new sap.ui.model.Filter("Parts", sap.ui.model.FilterOperator.Contains, partsList[i2].key);
			// // 	aFilters.push(filter);
			// // }
			// if (aFilters && aFilters.length > 0) {
			// 	filter = new sap.ui.model.Filter(aFilters, false);
			// 	xFilters.push(filter);
			// }

			// // update list binding
			// var binding = this._partsTable.getBinding("items");
			// binding.filter(xFilters, "Application");

		},

		handleDeletePart: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);

			//var items = viewModel.getProperty("/currentProgram/parts/items");
			var selectedItems = this._partsTable.getSelectedContexts(false);

			var todoList = [];
			var todoList2 = [];
			var deletedList = [];
			var failedList = [];
			var comKey = [];

			if (!!selectedItems && selectedItems.length > 0) {
				for (var x1 = 0; x1 < selectedItems.length; x1++) {
					// if (!!items[x1].selected) {
					comKey = [selectedItems[x1].getProperty("OBJECT_KEY")];
					todoList.push(comKey);
					todoList2.push(comKey);
					// }
				}
			}

			if (!!todoList && todoList.length > 0) {

				var confirmMessage = "";

				if (todoList.length > 1) {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.parts", [todoList.length]);
				} else {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.parts1", [todoList.length]);
				}

				MessageBox.confirm(confirmMessage, {
					onClose: function (sAction) {
						if (sAction === "OK") {
							sap.ui.core.BusyIndicator.show(0);

							for (var x2 = 0; x2 < todoList.length; x2++) {
								that.deleteProgramParts(todoList[x2],
									function (comIds, isOK) {
										// remove from todo list 
										var lvKeyIds = null;
										for (var y1 = 0; y1 < todoList2.length; y1++) {
											lvKeyIds = todoList2[y1];
											if ((lvKeyIds[0] === comIds[0])) {
												todoList2.splice(y1, 1);
											}
										}
										if (!!isOK) {
											deletedList.push(comIds);
										} else {
											failedList.push(comIds);
										}

										// finished 
										if (todoList2.length <= 0) {
											// if (!!deletedList && deletedList.length > 0) {
											// 	for (var y2 = 0; y2 < deletedList.length; y2++) {
											// 		for (var y3 = 0; y3 < items.length; y3++) {
											// 			lvKeyIds = deletedList[y2];

											// 			if ((items[y3].objectKey === lvKeyIds[0])) {
											// 				items.splice(y3, 1);
											// 				break;
											// 			}
											// 		}
											// 	}
											// }
											// viewModel.setProperty("/currentProgram/parts/items", items);
											// viewModel.setProperty("/currentProgram/parts/count", items.length);
											that.refreshListParts();
											sap.ui.core.BusyIndicator.hide();
											if (!!failedList && failedList.length > 0) {
												//	MessageBox.error(resourceBundle.getText("Message.error.delete.failed"));
											} else {
												MessageBox.success(resourceBundle.getText("Message.delete.finished"));
											}
										}
									}
								);
							}
						}
					}
				});
			} else {
				MessageBox.warning(resourceBundle.getText("Message.delete.nothing"));
			}
		},

		updatePart: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var resourceBundle = this.getResourceBundle();
			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");
			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var perT = 0;
			var todoCountF = 0;
			var doneCountF = 0;

			var obj = null;
			var vaList = [];
			var aKey = null;
			var addedKeys = [];
			var objectList = [];
			var errorCode = [];

			// sap.ui.core.BusyIndicator.show(0);
			this.onOpenDialog();
			if (!!currentImportitems && currentImportitems.length > 0) {
				todoCountF = currentImportitems.length * 2; // the send and receive all count 
				// prepare for the validation 
				for (var x1 = 0; x1 < currentImportitems.length; x1++) {
					obj = {};
					if (!!currentImportitems[x1].vendorid) {
						obj.Vendor = currentImportitems[x1].vendorid.toString();
					} else {
						obj.Vendor = "";
					}

					if (!!currentImportitems[x1].part) {
						obj.Material = currentImportitems[x1].part.toString();
					} else {
						obj.Material = "";
					}

					if (!!currentImportitems[x1].category) {
						obj.Category = currentImportitems[x1].category.toString();
					} else {
						obj.Category = "";
					}

					vaList.push(obj);
					currentImportitems[x1].status = "UP";
					doneCountF += 1;
				}
				perT = 30;
				theModel.setProperty("/progressValue", perT);
				theModel.setProperty("/progressValueP", "" + perT + "%");
				theModel.setProperty("/currentImportitems", currentImportitems);

				var index = 0;
				var arrayLength = vaList.length;
				var tempArray = [],
					chunk_size = 150;

				for (index = 0; index < arrayLength; index += chunk_size) {
					var myChunk = vaList.slice(index, index + chunk_size);
					tempArray.push(myChunk);
				}

				for (var m = 0; m < tempArray.length; m++) {
					var aList = tempArray[m];
					var incr = 70 / tempArray.length;
					var limit = tempArray.length;
					var count = 0;

					that.validatePartsList(aList, function (rList) {
						if (!rList) {
							MessageBox.alert(resourceBundle.getText("Data.Not.Upload"), {
								icon: MessageBox.Icon.INFORMATION,
								title: "",
								actions: ['OK'],
								onClose: function (oAction) {
									that._dialog.close();
								}

							});
						}
						if (!!rList && rList.length > 0) {
							objectList = [];
							for (var x2 = 0; x2 < rList.length; x2++) {
								errorCode = [];
								obj = {};

								if (!!rList[x2].Material) {
									obj.partId = rList[x2].Material;
								} else {
									obj.partId = "";
								}

								if (!!rList[x2].Category) {
									obj.categoryId = rList[x2].Category.toString().replace("%", "");
								} else {
									obj.categoryId = "";
								}

								if (!!rList[x2].Vendor) {
									obj.vendorId = rList[x2].Vendor;
								} else {
									obj.vendorId = "";
								}

								/**************CR Booking Program*********/
								if (!!rList[x2].Tire_Size) {
									obj.tiresize = rList[x2].Tire_Size;

								} else {
									obj.tiresize = "";

								}
								if (!!rList[x2].LoadRating) {
									obj.loadrating = rList[x2].LoadRating;

								} else {
									obj.loadrating = "";

								}
								if (!!rList[x2].SpeedRating) {
									obj.speedrating = rList[x2].SpeedRating;

								} else {
									obj.speedrating = "";

								}
								if (!!rList[x2].DealerNet) {
									obj.dealernet = rList[x2].DealerNet;

								} else {
									obj.dealernet = "";

								}
								/**************CR Booking Program*********/

								aKey = obj.partId + ':' + obj.categoryId + ':' + obj.vendorId;
								if (addedKeys.indexOf(aKey) < 0) {
									addedKeys.push(aKey);
								} else {
									errorCode.push('BP01046');
								}

								if (rList[x2].Message === 'X') {
									errorCode.push('BP01045');
									obj.enDesc = "";
									obj.frDesc = "";
								} else {
									obj.enDesc = rList[x2].Mat_descEN;
									obj.frDesc = rList[x2].Mat_descFR;
								}
								obj.detail = '';

								if (errorCode.length > 0) {
									obj.hasError = true;
									obj.errorCodes = errorCode.join();
								} else {
									obj.hasError = false;
									obj.errorCodes = "";
								}
								objectList.push(obj);
								doneCountF += 1;
							}

							var finalData = {};
							finalData.updateList = objectList;
							finalData.updatedBy = that.getUserId();
							finalData.programUuid = currentProgram.programUUId;

							that.saveUploadedPartsList(finalData, function (ok) {

								if (ok) {

									perT += incr;
									theModel.setProperty("/progressValue", perT);
									theModel.setProperty("/progressValueP", "" + perT + "%");
									theModel.setProperty("/isOk", true);
									if (perT > 99) {
										theModel.setProperty("/isProgressing", false);
										that.refreshListParts();
										// sap.ui.core.BusyIndicator.hide();
										that._dialog.close();
									}
								} else {
									count++;
									if (count === 1) {
										MessageBox.alert(resourceBundle.getText("Data.Not.Upload"), {
											icon: MessageBox.Icon.INFORMATION,
											title: "",
											actions: ['OK'],
											onClose: function (oAction) {
												that._dialog.close();
											}

										});
									}
								}
							});

						} else {
							// sap.ui.core.BusyIndicator.hide();
							that._dialog.close();
						}
					});
				}
			}
		},

		updatePartX: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");
			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var errorCount = 0;
			var todoCount = 0;
			var obj = null;
			var aKey = null;
			var perT = 0;
			var todoCountF = 0;
			var doneCountF = 0;
			var doneCount = 0;
			var addedKeys = [];

			that.deleteProgramPartsAll(currentProgram.programUUId, function (uuid, isOk) {
				if (!!isOk) {
					if (!!currentImportitems && currentImportitems.length > 0) {
						todoCount = currentImportitems.length;
						doneCount = 0;
						todoCountF = todoCount * 2; // the send and receive all count 
						doneCountF = 0;
						errorCount = 0;
						// star 
						sap.ui.core.BusyIndicator.show(0);
						for (var x2 = 0; x2 < currentImportitems.length; x2++) {
							// theModel.setProperty("/progressValue", perT);
							// theModel.setProperty("/progressValueP", "" + perT + "%");
							obj = {};
							if (!!currentImportitems[x2].part) {
								obj.PART_NUM = currentImportitems[x2].part.toString();
								// update the pogress indicator as well
								doneCountF += 1;
								perT = Math.round(doneCountF * 100 / todoCountF);

							} else {
								doneCount += 1;
								todoCount -= 1;
								doneCountF += 2;
								perT = Math.round(doneCountF * 100 / todoCountF);
								currentImportitems[index].status = "SK";
								continue; // skip the parts , the part can not be empty string or null
							}

							obj.OBJECT_KEY = "";
							obj.PROGRAM_UUID = currentProgram.programUUId;
							obj.VENDOR_ID = currentImportitems[x2].vendorid.toString();
							obj.CATEGORY_ID = currentImportitems[x2].category;
							aKey = obj.PART_NUM + ':' + obj.VENDOR_ID + ':' + obj.CATEGORY_ID;
							if (addedKeys.indexOf(aKey) < 0) {
								addedKeys.push(aKey);
								obj.duplicated = false;
							} else {
								obj.duplicated = true;
							}

							obj.VALID = "";
							// obj.EN_DESC = currentImportitems[x2].desc;
							// obj.FR_DESC = currentImportitems[x2].desc;
							obj.EN_DESC = "";
							obj.FR_DESC = "";
							obj.EN_VENDOR_DESC = "";
							obj.FR_VENDOR_DESC = "";
							obj.EN_CATEGORY_DESC = "";
							obj.FR_CATEGORY_DESC = "";
							obj.DETAIL = ""; //?

							that.createProgramPartsInBatch(x2, obj,
								function (index, inObj, isOK) {
									todoCount -= 1;
									doneCount += 1;
									doneCountF += 1;
									perT = Math.round(doneCountF * 100 / todoCountF);
									theModel.setProperty("/progressValue", perT);
									theModel.setProperty("/progressValueP", "" + perT + "%");

									if (!!isOK) {
										currentImportitems[index].status = "UP";
									} else {
										currentImportitems[index].status = "FD";
										errorCount += 1;
									}
									if (todoCount <= 0) {
										theModel.setProperty("/currentProgram", currentProgram);
										theModel.setProperty("/isOk", true);
										theModel.setProperty("/isProgressing", false);
										that.refreshListParts();
										sap.ui.core.BusyIndicator.hide();
										//that.loadListParts();
									}
								});
						}
					}
				}
			});
		},

		// part fitment 
		togglePartFitmentsSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			if (!!isSelected) {
				this._partFitmentTable.selectAll();
			} else {
				this._partFitmentTable.removeSelections(true);
			}
		},

		refreshListPartFitments: function () {
			this.loadListPartFitments();

		},

		loadListPartFitments: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.partfitments;
			//  load the parts in parallel -- will be out dated 
			// this.getListProgramParts(currentProgram.programUUId, true, function (
			// 	rItems) {
			// 	theObj.partsList = [];

			// 	var item = {
			// 		partId: "",
			// 		partDesc: ""
			// 	};
			// 	theObj.partsList.push(item);
			// 	if (!!rItems && rItems.length > 0) {
			// 		for (var x = 0; x < rItems.length; x++) {
			// 			item = {
			// 				partId: rItems[x].partId,
			// 				partDesc: rItems[x].partDesc
			// 			};
			// 			theObj.partsList.push(item);
			// 		}
			// 	}
			// 	viewModel.setProperty("/currentProgram", currentProgram);
			// });

			/*	var key = "/MiniProgramPartFitmentInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
					"')/Results?$top=100";
		
				this._partFitmentTable.bindItems({
					path: key,
					template: this._partFitmentRowT
				});
				var bModel = thisView.getBookingOdataV2Model();
				this._partFitmentTable.setModel(bModel);
				this._partFitmentTable.getBinding("items").refresh();
				
				
			*/
			this.nextPartFitmentBtn.setEnabled(true);
			this.prevPartFitmentBtn.setEnabled(false);

			var bModel = this.getBookingOdataV2Model();
			this.clickPartFitments = 0;
			// var key = bModel.createKey("/MiniProgramPartFitmentInput", {
			// 	"ProgramUid": currentProgram.programUUId,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramPartFitmentSet", {
				"ProgramUid": currentProgram.programUUId,
				"Language": this.getCurrentLanguageKey()
			});
			this.numPartFitment = 0;
			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$skip": this.numPartFitment,
			// 		"$top": 200
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					"$skip": this.numPartFitment,
					"$top": 200
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						var JSONModel = new sap.ui.model.json.JSONModel();
						JSONModel.setSizeLimit(1000);
						JSONModel.setData(oData.results);
						thisView._partFitmentTable.bindItems({
							path: "/",
							template: thisView._partFitmentRowT
						});
						thisView._partFitmentTable.setModel(JSONModel);

						thisView.refreshCounts();
						if (currentProgram.partfitments.count <= 200) {
							thisView.nextPartFitmentBtn.setEnabled(false);
						}

						var aSorters = [];

						aSorters.push(new sap.ui.model.Sorter("PART_NUM", false));
						aSorters.push(new sap.ui.model.Sorter("MODEL_CODE", false));
						aSorters.push(new sap.ui.model.Sorter("YEAR", false));
						var oBinding = thisView._partFitmentTable.getBinding("items");
						oBinding.sort(aSorters);

					}

				},
				error: function (err) {

				}
			});

		},
		onNextPartFitment: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			if (this.clickPartFitments < 0) {
				this.clickPartFitments = 0;
				this.clickPartFitments += 1;
			} else {
				this.clickPartFitments += 1;
			}
			this.numPartFitment = this.clickPartFitments * 200;
			this.count1 = currentProgram.partfitments.count;

			if (this.numPartFitment <= this.count1 && parseInt(this.count1 / this.numPartFitment) == 1 && parseInt(this.count1 % this.numPartFitment) <
				200) {
				this.nextPartFitmentBtn.setEnabled(false);
			}
			if (this.numPartFitment >= 200) {
				this.prevPartFitmentBtn.setEnabled(true);

			}
			this.nextDataPartFitment();
		},
		onPreviousPartFitment: function () {

			this.clickPartFitments -= 1;
			if (this.clickPartFitments <= 0) {
				this.numPartFitment = 0;
			} else {
				this.numPartFitment = this.clickPartFitments * 200;
			}
			if (this.numPartFitment < this.count1) {

				this.nextPartFitmentBtn.setEnabled(true);

			}
			if (this.numPartFitment === 0) {

				this.prevPartFitmentBtn.setEnabled(false);

			}

			this.nextDataPartFitment();
		},
		nextDataPartFitment: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.partfitments;

			var bModel = this.getBookingOdataV2Model();
			this.clicks = 0;
			// var key = bModel.createKey("/MiniProgramPartFitmentInput", {
			// 	"ProgramUid": currentProgram.programUUId,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramPartFitmentSet", {
				"ProgramUid": currentProgram.programUUId,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$skip": this.numPartFitment,
			// 		"$top": 200
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					"$skip": this.numPartFitment,
					"$top": 200
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						var JSONModel = new sap.ui.model.json.JSONModel();
						JSONModel.setSizeLimit(1000);
						JSONModel.setData(oData.results);
						thisView._partFitmentTable.bindItems({
							path: "/",
							template: thisView._partFitmentRowT
						});
						thisView._partFitmentTable.setModel(JSONModel);

						thisView.refreshCounts();
						var aSorters = [];

						aSorters.push(new sap.ui.model.Sorter("PART_NUM", false));
						aSorters.push(new sap.ui.model.Sorter("MODEL_CODE", false));
						aSorters.push(new sap.ui.model.Sorter("YEAR", false));
						var oBinding = thisView._partFitmentTable.getBinding("items");
						oBinding.refresh();
						oBinding.sort(aSorters);

					}

				},
				error: function (err) {

				}
			});

		},

		handleAddPartFitments: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var newlineObj = currentProgram.partfitments.newline[0];
			var resourceBundle = this.getResourceBundle();

			if (!!!newlineObj.partId) {
				MessageBox.error(resourceBundle.getText("Message.error.parts.nokey"));
				return;
			}

			if (!!!newlineObj.modelCode) {
				MessageBox.error(resourceBundle.getText("Message.error.model.nokey"));
				return;
			}

			if (!!!newlineObj.year) {
				MessageBox.error(resourceBundle.getText("Message.error.year.nokey"));
				return;
			}

			var bModel = this.getBookingOdataV2Model();
			var entry = bModel.createEntry("/ProgramPartFitmentSet", {});
			var obj = entry.getObject();
			var obj = {};
			// prepare the data set
			obj.PROGRAM_UUID = currentProgram.programUUId;
			obj.VALID = "X";
			if (!!newlineObj.brand && newlineObj.brand.toUpperCase() === "LEXUS") {
				obj.BRAND = "20";
			} else {
				obj.BRAND = "10";
			}

			obj.BRAND_NAME = newlineObj.brand;
			obj.MODEL_CODE = newlineObj.modelCode;
			obj.EN_MODEL_DESC = newlineObj.modelDescEn;
			obj.FR_MODEL_DESC = newlineObj.modelDescFr;
			obj.YEAR = newlineObj.year;
			obj.PART_NUM = newlineObj.partId;
			obj.EN_PART_DESC = newlineObj.partDesc;
			obj.FR_PART_DESC = newlineObj.partDesc;
			obj.CHANGED_BY = that.getUserId();
			sap.ui.core.BusyIndicator.show(0);

			that.getModelTCISeries(obj.MODEL_CODE, function (tciSeriesData) {
				if (tciSeriesData !== null) {
					obj.SERIES_CODE = tciSeriesData.ModelSeriesNo;
					obj.EN_SERIES_DESC = tciSeriesData.TCISeriesDescriptionEN;
					obj.FR_SERIES_DESC = tciSeriesData.TCISeriesDescriptionFR;

					bModel.create("/ProgramPartFitmentSet/" + 0 + "/BookingProgram.programPartFitmentCreate", obj, {
						success: function (oData, oResponse) {
							sap.ui.core.BusyIndicator.hide();
							console.log(currentProgram);
							if (!!newlineObj) {
								// newlineObj.isNew = true;
								// newlineObj.hasError = false;
								// currentProgram.partfitments.items.unshift(newlineObj);
								// currentProgram.partfitments.count = currentProgram.partfitments.items.length;

								// clear the new line. 

								currentProgram.partfitments.newline[0].selected = false;
								currentProgram.partfitments.newline[0].isNew = true;
								that.refreshListPartFitments();
								viewModel.setProperty("/currentProgram", currentProgram);
								currentProgram.partfitments.newline[0] = {
									partId: "",
									partDesc: "",
									modelCode: "",
									modelDesc: "",
									modelDescEn: "",
									modelDescFr: "",
									brand: "",
									brandName: "",
									year: ""
								};
							}
						},
						error: function (oError) {
							sap.ui.core.BusyIndicator.hide();
							if (oError.statusCode === "551" || oError.statusCode === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.part.exist"));
							} else if (oError.statusCode === "552" || oError.statusCode === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							}
							that.refreshListPartFitments();
						}
					});
				} else {
					sap.ui.core.BusyIndicator.hide();
				}
			});
		},

		handleDeletePartFitment: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			// var items = viewModel.getProperty("/currentProgram/partfitments/items");
			var selectedItems = this._partFitmentTable.getSelectedContexts(false);

			var todoList = [];
			var todoList2 = [];
			var deletedList = [];
			var failedList = [];
			var comKey = [];

			if (!!selectedItems && selectedItems.length > 0) {
				for (var x1 = 0; x1 < selectedItems.length; x1++) {
					// if (!!items[x1].selected) {
					comKey = [selectedItems[x1].getProperty("OBJECT_KEY")];
					todoList.push(comKey);
					todoList2.push(comKey);
					// }
				}
			}

			if (!!todoList && todoList.length > 0) {

				var confirmMessage = "";

				if (todoList.length > 1) {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.partfitments", [todoList.length]);
				} else {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.partsfitment1", [todoList.length]);
				}

				MessageBox.confirm(confirmMessage, {
					onClose: function (sAction) {
						if (sAction === "OK") {
							sap.ui.core.BusyIndicator.show(0);

							for (var x2 = 0; x2 < todoList.length; x2++) {
								that.deleteProgramPartFitment(todoList[x2],
									function (comIds, isOK) {
										// remove from todo list 
										var lvKeyIds = null;
										for (var y1 = 0; y1 < todoList2.length; y1++) {
											lvKeyIds = todoList2[y1];
											if ((lvKeyIds[0] === comIds[0])) {
												todoList2.splice(y1, 1);
											}
										}
										if (!!isOK) {
											deletedList.push(comIds);
										} else {
											failedList.push(comIds);
										}

										// finished 
										if (todoList2.length <= 0) {
											// if (!!deletedList && deletedList.length > 0) {
											// 	for (var y2 = 0; y2 < deletedList.length; y2++) {
											// 		for (var y3 = 0; y3 < items.length; y3++) {
											// 			lvKeyIds = deletedList[y2];

											// 			if ((items[y3].objectKey === lvKeyIds[0])) {
											// 				items.splice(y3, 1);
											// 				break;
											// 			}
											// 		}
											// 	}
											// }
											// viewModel.setProperty("/currentProgram/partfitments/items", items);
											// viewModel.setProperty("/currentProgram/partfitments/count", items.length);

											that.refreshListPartFitments();
											sap.ui.core.BusyIndicator.hide();
											if (!!failedList && failedList.length > 0) {
												MessageBox.error(resourceBundle.getText("Message.error.delete.failed"));
											} else {
												MessageBox.success(resourceBundle.getText("Message.delete.finished"));
											}
										}
									}
								);
							}

						}
					}
				});
			} else {
				MessageBox.warning(resourceBundle.getText("Message.delete.nothing"));
			}
		},

		updatePartFitment: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var perT = 0;
			var todoCountF = 0;

			var obj = null;
			var aKey = null;
			var aFullKey = null;
			var aModel = null;
			var aYear = null;
			var aPart = null;

			var modelYearKeys = [];
			var modelYearList = [];
			var modelYearIndex = [];
			var addedKeys = [];
			var objectList = [];
			var errorCode = [];

			// sap.ui.core.BusyIndicator.show(0);
			this.onOpenDialog();
			if (!!currentImportitems && currentImportitems.length > 0) {
				todoCountF = currentImportitems.length;

				for (var x1 = 0; x1 < currentImportitems.length; x1++) {
					aModel = currentImportitems[x1].model.toString();
					aYear = currentImportitems[x1].year.toString();
					//	aPart = currentImportitems[x1].part.toString();
					aKey = aModel + ':' + aYear;
					if (modelYearKeys.indexOf(aKey) < 0) {
						modelYearKeys.push(aKey);
						modelYearList.push({
							Model: aModel,
							Year: aYear
							//	Material: aPart

						});
					}
				}

				perT = 20;
				theModel.setProperty("/progressValue", perT);
				theModel.setProperty("/progressValueP", "" + perT + "%");

				this.validateModelYearList(modelYearList, function (rList) {
					perT = 30;
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");
					// prepare the valid model year, 
					modelYearKeys = [];
					for (var x2 = 0; x2 < rList.length; x2++) {
						if (rList[x2].Message !== 'X') { // valid cache 
							obj = {};
							if (!!rList[x2].Model) {
								aModel = rList[x2].Model.toString();
							} else {
								aModel = "";
							}
							obj.modelCode = aModel;

							if (!!rList[x2].Year) {
								aYear = rList[x2].Year.toString();
							} else {
								aYear = "";
							}
							obj.modelYear = aYear;
							if (!!rList[x2].Year) {
								aYear = rList[x2].Year.toString();
							} else {
								aYear = "";
							}
							obj.modelYear = aYear;

							/*if (rList[x2].Brand !== 'LEXUS') {
								obj.brand = '20';
								obj.brandName = 'LEXUS';
							} else {
								obj.brand = '10';
								obj.brandName = 'TOYOTA';
							}*/

							obj.enDesc = rList[x2].MODEL_DESC_EN;
							obj.frDesc = rList[x2].MODEL_DESC_FR;
							if (!obj.frDesc) {
								obj.frDesc = obj.enDesc;
							}
							if (!obj.enDesc) {
								obj.enDesc = obj.frDesc;
							}
							if (!obj.frDesc) {
								obj.frDesc = "";
							}
							if (!obj.enDesc) {
								obj.enDesc = "";
							}

							aKey = aModel + ':' + aYear;
							if (modelYearKeys.indexOf(aKey) < 0) {
								modelYearKeys.push(aKey);
								modelYearIndex[aKey] = obj;
							}
						}
					}
					perT = 50;
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");
					var objectListLength = currentImportitems.length;
					for (var x3 = 0; x3 < currentImportitems.length; x3++) {
						errorCode = [];
						obj = {};
						if (!!currentImportitems[x3].part) {
							obj.partId = currentImportitems[x3].part.toString();
						} else {
							obj.partId = "";
						}

						if (!!currentImportitems[x3].model) {
							obj.modelCode = currentImportitems[x3].model.toString();
						} else {
							obj.modelCode = "";
						}

						if (!!currentImportitems[x3].year) {
							obj.modelYear = currentImportitems[x3].year.toString();
						} else {
							obj.modelYear = "";
						}

						if (!!currentImportitems[x3].series) {
							// obj.seriesCode = currentImportitems[x3].series.toString();
							obj.SERIES_CODE = currentImportitems[x3].series.toString();
						} else {
							// obj.seriesCode = "";
							obj.SERIES_CODE = "";
						}
						if (!!currentImportitems[x3].seriesDescEn) {
							// obj.seriesCode = currentImportitems[x3].series.toString();
							obj.EN_SERIES_DESC = currentImportitems[x3].seriesDescEn.toString();
						} else {
							// obj.seriesCode = "";
							obj.EN_SERIES_DESC = "";
						}
						if (!!currentImportitems[x3].seriesDescFr) {
							// obj.seriesCode = currentImportitems[x3].series.toString();
							obj.FR_SERIES_DESC = currentImportitems[x3].seriesDescFr.toString();
						} else {
							// obj.seriesCode = "";
							obj.FR_SERIES_DESC = "";
						}

						if (!!currentImportitems[x3].brand) {
							var brand = currentImportitems[x3].brand;
							if (brand == 'LEXUS' || brand == '20') {
								obj.brand = '20';

								obj.brandName = 'LEXUS';
							} else {
								obj.brand = '10';

								obj.brandName = 'TOYOTA';
							}
						} else {
							obj.brand = '';
							obj.brandName = '';
						}

						aKey = obj.modelCode + ':' + obj.modelYear;
						if (modelYearKeys.indexOf(aKey) < 0) {
							errorCode.push('BP01071');
							//	obj.brand = "";
							//	obj.brandName = "";
							obj.enDesc = "";
							obj.frDesc = "";
						} else {
							/*obj.brand = modelYearIndex[aKey].brand;
							obj.brandName = modelYearIndex[aKey].brandName;
							*/
							obj.enDesc = modelYearIndex[aKey].enDesc;
							obj.frDesc = modelYearIndex[aKey].frDesc;

						}

						aFullKey = obj.partId + ':' + obj.modelCode + ':' + obj.modelYear;
						if (addedKeys.indexOf(aFullKey) < 0) {
							addedKeys.push(aFullKey);
						} else {
							errorCode.push('BP01074');
						}

						if (errorCode.length > 0) {
							obj.hasError = true;
							obj.errorCodes = errorCode.join();
						} else {
							obj.hasError = false;
							obj.errorCodes = "";
						}

						objectList.push(obj);

					}

					perT = 70;
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");
					theModel.setProperty("/currentImportitems", currentImportitems);
					var resourceBundle = that.getResourceBundle();
					var finalData = {};
					// finalData.updateList = objectList;
					// finalData.updatedBy = that.getUserId();
					// finalData.programUuid = currentProgram.programUUId;

					// that.saveUploadedPartFitmentList(finalData, function (ok) {
					// 	perT = 100;
					// 	theModel.setProperty("/progressValue", perT);
					// 	theModel.setProperty("/progressValueP", "" + perT + "%");
					// 	theModel.setProperty("/isOk", true);
					// 	theModel.setProperty("/isProgressing", false);
					// 	that.refreshListPartFitments();
					// 	// sap.ui.core.BusyIndicator.hide();
					// 	that._dialog.close();
					// });
					var index = 0;
					var arrayLength = objectList.length;
					var tempArray = [],
						chunk_size = 10000;

					for (index = 0; index < arrayLength; index += chunk_size) {
						var myChunk = objectList.slice(index, index + chunk_size);
						tempArray.push(myChunk);
					}
					var incr = 30 / tempArray.length;
					var count = 0;
					for (var m = 0; m < tempArray.length; m++) {
						finalData.updateList = tempArray[m];
						finalData.updatedBy = that.getUserId();
						finalData.programUuid = currentProgram.programUUId;

						that.saveUploadedPartFitmentList(finalData, function (ok) {
							if (ok) {
								perT += incr;
								theModel.setProperty("/progressValue", perT);
								theModel.setProperty("/progressValueP", "" + perT + "%");
								theModel.setProperty("/isOk", true);
								theModel.setProperty("/isProgressing", false);
								if (perT > 99) {
									that.refreshListPartFitments();
									that._dialog.close();
								}
							} else {
								count++;
								if (count === 1) {
									MessageBox.alert(resourceBundle.getText("Data.Not.Upload"), {
										icon: MessageBox.Icon.INFORMATION,
										title: "",
										actions: ['OK'],
										onClose: function (oAction) {
											that._dialog.close();
										}

									});
								}
							}

						});
					}
				});

			}
		},

		/*
		uploadinBatch:function(){
			var finalData = {};
					var List = objectList;
					if(List.length>15000){
						var batchObj = List.length/15000
						console.log(batchObj.length)
						for (var m=0; m<batchObj.length;m++){
							finalData.updateList = batchObj[m];
							finalData.updatedBy = that.getUserId();
							finalData.programUuid = currentProgram.programUUId;
			
							that.saveUploadedPartFitmentList(finalData, function (ok) {
								perT = 100;
								theModel.setProperty("/progressValue", perT);
								theModel.setProperty("/progressValueP", "" + perT + "%");
								theModel.setProperty("/isOk", true);
								theModel.setProperty("/isProgressing", false);
								that.refreshListPartFitments();
								// sap.ui.core.BusyIndicator.hide();
								that._dialog.close();
							});
						}
					}
		}
			
		var index = 0;
		var arrayLength = List.length;
		var tempArray = [], chunk_size = 10000;
		 
		for (index = 0; index < arrayLength; index += chunk_size) {
			myChunk = List.slice(index, index+chunk_size);
			tempArray.push(myChunk);
		}
			
		for (var m=0; m<tempArray.length;m++){
			finalData.updateList = tempArray[m];
			finalData.updatedBy = that.getUserId();
			finalData.programUuid = currentProgram.programUUId;
			
			that.saveUploadedPartFitmentList(finalData, function (ok) {
				perT = 100;
				theModel.setProperty("/progressValue", perT);
				theModel.setProperty("/progressValueP", "" + perT + "%");
				theModel.setProperty("/isOk", true);
				theModel.setProperty("/isProgressing", false);
				that.refreshListPartFitments();
				// sap.ui.core.BusyIndicator.hide();
				that._dialog.close();
			});
		}
		*/

		updatePartFitmentX: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var errorCount = 0;
			var todoCount = 0;
			var obj = null;
			var aKey = null;
			var perT = 0;
			var todoCountF = 0;
			var doneCount = 0;
			var addedKeys = [];
			var isDuplicated = false;

			that.deleteProgramPartFitmentAll(currentProgram.programUUId, function (uuid, isOk) {
				if (!!isOk) {
					if (!!currentImportitems && currentImportitems.length > 0) {
						todoCount = currentImportitems.length;
						todoCountF = currentImportitems.length;
						doneCount = 0;
						errorCount = 0;

						// star 
						sap.ui.core.BusyIndicator.show(0);
						for (var x2 = 0; x2 < currentImportitems.length; x2++) {
							obj = {};
							obj.OBJECT_KEY = "";
							obj.PROGRAM_UUID = currentProgram.programUUId;

							// the part and model can not be empty 
							if (!!!currentImportitems[x2].part || !!!currentImportitems[x2].model) {
								todoCount -= 1;
								doneCount += 1;
								perT = Math.round(doneCount * 100 / todoCountF);
								theModel.setProperty("/progressValue", perT);
								theModel.setProperty("/progressValueP", "" + perT + "%");

								currentImportitems[index].status = "SK";
								continue; // skip the parts , the part can not be empty string or null
							}

							obj.PART_NUM = currentImportitems[x2].part.toString();
							obj.MODEL_CODE = currentImportitems[x2].model.toString();
							obj.YEAR = currentImportitems[x2].year.toString();

							aKey = obj.PART_NUM + ':' + obj.MODEL_CODE + ':' + obj.YEAR;
							if (addedKeys.indexOf(aKey) < 0) {
								addedKeys.push(aKey);
								obj.duplicated = false;
							} else {
								obj.duplicated = true;
							}
							that.createProgramPartFitmentInBatch(x2, obj,
								function (index, inObj, isOK) {
									todoCount -= 1;
									doneCount += 1;
									perT = Math.round(doneCount * 100 / todoCountF);
									theModel.setProperty("/progressValue", perT);
									theModel.setProperty("/progressValueP", "" + perT + "%");

									if (!!isOK) {
										currentImportitems[index].status = "UP";
									} else {
										currentImportitems[index].status = "FD";
										errorCount += 1;
									}
									if (todoCount <= 0) {
										theModel.setProperty("/currentProgram", currentProgram);
										theModel.setProperty("/isOk", true);
										theModel.setProperty("/isProgressing", false);
										that.refreshListPartFitments();
										sap.ui.core.BusyIndicator.hide();
										// that.loadListPartFitments();
									}
								});
						}
					}
				}
			});
		},

		// Prior Purchase 
		togglePriorSelect: function (oEvent) {

			var isSelected = oEvent.getParameters("Selected").selected;
			if (!!isSelected) {
				this._priorPurchasesTable.selectAll();
			} else {
				this._priorPurchasesTable.removeSelections(true);
			}
		},

		refreshListPriorPurchases: function () {
			var oBinding = this._priorPurchasesTable.getBinding("items");
			oBinding.refresh();
			this.refreshCounts();
		},

		loadListPriorPurchases: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var theObj = currentProgram.priorPurchases;

			// this.getListProgramParts(currentProgram.programUUId, true, function (
			// 	rItems) {
			// 	if (!!rItems && rItems.length > 0) {
			// 		theObj.allowedParts = rItems;
			// 	} else {
			// 		theObj.allowedParts = [];
			// 	}

			// 	theObj.allowedParts.unshift({
			// 		selected: false,
			// 		vendorId: "",
			// 		categoryId: "",
			// 		partId: "",
			// 		partDesc: "",
			// 		vendorName: "",
			// 		categoryName: ""
			// 	});

			// 	viewModel.setProperty("/currentProgram", currentProgram);
			// });

			// var key = "/MiniProgramPriorPurchaseInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramPriorPurchaseSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";


			this._priorPurchasesTable.bindItems({
				path: key,
				template: this._priorPurchasesRowT
			});
			this.refreshCounts();
			var aSorters = [];

			aSorters.push(new sap.ui.model.Sorter("DEALER_CODE_S", false));
			aSorters.push(new sap.ui.model.Sorter("PART_NUM", false));
			var oBinding = this._priorPurchasesTable.getBinding("items");
			var oBinding1 = this._priorPurchasesTable.getBinding("items");
			oBinding.sort(aSorters);
			oBinding1.sort(aSorters);
		},

		handlePriorPurAdd: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			var newlineObj = currentProgram.priorPurchases.newline[0];
			var resourceBundle = this.getResourceBundle();

			// has to have some key
			if (!!!newlineObj.partId || !!!newlineObj.dealerId) {
				MessageBox.error(resourceBundle.getText("Message.error.parts.nokey"));
				return;
			}

			// the xsa 
			var bModel = this.getBookingOdataV2Model();
			var entry = bModel.createEntry("/ProgramPriorPurchaseSet", {});
			var obj = entry.getObject();
			var obj = {};
			// prepare the data set
			obj.PROGRAM_UUID = currentProgram.programUUId;
			obj.VALID = "X";
			obj.BRAND = currentProgram.summary.division;
			obj.DEALER_CODE = newlineObj.dealerId;
			obj.DEALER_CODE_S = newlineObj.dealerId_s;
			obj.PART_NUM = newlineObj.partId;
			obj.PRIOR_PURCHASES = Number(newlineObj.purchases);
			obj.EN_PART_DESC = newlineObj.partDesc;
			obj.FR_PART_DESC = newlineObj.partDesc;
			obj.EN_DEALER_DESC = newlineObj.dealerName;
			obj.FR_DEALER_DESC = newlineObj.dealerName;
			obj.CHANGED_BY = that.getUserId();

			this.getPartsDetails(newlineObj.partId, function (details) {
				if (!!details) {
					obj.EN_PART_DESC = details.enDesc;
					obj.FR_PART_DESC = details.frDesc;

					sap.ui.core.BusyIndicator.show(0);

					bModel.create("/ProgramPriorPurchaseSet/" + 0 + "/BookingProgram.programPriorPurchaseMiniCreate", obj, {
						success: function (oData, oResponse) {
							// get the details from the reload
							if (oData.value.HTTP_STATUS_CODE === "551" || oData.value.HTTP_STATUS_CODE === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.priorpur.exist"));
							}
							else if (oData.value.HTTP_STATUS_CODE === "552" || oData.value.HTTP_STATUS_CODE === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							}

							that.getProgramPriorPurcahse(oData.value.OBJECT_KEY,
								function (reObj) {
									sap.ui.core.BusyIndicator.hide();
									if (!!reObj) {
										// reObj.isNew = true;
										// reObj.hasError = false;
										// currentProgram.priorPurchases.items.push(reObj);
										// currentProgram.priorPurchases.count = currentProgram.priorPurchases.items.length;

										// clear the inputs

										currentProgram.priorPurchases.newline[0].selected = false;
										currentProgram.priorPurchases.newline[0].isNew = true;

										currentProgram.priorPurchases.newline[0] = {
											programId: "",
											partId: "",
											partDesc: "",
											dealerId: "",
											dealerId_s: "",
											dealerName: "",
											purchases: 0
										};
										that.refreshListPriorPurchases();
										viewModel.setProperty("/currentProgram", currentProgram);
									}
								}

							);
						},
						error: function (oError) {
							sap.ui.core.BusyIndicator.hide();
							if (oError.statusCode === "551" || oError.statusCode === 551) {
								MessageBox.error(resourceBundle.getText("Message.error.priorpur.exist"));
							} else if (oError.statusCode === "552" || oError.statusCode === 552) {
								MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
							}
							that.refreshListPriorPurchases();
						}
					});

				} else {
					MessageBox.error(resourceBundle.getText("Message.error.part.nokey"));
				}
			});
		},

		handlePriorPurDelete: function (oEvent) {

			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			// var items = viewModel.getProperty("/currentProgram/priorPurchases/items");
			var selectedItems = this._priorPurchasesTable.getSelectedContexts(false);
			var todoList = [];
			var todoList2 = [];
			var deletedList = [];
			var failedList = [];
			var comKey = [];

			if (!!selectedItems && selectedItems.length > 0) {
				for (var x1 = 0; x1 < selectedItems.length; x1++) {
					// if (!!items[x1].selected) {
					comKey = [selectedItems[x1].getProperty("OBJECT_KEY")];
					todoList.push(comKey);
					todoList2.push(comKey);
					// }
				}
			}
			if (!!todoList && todoList.length > 0) {
				var confirmMessage = "";

				if (todoList.length > 1) {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.pripur", [todoList.length]);
				} else {
					confirmMessage = resourceBundle.getText("Message.confirmation.delete.pripur1", [todoList.length]);
				}

				MessageBox.confirm(confirmMessage, {
					onClose: function (sAction) {
						if (sAction === "OK") {
							sap.ui.core.BusyIndicator.show(0);

							for (var x2 = 0; x2 < todoList.length; x2++) {
								that.deleteProgramPriorPur(todoList[x2],
									function (comIds, isOK) {
										// remove from todo list 
										var lvKeyIds = null;
										for (var y1 = 0; y1 < todoList2.length; y1++) {
											lvKeyIds = todoList2[y1];
											if ((lvKeyIds[0] === comIds[0])) {
												todoList2.splice(y1, 1);
											}
										}
										if (!!isOK) {
											deletedList.push(comIds);
										} else {
											failedList.push(comIds);
										}

										// finished 
										if (todoList2.length <= 0) {
											// if (!!deletedList && deletedList.length > 0) {
											// 	for (var y2 = 0; y2 < deletedList.length; y2++) {
											// 		for (var y3 = 0; y3 < items.length; y3++) {
											// 			lvKeyIds = deletedList[y2];

											// 			if ((items[y3].objectKey === lvKeyIds[0])) {
											// 				items.splice(y3, 1);
											// 				break;
											// 			}
											// 		}
											// 	}
											// }
											// viewModel.setProperty("/currentProgram/priorPurchases/items", items);
											// viewModel.setProperty("/currentProgram/priorPurchases/count", items.length);
											that.refreshListPriorPurchases();
											sap.ui.core.BusyIndicator.hide();
											if (!!failedList && failedList.length > 0) {
												MessageBox.error(resourceBundle.getText("Message.error.delete.failed"));
											} else {
												MessageBox.success(resourceBundle.getText("Message.delete.finished"));
											}
										}
									}
								);
							}

						}
					}
				});
			} else {
				MessageBox.warning(resourceBundle.getText("Message.delete.nothing"));
			}
		},

		updatePriorPurchase: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var perT = 0;
			var todoCountF = 0;
			var doneCountF = 0;

			var obj = null;
			var aKey = null;
			var addedKeys = [];
			var dealers = [];
			var aDealer = null;
			var aDealerBp = null;
			var validDealerList = [];
			var validDealerIndex = {};
			var errorCode = [];
			var objectList = [];
			// sap.ui.core.BusyIndicator.show(0);
			this.onOpenDialog();
			if (!!currentImportitems && currentImportitems.length > 0) {
				todoCountF = currentImportitems.length * 2;

				for (var x1 = 0; x1 < currentImportitems.length; x1++) {

					aDealer = currentImportitems[x1].dealer;
					if (!!aDealer) {
						aDealer = aDealer.toString();
						if (aDealer.length > 5) {
							aDealer = aDealer.substring(aDealer.length - 5);
						} else {
							aDealer = aDealer.padStart(5, '0');
						}

					}

					if (!!aDealer && dealers.indexOf(aDealer) < 0) {
						dealers.push(aDealer);
					}
				}
				perT = 30;
				theModel.setProperty("/progressValue", perT);
				theModel.setProperty("/progressValueP", "" + perT + "%");

				// validate dealer
				that.validateDealerList(dealers, function (rList) {
					if (!!rList && rList.length > 0) {
						for (var x2 = 0; x2 < rList.length; x2++) {
							if (rList[x2].Message !== 'X' && rList[x2].Status !== 'X' && !!rList[x2].Dealer && !!rList[x2].Searchterm2) {
								// the dealer is valid
								aDealerBp = rList[x2].Dealer;
								aDealer = rList[x2].Searchterm2;
								if (validDealerList.indexOf(aDealer) < 0) {
									validDealerList.push(aDealer);
									validDealerIndex[aDealer] = {
										dealerId: aDealerBp,
										dealerCode: aDealer,
										dealerName: rList[x2].Name
									};
								}
							}
						}
					}

					perT = 50;
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");

					for (var x3 = 0; x3 < currentImportitems.length; x3++) {
						errorCode = [];

						if (!!currentImportitems[x3].dealer) {
							//aDealer = currentImportitems[x3].dealer.toString();
							aDealer = currentImportitems[x3].dealer;
							if (!!aDealer) {
								aDealer = aDealer.toString();
								if (aDealer.length > 5) {
									aDealer = aDealer.substring(aDealer.length - 5);
								} else {
									aDealer = aDealer.padStart(5, '0');
								}

							}

						} else {
							aDealer = "";
						}

						// if (!!aDealer){
						currentImportitems[x3].status = "UP";

						// } else {
						// 	// the dealer can not be empty
						// currentImportitems[index].status = "SK";
						// }
						obj = {};
						if (validDealerList.indexOf(aDealer) < 0) {
							// not valid 
							obj.dealerId = aDealer;
							obj.dealerCode = aDealer;
							obj.enDesc = "";
							obj.frDesc = "";
							errorCode.push('BP01072');
						} else {
							obj.dealerId = validDealerIndex[aDealer].dealerId;
							obj.dealerCode = validDealerIndex[aDealer].dealerCode;
							if (!!validDealerIndex[aDealer].part) {
								obj.enDesc = validDealerIndex[aDealer].part.toString();
							} else {
								obj.enDesc = "";
							}

							obj.frDesc = obj.enDesc;
						}
						obj.purchase = currentImportitems[x3].pp;
						if (!!currentImportitems[x3].part) {
							obj.partId = currentImportitems[x3].part.toString();
						} else {
							obj.partId = "";
						}
						aKey = obj.dealerCode + ':' + obj.partId;
						if (addedKeys.indexOf(aKey) < 0) {
							addedKeys.push(aKey);
						} else {
							errorCode.push('BP01073');
						}
						if (errorCode.length > 0) {
							obj.hasError = true;
							obj.errorCodes = errorCode.join();
						} else {
							obj.hasError = false;
							obj.errorCodes = "";
						}
						objectList.push(obj);
					}
					perT = 70;
					theModel.setProperty("/progressValue", perT);
					theModel.setProperty("/progressValueP", "" + perT + "%");
					theModel.setProperty("/currentImportitems", currentImportitems);

					var finalData = {};
					finalData.updateList = objectList;
					finalData.updatedBy = that.getUserId();
					finalData.programUuid = currentProgram.programUUId;

					that.saveUploadedPriorPurchaseList(finalData, function (ok) {
						perT = 100;
						theModel.setProperty("/progressValue", perT);
						theModel.setProperty("/progressValueP", "" + perT + "%");
						theModel.setProperty("/isOk", true);
						theModel.setProperty("/isProgressing", false);
						that.refreshListPriorPurchases();
						// sap.ui.core.BusyIndicator.hide();
						that._dialog.close();
					});

				});
			}
		},
		//focus -11
		onDeleteAll: function (oEvent) {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var resourceBundle = this.getResourceBundle();

			var currentProgram = viewModel.getProperty("/currentProgram");
			var finalData = {};
			finalData.updatedBy = that.getUserId();
			finalData.programUuid = currentProgram.programUUId;

			var confirmMessage = resourceBundle.getText("Message.confirmation.delete.all");
			MessageBox.confirm(confirmMessage, {
				onClose: function (sAction) {
					var tab = viewModel.getProperty("/selectedTabKey");
					if (sAction === "OK") {
						switch (tab) {
							case "Category":
								that.deleteAllCategoryList(finalData, function (isOk) {
									that.refreshListCategory();
								});
								break;
							case "Vendor":
								that.deleteAllVendorList(finalData, function (isOk) {
									that.refreshListVendor();
								});
								break;
							case "DeliveryMethod":
								that.deleteAllDeliveryMethodList(finalData, function (isOk) {
									that.refreshListDeliveryMethods();
								});
								break;
							case "DeliveryLocation":
								that.deleteAllDeliveryLocationList(finalData, function (isOk) {
									that.loadListDeliveryLocation();
									that.refreshCounts();
								});
								break;
							case "Parts":
								that.deleteAllPartsList(finalData, function (isOk) {
									that.refreshListParts();
								});
								break;
							case "PartFitments":
								that.deleteAllPartFitmentList(finalData, function (isOk) {
									that.refreshListPartFitments();
								});
								break;
							case "PriorPurchases":
								that.deleteAllPriorPurchaseList(finalData, function (isOk) {
									that.refreshListPriorPurchases();
								});
								break;
							default:
								break;
						}
					}
				}
			});
		},

		updatePriorPurchaseX: function () {
			var that = this;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var oDialog = this._get_oItemImportDialog();
			var theModel = oDialog.getModel();
			var currentImportitems = theModel.getProperty("/currentImportitems");

			theModel.setProperty("/isProgressing", true);
			theModel.setProperty("/showBar", true);

			var errorCount = 0;
			var todoCount = 0;
			var obj = null;
			var aKey = null;
			var perT = 0;
			var todoCountF = 0;
			var doneCount = 0;
			var addedKeys = [];
			var isDuplicated = false;

			that.deleteProgramPriorPurAll(currentProgram.programUUId, function (uuid, isOk) {
				if (!!isOk) {
					if (!!currentImportitems && currentImportitems.length > 0) {
						todoCount = currentImportitems.length;
						todoCountF = currentImportitems.length;
						doneCount = 0;
						errorCount = 0;

						// star 
						sap.ui.core.BusyIndicator.show(0);
						for (var x2 = 0; x2 < currentImportitems.length; x2++) {
							obj = {};
							obj.PROGRAM_UUID = currentProgram.programUUId;
							obj.DEALER_CODE_S = currentImportitems[x2].dealer.toString();
							obj.PART_NUM = currentImportitems[x2].part.toString();
							obj.PRIOR_PURCHASES = currentImportitems[x2].pp;

							if (!!!obj.DEALER_CODE_S || !!!obj.PART_NUM) {
								todoCount -= 1;
								doneCount += 1;
								perT = Math.round(doneCount * 100 / todoCountF);
								theModel.setProperty("/progressValue", perT);
								theModel.setProperty("/progressValueP", "" + perT + "%");

								currentImportitems[index].status = "SK";
								continue; // skip the parts , the part can not be empty string or null
							}

							// obj.DEALER_CODE = currentImportitems[x2].dealerBp.toString();
							// obj.EN_DEALER_DESC = currentImportitems[x2].dealerDesc;
							// obj.FR_DEALER_DESC = currentImportitems[x2].dealerDesc;
							// obj.EN_PART_DESC = currentImportitems[x2].partDesc;
							// obj.FR_PART_DESC = currentImportitems[x2].partDesc;
							// obj.VALID = "";
							aKey = obj.DEALER_CODE_S + ':' + obj.PART_NUM;
							if (addedKeys.indexOf(aKey) < 0) {
								addedKeys.push(aKey);
								obj.duplicated = false;
							} else {
								obj.duplicated = true;
							}
							that.createProgramPriorPurInBatch(x2, obj,
								function (index, inObj, isOK) {
									todoCount -= 1;
									doneCount += 1;
									perT = Math.round(doneCount * 100 / todoCountF);
									theModel.setProperty("/progressValue", perT);
									theModel.setProperty("/progressValueP", "" + perT + "%");

									if (!!isOK) {
										currentImportitems[index].status = "UP";
									} else {
										currentImportitems[index].status = "FD";
										errorCount += 1;
									}
									if (todoCount <= 0) {
										theModel.setProperty("/currentProgram", currentProgram);
										theModel.setProperty("/isOk", true);
										theModel.setProperty("/isProgressing", false);
										that.refreshListPriorPurchases();
										sap.ui.core.BusyIndicator.hide();
										// that.loadListPriorPurchases();
									}
								});
						}
					}
				}
			});
		},

		onOpenDialog: function (oEvent) {
			// instantiate dialog
			if (!this._dialog) {

				this._dialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.BusyDialog", this);
				this.getView().addDependent(this._dialog);
			}

			// open dialog
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._dialog);
			this._dialog.open();

		},

		onDialogClosed: function (oEvent) {
			// jQuery.sap.clearDelayedCall(_timeout);
			var resourceBundle = this.getResourceBundle();
			var messageForCancelled = resourceBundle.getText("operationCancelled");
			var messageForCompleted = resourceBundle.getText("operationCompleted");

			if (oEvent.getParameter("cancelPressed")) {
				MessageToast.show(messageForCancelled);
			} else {
				MessageToast.show(messageForCompleted);
			}
		},

		final: function () {

		},
		onToggleVendorAsDistibutor: function (oEvent) {
			var that = this;
			var resourceBundle = this.getResourceBundle();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var bModel = thisView.getBookingOdataV2Model();
			var selectedItems = this._vendorTable.getSelectedContexts(false);
			var obj = {};
			obj.OBJECT_KEY = bModel.getProperty(oEvent.getSource().getBindingContext().getPath()).OBJECT_KEY;
			obj.PROGRAM_UUID = bModel.getProperty(oEvent.getSource().getBindingContext().getPath()).PROGRAM_UUID;
			obj.VENDOR_ID = bModel.getProperty(oEvent.getSource().getBindingContext().getPath()).VENDOR_ID;
			obj.VALID = bModel.getProperty(oEvent.getSource().getBindingContext().getPath()).VALID;
			obj.BATCH_MODE = "";
			obj.ERROR_CODES = "";
			obj.EN_DESC = "";
			obj.FR_DESC = "";

			if (oEvent.getParameter("selected")) {
				obj.DISTRIBUTOR = "X";
			} else {
				obj.DISTRIBUTOR = "";
			}

			var todoList = [];
			todoList.push(obj);

			if (!!todoList && todoList.length > 0) {
				var confirmMessage = "";

				that.updateProgramVendor(todoList,
					function (catId, isOK) {
						// finished 
						if (todoList.length <= 0) {
							that.refreshListVendor();
							viewModel.setProperty("/currentProgram", currentProgram);
						}
					});
			} else {
				//some message here
			}
		},
		handlePartFitmentSettings: function () {
			if (!this._oDialogPartFitment) {
				this._oDialogPartFitment = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.PartFitmentFilterDialog", this);
				this.getView().addDependent(this._oDialogPartFitment);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPartFitment);

			function removeDuplicateValues(PropertyName, JSONModel, JSONModelName, Data) {
				var lookup = {};
				var items = Data.results;
				var ModelArray = [];
				for (var item, i = 0; item = items[i++];) {
					var name = item[PropertyName];
					if (!(name in lookup)) {
						lookup[name] = 1;
						var ModelObj = {};
						ModelObj[PropertyName] = name;
						ModelArray.push(ModelObj);
					}
				}
				JSONModel.setData(ModelArray);
				sap.ui.getCore().getElementById("partFitmentFilterDialogId").setModel(JSONModel, JSONModelName);
			}
			var bModel = thisView.getBookingOdataV2Model();
			var viewModel = thisView.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			// var key = "/MiniProgramPartFitmentInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/Mini(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";
			sap.ui.getCore().getElementById("partFitmentFilterDialogId").setModel(new sap.ui.model.json.JSONModel());
			bModel.read(key, {
				urlParameters: {
					"$skip": this.numPartFitment,
					"$top": 100
				},
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					JSONModel.setData(oData.results);
					removeDuplicateValues("PART_NUM", new sap.ui.model.json.JSONModel(), "PartNumerJSON", oData);
					removeDuplicateValues("MODEL_CODE", new sap.ui.model.json.JSONModel(), "ModelCodeJSON", oData);
					removeDuplicateValues("YEAR", new sap.ui.model.json.JSONModel(), "PartsYearJSON", oData);
					removeDuplicateValues("PART_DESC", new sap.ui.model.json.JSONModel(), "PartsDescJSON", oData);
				},
				error: function (err) {
					// console.log(err);
				}

			});

			this._oDialogPartFitment.open();
		},
		onPartFitmentFilterConfirm: function (oEvevnt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var mParams = oEvevnt.getParameters();
			var oBinding = this._partFitmentTable.getBinding("items");
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
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "StartsWith";
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				if (sPath2.indexOf("-") != -1) {
					sPath2 = oItem.getKey().split("-")[0];
					sValue1 = oItem.getKey().split("-")[1];
					sValue2 = oItem.getKey().split("-")[1];
				}

				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);
		},
		handlePriorPurchaseSettings: function () {
			if (!this._oDialogPriorPurchase) {
				this._oDialogPriorPurchase = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.PriorPurchaseFilterDialog", this);
				this.getView().addDependent(this._oDialogPriorPurchase);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oDialogPriorPurchase);

			function removeDuplicateValues(PropertyName, JSONModel, JSONModelName, Data) {
				var lookup = {};
				var items = Data.results;
				var ModelArray = [];
				for (var item, i = 0; item = items[i++];) {
					var name = item[PropertyName];
					if (!(name in lookup)) {
						lookup[name] = 1;
						var ModelObj = {};
						ModelObj[PropertyName] = name;
						ModelArray.push(ModelObj);
					}
				}
				JSONModel.setData(ModelArray);
				sap.ui.getCore().getElementById("PriorPurchaseDialogId").setModel(JSONModel, JSONModelName);
			}
			var bModel = thisView.getBookingOdataV2Model();
			var viewModel = thisView.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");
			// var key = "/MiniProgramPriorPurchaseInput(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
			// 	"')/Results";
			var key = "/MiniProgramPriorPurchaseSet(ProgramUid='" + currentProgram.programUUId + "',Language='" + this.getCurrentLanguageKey() +
				"')/Set";
			sap.ui.getCore().getElementById("PriorPurchaseDialogId").setModel(new sap.ui.model.json.JSONModel());
			bModel.read(key, {
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					JSONModel.setData(oData.results);
					removeDuplicateValues("DEALER_CODE", new sap.ui.model.json.JSONModel(), "DealerJSON", oData);
					removeDuplicateValues("PART_NUM", new sap.ui.model.json.JSONModel(), "partsJSON", oData);
					removeDuplicateValues("PRIOR_PURCHASES", new sap.ui.model.json.JSONModel(), "PriorPurchaseJSON", oData);

				}

			});

			this._oDialogPriorPurchase.open();
		},
		onPriorPurchaseConfirm: function () {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var currentProgram = viewModel.getProperty("/currentProgram");

			var mParams = oEvevnt.getParameters();
			var oBinding = this.this._priorPurchasesTable.getBinding("items");
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
			var sOperator;
			jQuery.each(mParams.filterItems, function (i, oItem) {
				sOperator = "StartsWith";
				var sPath2 = oItem.getKey();
				var sValue1 = oItem.getText();
				var sValue2 = oItem.getText();
				if (sPath2.indexOf("-") != -1) {
					sPath2 = oItem.getKey().split("-")[0];
					sValue1 = oItem.getKey().split("-")[1];
					sValue2 = oItem.getKey().split("-")[1];
				}

				var oFilter = new Filter(sPath2, sOperator, sValue1, sValue2);
				aFilters.push(oFilter);

			});
			oBinding.filter(aFilters);
		}

	});
});