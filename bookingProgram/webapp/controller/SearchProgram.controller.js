var oView;
sap.ui.define([
	"tci/wave2/ui/bookingProgram/controller/BaseController",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"tci/wave2/ui/bookingProgram/model/formatter",
	"sap/ui/model/Sorter",
	'sap/ui/model/Filter'
], function (BaseController, MessageBox, JSONModel, formatter, Sorter, Filter) {
	"use strict";

	var CONT_PROGRAM_MODEL = "programModel";
	var CONST_VIEW_MODEL = "viewModel";

	return BaseController.extend("tci.wave2.ui.bookingProgram.controller.SearchProgram", {

		formatter: formatter,

		onInit: function () {
			oView = this;
			//start - EST Clock
			this.clockServices();

			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("SearchProgram").attachPatternMatched(this._onObjectMatched, this);

			//message
			var oMessageManager = sap.ui.getCore().getMessageManager();
			this.setModel(oMessageManager.getMessageModel(), "message");
			oMessageManager.registerObject(this.getView(), true);

			// register models
			var appStateModel = this.getAppStateModel();
			appStateModel.setProperty("/tabKey", "PA");
			this.getView().setModel(appStateModel);

			var viewState = this.getDefualtViewState();
			var viewModel = new JSONModel();
			viewModel.setData(viewState);
			this.setModel(viewModel, CONST_VIEW_MODEL);

			//var x = this.getBookingOdataV4Model();

			if (!!!this._list) {
				// object level attributes 			
				this._list = this.byId("idProductsTable");
				this._oRow = this.byId("rowT").clone();
			}
			this._oidSearch = this.byId("oidSearch");
			this.getView().addStyleClass("sapUiSizeCompact");
			//	this.setModel(this.getBookingOdataV2Model(), CONT_PROGRAM_MODEL);

			//	this._init();
			/*Code added to save current progress Of page start*/
			var CurrentStatusData = {
				currentTab: "",
				CurrentSubTab: "Summary",
				pathEncoded: ""
			};
			var currentProgressModel = new JSONModel();
			currentProgressModel.setData(CurrentStatusData);
			sap.ui.getCore().setModel(currentProgressModel, "CurrentProgressModel");
			sap.ui.getCore().getModel("CurrentProgressModel").currentTab = "MP";
			/*Code added to save current progress Of page  end*/
		},

		_init: function () {
			var that = this;
			var resourceBundle = this.getResourceBundle();

			var appStateModel = this.getAppStateModel();
			appStateModel.setProperty('/tabKey', 'PA');

			var viewModel = this.getModel(CONST_VIEW_MODEL);

			this._list.removeSelections();

			// load the security based profile 
			sap.ui.core.BusyIndicator.show(0);
			this.getAppProfile(function (profileModel) {
				sap.ui.core.BusyIndicator.hide();

				if (!!profileModel) {
					var profileModelData = profileModel.getData();
					appStateModel.setProperty("/division", profileModelData.userData.division);

					// check the security, make the screen function accordingly
					if (!!profileModelData.scopes.BookingAdmin) {
						viewModel.setProperty("/readOnly", false);
					}

				} else {
					sap.ui.core.BusyIndicator.hide();
					MessageBox.error(resourceBundle.getText("Message.error.system"));
				}
				// get the default list 
				//	var key = "/ProgramSearchInput(IN_LANG='" + that.getCurrentLanguageKey() + "')/Programs";
				var key = "/ProgramSearchSet(IN_LANG='" + that.getCurrentLanguageKey() + "')/Set"; //Shriram 19-DEC-2023
				var aSorters = [];
				aSorters.push(new sap.ui.model.Sorter("CLOSE_DATE", false));
				// console.log(that.getBookingOdataV2Model());
				that._list.setModel(that.getBookingOdataV2Model());
				that._list.bindItems({
					path: key,
					template: that._oRow,
					sorter: aSorters
				});

				that._list.getBinding("items").attachDataReceived(function (oEvent) { //Hits when the data is received from back-end server
					oEvent.oSource.getModel().sDefaultOperationMode = "Client"; //Set operation mode to Client
					var oSource = oEvent.getSource();
					//oSource.bClientOperation = true; //Set Client Operation to true
					oSource.sOperationMode = "Client"; //Set operation mode to Client

					var oBinding = oView._list.getBindingInfo("items").binding;
					var oSorter = new sap.ui.model.Sorter("STATUS_DESC", true);
					oSorter.fnCompare = function (value1, value2) {
						var val1Mapped = get(value1);
						var val2Mapped = get(value2);
						// console.log(val1Mapped + ' - ' + val2Mapped);
						if (val1Mapped < val2Mapped) return -1;
						if (val1Mapped == val2Mapped) return 0;
						if (val1Mapped > val2Mapped) return 1;
					};
					oBinding.sort(oSorter);
					that._list.refreshItems();
					var aFilters = [];

					//aFilters.push(new sap.ui.model.Filter("STATUS_DESC", sap.ui.model.FilterOperator.EQ, "Future"));
					//aFilters.push(new sap.ui.model.Filter("STATUS_DESC", sap.ui.model.FilterOperator.EQ, "Open"));
					//aFilters.push(new sap.ui.model.Filter("STATUS_DESC", sap.ui.model.FilterOperator.EQ, "Closed"))

					oBinding.filter(aFilters);

				}.bind(this))

			});

		},

		_onObjectMatched: function () {
			this._init();

		},

		getDefualtViewState: function () {
			var viewState = {
				readOnly: true,
				filteredItems: 0,
				filterPanelEnable: true,
				contHigh: "70%",

				currentProgram: {
					status: 0,
					summary: {
						department: "My test",
						enDesc: "English",
						frDesc: "Fr DeSC"
					}
				},
				filters: {
					department: "AAAA",
					status: "AL"
				},
				sortDescending: false,
				sortKey: "TCI_order_no",
				orders: [],
				filterAll: true,
				filterAllx: true
			};

			return viewState;
		},

		updatePageStatus: function () { },

		onItemDetail: function (oEvent) {

			sap.ui.core.BusyIndicator.show(0);
			var model = oEvent.getSource().getModel();
			var path = oEvent.getSource().getSelectedItem().getBindingContext().getPath();
			var pathEncoded = model.getProperty(path).PROGRAM_UUID;
			sap.ui.core.BusyIndicator.hide();

			this.getRouter().navTo("ProgramDetail", {
				encodedKey: pathEncoded
			});
			sap.ui.getCore().getModel("CurrentProgressModel").currentTab = "DP";
			sap.ui.getCore().getModel("CurrentProgressModel").pathEncoded = pathEncoded;
		},

		onReset: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var filters = viewModel.getProperty("/filters");
			filters.department = "AAAA";
			filters.status = "AL";
			viewModel.setProperty("/filters", filters);
			var xStr = this._oidSearch.getValue();
			this.doSearch(xStr, null, null);
		},

		onAdd: function (oEvent) {
			this.getRouter().navTo("ProgramDetail", {
				encodedKey: "NEW"
			});
		},

		onExpandFilter: function (oEvevt) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var togglePanel = viewModel.getProperty("/filterPanelEnable");
			togglePanel = !togglePanel;

			var filterButton = this.byId("filterButton");

			if (togglePanel) {
				filterButton.setIcon("sap-icon://collapse");
				viewModel.setProperty("/contHigh", "70%");
			} else {
				filterButton.setIcon("sap-icon://add-filter");
				viewModel.setProperty("/contHigh", "80%");
			}
			viewModel.setProperty("/filterPanelEnable", togglePanel);
		},

		onUpdateFinished: function (oEvent) {
			var iLenght = oEvent.getSource().getBinding("items").getLength();
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			viewModel.setProperty("/filteredItems", iLenght);

		},

		prepareSearch: function (oEvent) {
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var filters = viewModel.getProperty("/filters");
			var qDepart = null;
			var qStatus = null;
			if (!!filters.department && filters.department !== "AAAA") {
				qDepart = filters.department;
			}
			if (!!filters.status && filters.status !== "AL") {
				qStatus = filters.status;
			}

			var xStr = this._oidSearch.getValue();

			this.doSearch(xStr, qDepart, qStatus);

		},
		onLiveChange: function (oEvent) {
			var query = oEvent.getParameters("newValue").newValue;

			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var filters = viewModel.getProperty("/filters");

			var qDepart = null;
			var qStatus = null;
			if (!!filters.department && filters.department !== "AAAA") {
				qDepart = filters.department;

			}
			if (!!filters.status && filters.status !== "AL") {
				qStatus = filters.status;

			}
			this.doSearch(query, qDepart, qStatus);
		},

		onSearch: function (oEvent) {
			var query = oEvent.getParameters("c").query;
			var viewModel = this.getModel(CONST_VIEW_MODEL);
			var filters = viewModel.getProperty("/filters");
			var qDepart = null;
			var qStatus = null;
			if (!!filters.department && filters.department !== "AAAA") {
				qDepart = filters.department;
			}
			if (!!filters.status && filters.status !== "AL") {
				qStatus = filters.status;
			}

			this.doSearch(query, qDepart, qStatus);
		},

		doSearch: function (qString, qDepart, qStatus) {
			var that = this;
			//	var key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "')/Programs";
			var key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "')/Set";
			var aSorters = [];
			var filters = [];
			aSorters.push(new sap.ui.model.Sorter("PROGRAM_ID", false));
			// console.log("aSorters", aSorters);

			if (!!qString && !!qDepart && !!qStatus) {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_DEPART='" + qDepart + "',IN_STATUS='" + qStatus +
				// 	"',IN_PNUM='" + qString + "')/Programs";
				// key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_DEPART='" + qDepart + "',IN_STATUS='" + qStatus +
				// 	"',IN_PNUM='" + qString + "')/Set";
				filters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.Contains, qStatus));
				filters.push(new sap.ui.model.Filter("DEPART", sap.ui.model.FilterOperator.Contains, qDepart));
				filters.push(new sap.ui.model.Filter("PROGRAM_ID", sap.ui.model.FilterOperator.Contains, qString));
			} else if (!!qString && !!qDepart) {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_DEPART='" + qDepart + "',IN_PNUM='" + qString +
				// 	"')/Programs";
				//key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_DEPART='" + qDepart + "',IN_PNUM='" + qString +
				//	"')/Set";
				filters.push(new sap.ui.model.Filter("DEPART", sap.ui.model.FilterOperator.Contains, qDepart));
				filters.push(new sap.ui.model.Filter("PROGRAM_ID", sap.ui.model.FilterOperator.Contains, qString));
			} else if (!!qString && !!qStatus) {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + qStatus + "',IN_PNUM='" + qString +
				// 	"')/Programs";
				// key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + qStatus + "',IN_PNUM='" + qString +
				// 	"')/Set";
				filters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.Contains, qStatus));
				filters.push(new sap.ui.model.Filter("PROGRAM_ID", sap.ui.model.FilterOperator.Contains, qString));
			} else if (!!qDepart && !!qStatus) {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + qStatus + "',IN_DEPART='" + qDepart +
				// 	"')/Programs";
				// key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + qStatus + "',IN_DEPART='" + qDepart +
				// 	"')/Set";
					filters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.Contains, qStatus));
					filters.push(new sap.ui.model.Filter("DEPART", sap.ui.model.FilterOperator.Contains, qDepart));
			} else if (!!qString) {
				//key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_PNUM='" + qString + "')/Programs";
				//key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "')/Set";
				//+ "',IN_PNUM='" + qString + "')/Set"; //Changed by Devika 30-12
				filters.push(new sap.ui.model.Filter("PROGRAM_ID", sap.ui.model.FilterOperator.Contains, qString));
			} else if (!!qStatus) {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + qStatus + "')/Programs";
				//key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_STATUS='" + qStatus + "')/Set";
				filters.push(new sap.ui.model.Filter("STATUS", sap.ui.model.FilterOperator.Contains, qStatus));
			} else if (!!qDepart) {
				// key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_DEPART='" + qDepart + "')/Programs";
				//key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "',IN_DEPART='" + qDepart + "')/Set";
				filters.push(new sap.ui.model.Filter("DEPART", sap.ui.model.FilterOperator.Contains, qDepart));
			}

			// console.log("key", key);

			// that._list.setModel(that.getBookingOdataV2Model());
			//that._list.unbindItems();

			that._list.bindItems({
				path: key,
				template: that._oRow,
				filters: filters,
				sorter: aSorters
			});
		},

		handleSortDialogConfirm: function (oEvent) {
			var mParams = oEvent.getParameters(),
				oBinding = this._list.getBinding("items"),
				sPath,
				bDescending,
				aSorters = [];

			sPath = mParams.sortItem.getKey();
			bDescending = mParams.sortDescending;
			aSorters.push(new Sorter(sPath, bDescending, false, function (a, b) {
				// console.log("a")
			}));

			// apply the selected sort and group settings
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

		handleSortButtonPressed: function (oEvent) {
			if (!this._oPASortDialog) {
				this._oPASortDialog = sap.ui.xmlfragment("tci.wave2.ui.bookingProgram.view.fragments.PASortDialog", this);
				this.getView().addDependent(this._oPASortDialog);

			}

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
				sap.ui.getCore().getElementById("ProgramFilterDialogId").setModel(JSONModel, JSONModelName);
			}
			jQuery.sap.syncStyleClass("sapUiSizeCompact", this.getView(), this._oPASortDialog);
			var bModel = this.getBookingOdataV2Model();
			// var key = "/ProgramSearchInput(IN_LANG='" + this.getCurrentLanguageKey() + "')/Programs";

			var key = "/ProgramSearchSet(IN_LANG='" + this.getCurrentLanguageKey() + "')/Set";
			sap.ui.getCore().getElementById("ProgramFilterDialogId").setModel(new sap.ui.model.json.JSONModel());
			bModel.read(key, {
				success: function (oData, oResponse) {
					var JSONModel = new sap.ui.model.json.JSONModel();
					JSONModel.setData(oData.results);
					removeDuplicateValues("PROGRAM_ID", new sap.ui.model.json.JSONModel(), "ProgramIDFilterJSON", oData);
					removeDuplicateValues("PROGRAM_DESC", new sap.ui.model.json.JSONModel(), "ProgramDescFilterJSON", oData);
					removeDuplicateValues("DEPART_NAME", new sap.ui.model.json.JSONModel(), "DepartNameFilterJSON", oData)
					removeDuplicateValues("STATUS_DESC", new sap.ui.model.json.JSONModel(), "StatusFilterJSON", oData);
				}

			});
			this._oPASortDialog.open();
		}

	});

});

function get(k) {
	return map[k];
}

var map = {
	"FUTURE": 4,
	"OPEN": 3,
	"CLOSED": 2,
	"COMPLETED": 1
};