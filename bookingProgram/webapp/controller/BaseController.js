/*global history */
/*  global moment:true */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/Device",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/m/MessageBox",
	"sap/m/Link",
	"sap/ui/core/message/Message",
	"sap/ui/core/MessageType",
	"sap/ui/model/json/JSONModel",
	"tci/wave2/ui/bookingProgram/model/formatter"
], function (Controller, History, Device, MessagePopover, MessageItem, MessageBox, Link, Message, MessageType, JSONModel, formatter) {
	"use strict";
	var ManageBooking;
	var iteration;
	var check1 = 0;
	var check2 = 0;
	var check3 = 0;
	var check4 = 0;
	var check5 = 0;
	var filters1 = [];
	var filters2 = [];
	var filters3 = [];
	var filters4 = [];
	var CONST_APP_STATE = "APP_STATE";
	var CONT_PRODUCT_MODEL = "productModel";
	var CONST_PROFILE_MODEL = "G_ProfileModel";
	var CONT_CATEGORY_MODEL = "categoryModel";

	return Controller.extend("tci.wave2.ui.bookingProgram.controller.BaseController", {
		formatter: formatter,

		/**
		 * Convenience method for accessing the router in every controller of the application.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		/**
		 *Convenience method for getting the view model by name in every controller of the application.
		 * @public
		 * @param {string} sName the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
		setModel: function (oModel, sName) {
			return this.getView().setModel(oModel, sName);
		},

		/**
		 * Convenience method for getting the resource bundle.
		 * @public
		 * @returns {sap.ui.model.resource.ResourceModel} the resourceModel of the component
		 */
		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		/**
		 * Event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the master route.
		 * @public
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				history.go(-1);
			} else {
				//this.getRouter().navTo("Login", null, true);
			}
		},

		onExit: function () {
			// You should stop the interval on exit.  You should also stop the interval if you navigate out of your view and start it again when you navigate back. 
			if (this.intervalHandle) {
				clearInterval(this.intervalHandle);
			}
		},

		clockServices: function () {
			var that = this;
			this.intervalHandle = setInterval(function () {
				that.tickingClock();
				that.updatePageStatus();
			}, 1000);

		},

		tickingClock: function () {
			var obj = this.getView().byId("tci_clock");
			//	obj.setText(moment(new Date()).tz("Etc/GMT+5").format("YYYY-MM-DD HH:mm:ss") + " " + "EST");
			obj.setText(moment(new Date()).tz("Canada/Eastern").format("YYYY-MM-DD HH:mm:ss") + " " + "EST");

		},

		getAppStateModel: function () {
			var odataModel = sap.ui.getCore().getModel(CONST_APP_STATE);
			if (odataModel === null || odataModel === undefined) {
				var oAppState = {
					messageListLength: 0,
					tabKey: "CO",
					visiblePA: true,
					userProfile: {
						loaded: false,
						firstName: "",
						lastName: "",
						dealerCode: "",
						language: "",
						userType: "",
						division: "",
						email: ""
					},
					appLinkes: {
						loaded: false
					}
				};
				odataModel = new sap.ui.model.json.JSONModel();
				odataModel.setData(oAppState);
				sap.ui.getCore().setModel(odataModel, CONST_APP_STATE);
			}
			return odataModel;
		},

		getTestDealerModel: function () {
			var dataM = this.getOwnerComponent().getModel("bpData");
			return dataM;
		},

		getTestDeliveryModel: function () {
			var dataM = this.getOwnerComponent().getModel("dsData");
			return dataM;
		},

		getBookingOdataV2Model: function () {
			return this.getOwnerComponent().getModel("bookingOdataV2");
		},

		/*getBookingOdataV4Model: function () {
			return this.getOwnerComponent().getModel("bookingOdataV4");
		},*/

		getProductModel: function () {
			return this.getOwnerComponent().getModel("MD_PRODUCT_OP_SRV");
		},

		getBPModel: function () {
			return this.getOwnerComponent().getModel("API_BUSINESS_PARTNER");
		},

		getVendorMeterialModel: function () {
			return this.getOwnerComponent().getModel("Z_VENDORMAT_VAL_SRV");
		},

		getVehicleCatalogModel: function () {
			return this.getOwnerComponent().getModel("Z_VEHICLE_CATALOGUE_SRV");
		},

		getMaterialBomModel: function () {
			return this.getOwnerComponent().getModel("ZC_MATERIAL_BOM_CDS");
		},

		getUpdateValidationModel: function () {
			return this.getOwnerComponent().getModel("Z_VENDORMAT_VAL_SRV");
		},

		isFrench: function () {
			var lang = sap.ui.getCore().getConfiguration().getLanguage();
			if (!!lang && lang.toLowerCase().startsWith("fr")) {
				return true;
			} else {
				return false;
			}
		},

		getCurrentLanguageKey: function () {
			var lang = sap.ui.getCore().getConfiguration().getLanguage();
			if (!!lang && lang.toLowerCase().startsWith("fr")) {
				return "FR";
			} else {
				return "EN";
			}
		},

		getCurrentLanguageKey4Par: function () {
			var lang = sap.ui.getCore().getConfiguration().getLanguage();
			if (!!lang && lang.toLowerCase().startsWith("fr")) {
				return "F";
			} else {
				return "E";
			}
		},

		getUserId: function () {
			var theUser = "testUser";
			var bModel = this.getModel(CONST_PROFILE_MODEL);
			if (!!bModel) {
				theUser = bModel.getProperty("/userData/logonName");
			}
			return theUser;
		},

		createdAppProfileFromPayLoad: function (profileData) {
			var lvLanguage = jQuery.sap.getUriParameters().get("Language");
			var lvDivision = jQuery.sap.getUriParameters().get("Division");
			var aProfile = null;

			if (!!profileData && !!profileData.userContext && !!profileData.userContext.userAttributes) {

				aProfile = {};
				aProfile.loaded = true;
				aProfile.userData = {};

				// only two language -- default is english					
				aProfile.userData.language = "en";

				if (!!lvLanguage) {
					lvLanguage = lvLanguage.trim().toLowerCase();
					if ("fr" === lvLanguage) {
						aProfile.userData.language = "fr";
					}
				} else {
					if (!!profileData.userContext.userAttributes.Language && profileData.userContext.userAttributes.Language.length > 0) {
						lvLanguage = profileData.userContext.userAttributes.Language[0];
						if (!!lvLanguage) {
							lvLanguage = lvLanguage.trim().toLowerCase();
							if ("french" === lvLanguage) {
								aProfile.userData.language = "fr";
							}
						}
					}
				}

				if (!!aProfile.userData.language) {
					// only set the locale is the lang is set, 
					sap.ui.getCore().getConfiguration().setLanguage(aProfile.userData.language);
				}

				if (!!profileData.userContext.userAttributes.UserType && profileData.userContext.userAttributes.UserType.length > 0) {
					aProfile.userData.userType = profileData.userContext.userAttributes.UserType[0];
				}

				if (!!profileData.userContext.userInfo) {
					aProfile.userData.email = profileData.userContext.userInfo.email;
					aProfile.userData.familyName = profileData.userContext.userInfo.familyName;
					aProfile.userData.givenName = profileData.userContext.userInfo.givenName;
					aProfile.userData.logonName = profileData.userContext.userInfo.logonName;
				}

				// default  - toyota 10
				aProfile.userData.division = "10";
				aProfile.logoImage = "images/toyota.png";
				if (!!lvDivision) {
					if (lvDivision === "20") {
						aProfile.userData.division = lvDivision;
						aProfile.logoImage = "images/Lexus_EN.png";
					}
				} else {
					if (!!profileData.userContext.userAttributes.Brand && profileData.userContext.userAttributes.Brand.length > 0) {
						lvDivision = profileData.userContext.userAttributes.Brand[0];
					}
					if (!!lvDivision && lvDivision === "Lexus") {
						aProfile.userData.division = "20";
						aProfile.logoImage = "images/Lexus_EN.png";
					}
				}

				if (!!profileData.userContext.userAttributes.DealerCode && profileData.userContext.userAttributes.DealerCode.length > 0) {
					aProfile.userData.dealerCode = profileData.userContext.userAttributes.DealerCode[0];
				}

				if (!!profileData.userContext.userAttributes.Department && profileData.userContext.userAttributes.Department.length > 0) {
					aProfile.userData.department = profileData.userContext.userAttributes.Department[0];
				} else {
					aProfile.userData.department = "D002";
				}

				// scopes 
				aProfile.scopes = {};
				if (!!profileData.userContext.scopes && profileData.userContext.scopes.length > 0) {
					for (var i = 0; i < profileData.userContext.scopes.length; i++) {
						if (profileData.userContext.scopes[i].endsWith("ReadOnly")) {
							aProfile.scopes.ReadOnly = true;
						} else if (profileData.userContext.scopes[i].endsWith("DealerBooking")) {

							aProfile.scopes.DealerBooking = true;
						} else if (profileData.userContext.scopes[i].endsWith("BookingAdmin")) {
							aProfile.scopes.BookingAdmin = true;
						} else {
							// NO right 
						}
					}
				}
			}
			return aProfile;
		},

		/*
		 * initialize the profile or loading from m catch ( model )
		 */
		getAppProfile: function (callback) {
			var that = this;
			var bModel = that.getModel(CONST_PROFILE_MODEL);
			if (!!bModel) {
				callback(bModel);
			} else {
				// need to load from remote server.  
				that.loadAppProfileFromRemote(function (profileData) {
					var aProfile = that.createdAppProfileFromPayLoad(profileData);
					// for dealer/internal/admin. additional field 
					if (!!aProfile && !!aProfile.scopes.DealerBooking && !!aProfile.userData.dealerCode) {
						that.getBusinessPartnersByDealerCode(aProfile.userData.dealerCode, function (bpRecord) {
							if (!!bpRecord) {
								aProfile.userData.dealerInfo = {};
								aProfile.userData.dealerInfo.dealerBpId = bpRecord.BusinessPartner;
								aProfile.userData.dealerInfo.dealerCode = bpRecord.SearchTerm2;
								aProfile.userData.dealerInfo.dealerName = bpRecord.BusinessPartnerName;
								aProfile.userData.dealerInfo.dealerType = "01"; //defualt toyota
								if (!!bpRecord.to_Customer && !!bpRecord.to_Customer.Attribute1) {
									if (bpRecord.to_Customer.Attribute1 === "01" || // toyota
										bpRecord.to_Customer.Attribute1 === "02" || // lexus
										bpRecord.to_Customer.Attribute1 === "03" || // dual 
										bpRecord.to_Customer.Attribute1 === "04") { // land cruiser - as toyota
										aProfile.userData.dealerInfo.dealerType = bpRecord.to_Customer.Attribute1;
									}
								}
							}
							bModel = new sap.ui.model.json.JSONModel();
							bModel.setData(aProfile);
							that.setModel(bModel, CONST_PROFILE_MODEL);
							callback(bModel);
						});
					} else {
						if (!!aProfile) {
							bModel = new sap.ui.model.json.JSONModel();
							bModel.setData(aProfile);
							that.setModel(bModel, CONST_PROFILE_MODEL);
							callback(bModel);
						} else {
							callback(null);
						}
					}
				});
			}
		},

		/*
		 * Loading applicatin profile,  includeing user profile from server side  
		 */
		loadAppProfileFromRemote: function (callbackFunc) {
			$.ajax({
				url: "/node/env/userProfile", //un-comment before deploying
				//url: "/node/env/userProfile1", //comment before deploying, used only for local testing
				type: "GET",
				dataType: "json",
				success: function (oData, a, b) {
					callbackFunc(oData);
				},
				error: function (response) {
					callbackFunc(null);
				}
			});
		},

		getBusinessPartnersByDealerBP: function (dealerBP, callback) {

			var bModel = this.getBPModel();

			var key = bModel.createKey("/A_BusinessPartner", {
				"BusinessPartner": dealerBP
			});

			bModel.read(key, {
				urlParameters: {
					"$expand": "to_Customer,to_BusinessPartnerAddress/to_PhoneNumber"
				},
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		// category

		setCategoryModel: function (callback) {
			var that = this;
			var bModel = this.getProductModel();
			var jsonModel = new JSONModel();
			var jsonData = {};

			jsonData.items = [];

			this.getCategoriesFromS4(function (categories) {
				if (!!categories) {
					jsonData.keys = categories.keys;
					jsonData.entries = categories.entries;
				} else {
					jsonData.keys = [];
					jsonData.entries = {};
				}
				jsonModel.setData(jsonData);
				that.setModel(jsonModel, CONT_CATEGORY_MODEL);
				callback(jsonModel);
			});
		},

		getCategoryModel: function (callback) {
			var bModel = this.getModel(CONT_CATEGORY_MODEL);
			if (!!bModel) {
				callback(bModel);
			} else {
				this.setCategoryModel(callback);
			}
		},

		getAllProgramDeliveryLocations: function (programUid, vendor, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramDeliveryLocations(programUid, results.length, vendor, processPages);
				}
			}

			that.getPageOfProgramDeliveryLocations(programUid, skip, vendor, processPages);

		},

		getPageOfProgramDeliveryLocations: function (programUid, skip, vendor, callback) {
			var bModel = this.getBookingOdataV2Model();
			var aFilters = [];
			aFilters[0] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());
			aFilters[1] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUid);
			aFilters[2] = new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.EQ, vendor);
			var key = "/ProgramDeliveryLocationLangSet";
			bModel.read(key, {
				urlParameters: {

					"$skip": skip,
					"$top": 1000
				},
				filters: aFilters,
				success: function (oData, oResponse) {
					if (oData && oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}

				},
				error: function (err) {
					callback([]);
				}
			});
		},

		getAllProgramCategoryMini: function (programUid, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramCategoryMini(programUid, results.length, processPages);
				}
			}

			that.getPageOfProgramCategoryMini(programUid, skip, processPages);

		},

		getPageOfProgramCategoryMini: function (programUid, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			var key = bModel.createKey("/MiniProgramCategorySet", {
				"ProgramUid": programUid,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$expand": "to_messages",
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					//	"$expand": "to_messages",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		// Vendor
		validateVendorList: function (vendorList, callback) {
			var payloadObject = {};
			var vendorObjList = [];
			var vendorObj = null;
			if (!!vendorList && vendorList.length > 0) {
				payloadObject.Vendor = "2400100752";
				payloadObject.VendorToMaterial = {};
				for (var i = 0; i < vendorList.length; i++) {
					vendorObj = {};
					vendorObj.Vendor = vendorList[i];
					vendorObjList.push(vendorObj);
				}
				payloadObject.VendorToMaterial.results = vendorObjList;

				this.callValidationService(payloadObject, function (rObject) {
					if (!!rObject && !!rObject.VendorToMaterial && !!rObject.VendorToMaterial.results) {
						callback(rObject.VendorToMaterial.results);
					} else {
						callback(null);
					}
				});
			} else {
				callback(null);
			}
		},

		validateDealerList: function (vendorList, callback) {
			var payloadObject = {};
			var vendorObjList = [];
			var vendorObj = null;
			if (!!vendorList && vendorList.length > 0) {
				payloadObject.Vendor = "2400100752";
				payloadObject.VendorToMaterial = {};
				for (var i = 0; i < vendorList.length; i++) {
					vendorObj = {};
					vendorObj.Searchterm2 = vendorList[i];
					vendorObjList.push(vendorObj);
				}
				payloadObject.VendorToMaterial.results = vendorObjList;

				this.callValidationService(payloadObject, function (rObject) {
					if (!!rObject && !!rObject.VendorToMaterial && !!rObject.VendorToMaterial.results) {
						callback(rObject.VendorToMaterial.results);
					} else {
						callback(null);
					}
				});
			} else {
				callback(null);
			}
		},

		validateModelYearList: function (modelYearList, callback) {
			var payloadObject = {};
			var vendorObj = null;
			if (!!modelYearList && modelYearList.length > 0) {
				payloadObject.Vendor = "2400100752";
				payloadObject.VendorToMaterial = {};
				payloadObject.VendorToMaterial.results = modelYearList;

				this.callValidationService(payloadObject, function (rObject) {
					if (!!rObject && !!rObject.VendorToMaterial && !!rObject.VendorToMaterial.results) {
						callback(rObject.VendorToMaterial.results);
					} else {
						callback(null);
					}
				});
			} else {
				callback(null);
			}
		},

		// Parts
		validatePartsList: function (partsList, callback) {
			var payloadObject = {};
			var partObjList = [];
			var partObj = null;
			if (!!partsList && partsList.length > 0) {
				payloadObject.Vendor = "2400100752";
				payloadObject.VendorToMaterial = {};
				// for (var i = 0; i < vendorList.length; i++) {
				// 	partObj = {};
				// 	partObj.Material = partsList[i];
				// 	partObjList.push(partObj);
				// }
				payloadObject.VendorToMaterial.results = partsList;

				this.callValidationService(payloadObject, function (rObject) {
					if (!!rObject && !!rObject.VendorToMaterial && !!rObject.VendorToMaterial.results) {
						callback(rObject.VendorToMaterial.results);
					} else {
						callback(null);
					}
				});
			} else {
				callback(null);
			}
		},

		callValidationService: function (jObject, callback) {
			var bModel = this.getUpdateValidationModel();

			bModel.create("/zc_vendorSet", jObject, {
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		// callValidationService : function(jObject ,callback ){
		// 	$.ajax({
		// 		type: "POST",
		// 		url: "/sap/opu/odata/sap/Z_VENDORMAT_VAL_SRV/zc_vendorSet",
		// 		dataType: "json",
		// 		contentType: "application/json",
		// 		data: JSON.stringify(jObject),
		// 		success: function (rdata, textStatus, jqXHR) {
		// 			callback(rdata);
		// 		},
		// 		error: function (jqXHR, textStatus, errorThrown) {
		// 			callback(null);
		// 		}
		// 	});
		// },

		getAllProgramVendorMini: function (programUid, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramVendorMini(programUid, results.length, processPages);
				}
			}

			that.getPageOfProgramVendorMini(programUid, skip, processPages);

		},

		getPageOfProgramVendorMini: function (programUid, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			/*var key = bModel.createKey("/MiniProgramVendorInput", {
				"ProgramUid": programUid,
				"Language": this.getCurrentLanguageKey()
			});*/
			// var key = bModel.createKey("/MiniProgramVendorInput", {
			// 	"ProgramUid": programUid,
			// 	"Language": 'EN'
			// });
			var key = bModel.createKey("/MiniProgramVendorSet", {
				"ProgramUid": programUid,
				"Language": 'EN'
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$expand": "to_messages",
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					//"$expand": "to_messages",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		// Delivery Method
		getAllProgramDeliveryMethodMini: function (programUid, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramDeliveryMethodMini(programUid, results.length, processPages);
				}
			}

			that.getPageOfProgramDeliveryMethodMini(programUid, skip, processPages);

		},

		getPageOfProgramDeliveryMethodMini: function (programUid, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			// var key = bModel.createKey("/MiniProgramDeliveryMethodInput", {
			// 	"ProgramUid": programUid,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramDeliveryMethodSet", {
				"ProgramUid": programUid,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$expand": "to_messages",
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					//	"$expand": "to_messages",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		// Delivery Location
		getAllProgramDeliveryLocationMini: function (programUid, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramDeliveryLocationMini(programUid, results.length, processPages);
				}
			}

			that.getPageOfProgramDeliveryLocationMini(programUid, skip, processPages);

		},

		getPageOfProgramDeliveryLocationMini: function (programUid, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			// var key = bModel.createKey("/MiniProgramDeliveryLocationInput", {
			// 	"ProgramUid": programUid,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramDeliveryLocationSet", {
				"ProgramUid": programUid,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$expand": "to_messages",
			// 		"$orderby": "VENDOR_ID",
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					//	"$expand": "to_messages",
					"$orderby": "VENDOR_ID",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		// Parts
		getAllProgramPartMini: function (programUid, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramPartMini(programUid, results.length, processPages);
				}
			}

			that.getPageOfProgramPartMini(programUid, skip, processPages);

		},

		getPageOfProgramPartMini: function (programUid, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			// var key = bModel.createKey("/MiniProgramPartsInput", {
			// 	"ProgramUid": programUid,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramPartsSet", {
				"ProgramUid": programUid,
				"Language": this.getCurrentLanguageKey()
			});


			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$expand": "to_messages",
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					//	"$expand": "to_messages",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		// PartFitment
		getAllProgramPartFitmentMini: function (programUid, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramPartFitmentMini(programUid, results.length, processPages);
				}
			}

			that.getPageOfProgramPartFitmentMini(programUid, skip, processPages);

		},

		getPageOfProgramPartFitmentMini: function (programUid, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			// var key = bModel.createKey("/MiniProgramPartFitmentInput", {
			// 	"ProgramUid": programUid,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramPartFitmentSet", {
				"ProgramUid": programUid,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$expand": "to_messages",
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					//"$expand": "to_messages",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		// PriorPurchase
		getAllProgramPriorPurchaseMini: function (programUid, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramPriorPurchaseMini(programUid, results.length, processPages);
				}
			}

			that.getPageOfProgramPriorPurchaseMini(programUid, skip, processPages);

		},

		getPageOfProgramPriorPurchaseMini: function (programUid, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			// var key = bModel.createKey("/MiniProgramPriorPurchaseInput", {
			// 	"ProgramUid": programUid,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/MiniProgramPriorPurchaseSet", {
				"ProgramUid": programUid,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$expand": "to_messages",
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					//"$expand": "to_messages",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		// vendor order Report 
		getAllVendororderReport: function (programUid, vendor, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
				} else {
					results = results.concat(retItems);
					that.getPageOfVendororderReport(programUid, vendor, results.length, processPages);
				}
			}

			that.getPageOfVendororderReport(programUid, vendor, skip, processPages);

		},

		getPageOfVendororderReport: function (programUid, vendor, skip, callback) {
			var bModel = this.getBookingOdataV2Model();

			// var key = bModel.createKey("/DealerBookingVendorReportInput", {
			// 	"ProgramUid": programUid,
			// 	"VendorCode": vendor,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/DealerBookingVendorReportSet", {
				"ProgramUid": programUid,
				"VendorCode": vendor,
				"Language": this.getCurrentLanguageKey()
			});

			// bModel.read(key + "/Results", {
			// 	urlParameters: {
			// 		"$skip": skip,
			// 		"$top": 1000
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		getAllProgramOrderReportAllDealers: function (programUid, dealerList, callback) {
			var that = this;

			var results = [];
			var dealerListLength = dealerList.length;

			function processPagesDealer(retItems, index) {
				if (index + 1 == dealerListLength) {
					results = results.concat(retItems);
					callback(results);
				} else {
					results = results.concat(retItems);
				}
			}
			this.numberList = 0;
			this.dealerList = dealerList;
			//for (var i = 0; i < dealerList.length; i++) {

			that.getAllProgramOrderReport(programUid, dealerList[0], processPagesDealer);

			//}
		},
		// vendor order Report 
		getAllProgramOrderVendorReport: function (programUid, dealer, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results);
					results = [];
				} else {
					results = results.concat(retItems);
					that.getPageOfProgramOrderReport(programUid, results.length, dealer, processPages);
				}
			}

			that.getPageOfProgramOrderReport(programUid, skip, dealer, processPages);

		},

		getAllProgramOrderReport: function (programUid, dealer, callback) {
			var that = this;
			var skip = 0;
			var results = [];

			function processPages(retItems) {
				if (!retItems || retItems.length <= 0) {
					callback(results, that.numberList++);
					if (that.dealerList.length > that.numberList) {
						that.getAllProgramOrderReport(programUid, that.dealerList[that.numberList], callback);
					}
					results = [];
				} else if (retItems.length >= 1000) {
					results = results.concat(retItems);
					that.getPageOfProgramOrderReport(programUid, results.length, dealer, processPages);
				} else {
					results = results.concat(retItems);
					callback(results, that.numberList++);
					if (that.dealerList.length > that.numberList) {
						that.getAllProgramOrderReport(programUid, that.dealerList[that.numberList], callback);
					}
					results = [];
				}
			}

			that.getPageOfProgramOrderReport(programUid, skip, dealer, processPages);

		},

		getPageOfProgramOrderReport: function (programUid, skip, dealer, callback) {
			var bModel = this.getBookingOdataV2Model();

			// var key = bModel.createKey("/DealerBookingReportInput", {
			// 	"ProgramUid": programUid,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			var key = bModel.createKey("/DealerBookingReportSet", {
				"PROGRAMUID": programUid,
				"LANGUAGE": this.getCurrentLanguageKey()
			});

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("DEALER_CODE", sap.ui.model.FilterOperator.EQ, dealer);

			bModel.read(key + "/Set", {
				urlParameters: {
					"$skip": skip,
					"$top": 1000
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback([]);
					}
				},
				error: function (err) {
					callback([]);
				}
			});
		},

		getVendorFrench: function (vendorCode, callback) {
			var bModel = this.getBPModel();

			var key = bModel.createKey("/A_Supplier", {
				"Supplier": vendorCode
			});

			bModel.read(key, {
				urlParameters: {
					"Language": "FR",
					"$select": "Supplier,SupplierName"
				},
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getMaterialBom: function (matnr, callback) {
			var that = this;
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("matnr", sap.ui.model.FilterOperator.EQ, matnr);
			oFilter[1] = new sap.ui.model.Filter("mspras", sap.ui.model.FilterOperator.EQ, 'E');
			oFilter[2] = new sap.ui.model.Filter("bspras", sap.ui.model.FilterOperator.EQ, 'E');
			oFilter[3] = new sap.ui.model.Filter("cspras", sap.ui.model.FilterOperator.EQ, 'E');
			oFilter[4] = new sap.ui.model.Filter("stlan", sap.ui.model.FilterOperator.EQ, '1');

			var rtArray = [];
			rtArray[0] = '';
			rtArray[1] = '';
			rtArray[2] = '';
			rtArray[3] = '';
			rtArray[4] = '';

			var bModel = this.getMaterialBomModel();
			bModel.read("/zc_material_bom", {
				filters: oFilter,
				urlParameters: {
					//		"$select": "Supplier,SupplierName"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							rtArray[i] = oData.results[i].idnrk;
						}
						callback(matnr, rtArray);
					} else {
						callback(matnr, rtArray);
					}
				},
				error: function (err) {
					callback(matnr, rtArray);
				}
			});
		},

		getValidVendor: function (vendorCode, callback) {
			var that = this;
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("Supplier", sap.ui.model.FilterOperator.EQ, vendorCode);
			oFilter[1] = new sap.ui.model.Filter("DeletionIndicator", sap.ui.model.FilterOperator.EQ, false);

			var rtObj = {};

			var bModel = this.getBPModel();
			bModel.read("/A_Supplier", {
				filters: oFilter,
				urlParameters: {
					"Language": "EN",
					"$select": "Supplier,SupplierName"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						rtObj.SupplierName = oData.results[0].SupplierName;
						rtObj.SupplierName_fr = oData.results[0].SupplierName;
						that.getVendorFrench(vendorCode, function (fr_odata) {
							if (!!fr_odata) {
								rtObj.SupplierName_fr = fr_odata.SupplierName;
							}
							callback(rtObj);
						});
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getBusinessPartnersByDealerCode: function (dealerCode, callback) {
			var oFilter = [];
			// delaer code to be maintained
			oFilter[0] = new sap.ui.model.Filter("SearchTerm2", sap.ui.model.FilterOperator.EQ, dealerCode);
			// has to be exteranl dealer
			oFilter[1] = new sap.ui.model.Filter("BusinessPartnerType", sap.ui.model.FilterOperator.EQ, "Z001");
			// should be not inactive - the seach is not woriking very well                   
			//oFilter[2] = new sap.ui.model.Filter("zstatus", sap.ui.model.FilterOperator.NotEndsWith, "X");

			var bModel = this.getBPModel();
			bModel.read("/A_BusinessPartner", {
				filters: oFilter,
				urlParameters: {
					"$expand": "to_Customer"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						var bpRecord = null;
						for (var i = 0; i < oData.results.length; i++) {
							bpRecord = oData.results[i];
							if (!!bpRecord && bpRecord.zstatus !== "X") {
								break;
							} else {
								bpRecord = null;
							}
						}
						callback(bpRecord);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListOfPeriodWithMonday: function (startDate, endDate) {
			var periodList = [];
			var period = null;

			var startYear = startDate.getUTCFullYear();
			var startMonth = startDate.getUTCMonth();
			var startDay = startDate.getUTCDate();

			var endYear = endDate.getUTCFullYear();
			var endMonth = endDate.getUTCMonth();
			var endDay = endDate.getUTCDate();

			var startMoment = null;
			var endMoment = null;
			var endMomentNextMonth = null;
			var weekDay = 0;
			var theMoment = null;
			var toMonthStart = 0;

			var title1Formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "MMM YY"
			});

			var title2Formatter = sap.ui.core.format.DateFormat.getDateTimeInstance({
				pattern: "MMM YYYY"
			});

			var duration = 0;
			// moment.locale ....
			if (!!startDate && endDate) {
				// calculate the real start date 
				startMoment = moment(new Date(startYear, startMonth, startDay, 0, 0, 0, 0));

				endMoment = moment(new Date(endYear, endMonth, endDay, 0, 0, 0, 0));

				endMomentNextMonth = moment(endMoment);
				endMomentNextMonth.startOf("month");
				endMomentNextMonth.add(1, "month");
				duration = moment.duration(endMomentNextMonth.diff(endMoment)).days();
				if (duration < 6) {
					weekDay = endMomentNextMonth.weekday();
					// the 0 is sunaday 6 is saturday
					if (weekDay > 0 && weekDay < 6) {
						endMoment = endMomentNextMonth.endOf("week");
					}
				}

				theMoment = moment(startMoment);
				theMoment.endOf("month");
				theMoment = theMoment.add(1, "days"); // first day of the nrxt moneth 
				weekDay = theMoment.weekday();

				toMonthStart = theMoment.diff(startMoment, "days");
				// the 0 is sunaday 6 is saturday
				if (weekDay > 0 && weekDay < 6 && toMonthStart < weekDay) {
					startMoment = moment(theMoment);
				} else {
					theMoment = theMoment.subtract(1, "month");
				}

				for (var i = 0; i < 6; i++) { //max 6 

					if (theMoment.isAfter(endMoment)) {
						break;
					}
					period = {};

					period.nameTitle1 = title1Formatter.format(theMoment.toDate());
					period.nameTitle2 = title2Formatter.format(theMoment.toDate());
					period.name = theMoment.format("MMYYYY");
					period.startDate = theMoment.toDate();
					period.weeksList = this.getMondays(theMoment, startMoment, endMoment);
					periodList.push(period);
					theMoment = theMoment.add(1, "month");
				}
			}
			return periodList;
		},

		getMondays: function (monthstart, startDate, endDate) {
			var lvWeekDays = 0;
			var mondayArray = [];
			var endofMonth = moment(monthstart).endOf("month");
			lvWeekDays = endofMonth.weekday();
			if (lvWeekDays === 0 || lvWeekDays > 4) {
				//endofMonth = endofMonth.endOf("week").add(1, "days");
			} else {
				// end of week is saturday here
				endofMonth = endofMonth.subtract(lvWeekDays + 1, "days");
				endofMonth = endofMonth.endOf("week").add(1, "days");
			}

			var weekWrk = moment(monthstart);
			lvWeekDays = weekWrk.weekday();
			weekWrk = weekWrk.startOf("week").add(1, "days");
			if (lvWeekDays > 5) {
				weekWrk = weekWrk.add(1, "w");
			}

			// sunday before the starting monday 
			var startingM = moment(startDate).startOf("week").subtract(1, "days").endOf("week").add(1, "days");

			// last Sunday 
			var endM = moment(endDate).endOf("week").add(1, "days");
			var i = 1;
			while (weekWrk.isBefore(endofMonth)) {

				if (startingM.isBefore(weekWrk) && endM.isAfter(weekWrk)) {

					mondayArray.push({
						index: i,
						idate: weekWrk.toDate()
					});
				}
				weekWrk = weekWrk.add(1, "w");
				i = i + 1;
			}
			return mondayArray;
		},

		getDealerCondition: function () {
			var orConditions = [];
			orConditions.push(new sap.ui.model.Filter("BusinessPartnerType", sap.ui.model.FilterOperator.EQ, "Z001"));
			orConditions.push(new sap.ui.model.Filter("BusinessPartnerType", sap.ui.model.FilterOperator.EQ, "Z004"));
			orConditions.push(new sap.ui.model.Filter("BusinessPartnerType", sap.ui.model.FilterOperator.EQ, "Z005"));
			return new sap.ui.model.Filter(orConditions, false);
		},

		send2XIPI: function (jObj, callback) {
			$.ajax({
				type: "POST",
				url: "/proxy/apic/SalesOrderFromBookingProgram",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify(jObj),
				success: function (rdata, textStatus, jqXHR) {
					callback(rdata);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					callback(null);
				}
			});
		},

		onHeaderMenu: function (event) {
			var key = event.getParameter("item").getKey();

			switch (key) {
				case "MB":
					this.getRouter().navTo("DealerBooking", {
						encodedKey: "NEW"
					}, true);
					break;
				case "PA":
					if (sap.ui.getCore().getModel("CurrentProgressModel").currentTab == "MP") {
						this.getRouter().navTo("SearchProgram", null, true);
					} else if (sap.ui.getCore().getModel("CurrentProgressModel").currentTab == "DP") {
						this.getRouter().navTo("ProgramDetail", {
							encodedKey: sap.ui.getCore().getModel("CurrentProgressModel").pathEncoded
						});
					}
					break;
			}
			return;
		},

		_getMessagePopover: function () {
			// create popover lazily (singleton)
			if (!this._oMessagePopover) {
				this._oMessagePopover = sap.ui.xmlfragment(this.getView().getId(), "tci.wave2.ui.bookingProgram.view.fragments.MessagePopover",
					this);
				this.getView().addDependent(this._oMessagePopover);
			}
			return this._oMessagePopover;
		},

		handleMessagePopoverPress: function (oEvent) {
			this._getMessagePopover().toggle(oEvent.getSource());
		},

		saveProgramSummary: function (inData, isNew) { },

		savePartsPeriodDate: function (inData, callback) {
			var bModel = this.getBookingOdataV2Model();

			//bModel.create("/DealerBookingPartPeriodSet", inData, {
			bModel.create("/dealerBookingPeriodCreate", inData, {
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		saveDelivery: function (inData, callback) {
			var bModel = this.getBookingOdataV2Model();

			bModel.create("/dealerBookingDeliveryCreate", inData, {
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		saveDelDay: function (inData, sDate, pDate, callback) {
			var bModel = this.getBookingOdataV2Model();
			var schedule_dt = '01-01-1900';
			var period_dt = moment(sDate, "MMYYYY").startOf("month").toDate();
			if (pDate !== "") {
				schedule_dt = moment(pDate, "MM-DD-YYYY").toDate();
				schedule_dt.setDate(schedule_dt.getDate() + 1);
			} else {
				schedule_dt = moment(schedule_dt, "MM-DD-YYYY").toDate();
				schedule_dt.setDate(schedule_dt.getDate() + 1);
			}
			period_dt.setDate(period_dt.getDate() + 1);
			inData.SCHEDULE_DATE = schedule_dt;
			inData.PERIOD_DT = period_dt;
			// inData.SCHEDULE_DATE = moment(pDate, "MM-DD-YYYY").toDate();

			bModel.create("/dealerBookingDeliveryPeriodCreate", inData, {
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getDealerNet: function (partNumber, dealerCode, callback) {
			var bModel = this.getProductModel();

			var oFilters = [];
			oFilters.push(new sap.ui.model.Filter("Division", sap.ui.model.FilterOperator.EQ, "10"));
			oFilters.push(new sap.ui.model.Filter("DocType", sap.ui.model.FilterOperator.EQ, "ZAF"));
			oFilters.push(new sap.ui.model.Filter("SalesOrg", sap.ui.model.FilterOperator.EQ, "7000"));
			oFilters.push(new sap.ui.model.Filter("DistrChan", sap.ui.model.FilterOperator.EQ, "10"));
			oFilters.push(new sap.ui.model.Filter("CndType", sap.ui.model.FilterOperator.EQ, "ZPG4"));
			oFilters.push(new sap.ui.model.Filter("SoldtoParty", sap.ui.model.FilterOperator.EQ, dealerCode));
			oFilters.push(new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, partNumber));

			bModel.read("/ZC_PriceSet", {
				filters: oFilters,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						if (!!(oData.results[0].Amount)) {
							callback(partNumber, dealerCode, Number(oData.results[0].Amount), true);
						} else {
							callback(partNumber, dealerCode, 0, true);
						}

					} else {
						callback(partNumber, dealerCode, 0, false);
					}
				},
				error: function (err) {
					callback(partNumber, dealerCode, err, false);
				}
			});
		},

		getTireSize: function (partNumber, callback) {
			var bModel = this.getProductModel();
			var oFilters = [];
			oFilters.push(new sap.ui.model.Filter("MATERIAL", sap.ui.model.FilterOperator.EQ, partNumber));
			oFilters.push(new sap.ui.model.Filter("CLASS", sap.ui.model.FilterOperator.EQ, "TIRE_INFORMATION"));
			oFilters.push(new sap.ui.model.Filter("CHARAC", sap.ui.model.FilterOperator.EQ, "TIRE_SIZE"));

			bModel.read("/ZC_Characteristic_InfoSet", {
				filters: oFilters,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						callback(oData.results[0].VALUE);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},
		getBookingLines: function (inData, callback) {
			var that = this;
			var items = [];

			function processPages(retItems) {
				if (!!retItems && retItems.length > 0) {
					items = items.concat(retItems);
					that.getPageofBookingLines(inData, items.length, processPages);
				} else {
					// return 
					callback(items);
				}
			}
			this.getPageofBookingLines(inData, 0, processPages);

		},

		getPageofBookingLines: function (inData, skip, callback) {
			var bModel = this.getBookingOdataV2Model();
			var theUUID = inData.PROGRAM_UUID;

			// var key = "/PartBookingOrderDeliveryInput(ProgramUUID='" + theUUID + "')/Execute";
			var key = "/PartBookingOrderDeliverySet(ProgramUUID='" + theUUID + "')/Set";


			bModel.read(key, {
				urlParameters: {
					"$orderby": "B_STATUS,PROGRAM_UUID,DEALER_CODE,VENDOR_ID,CATEGORY_ID,PART_NUM,PERIOD_DT",
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results) {
						callback(oData.results);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getDealerBookingSummary: function (inData, callback) {
			var bModel = this.getBookingOdataV2Model();
			var lvLang = this.getCurrentLanguageKey();
			// var key = bModel.createKey("/DealerBookingStatusSummaryInput", {
			// 	"IN_PROGRAM_UUID": inData.PROGRAM_UUID,
			// 	"IN_DEALER_CODE": inData.DEALER_CODE,
			// 	"IN_LANG": lvLang
			// });
			var key = bModel.createKey("/DealerBookingStatusSummarySet", {
				"InDealerCode": inData.DEALER_CODE,
				"ProgramUUID": inData.PROGRAM_UUID,
				"Lang": lvLang
			});
			bModel.setSizeLimit(200000);

			// bModel.read(key + "/Execute", {
			// 	urlParameters: {
			// 		"$top": 1,
			// 		"$expand": "to_DealerDeliveryLocation,to_ProgramVechicleModelYearSet,to_ProgramValidCategoriesSet,to_ProgramValidVendorsSet"
			// 	},
			bModel.read(key + "/Set", {
				urlParameters: {
					"$top": 1,
					//	"$expand": "to_DealerDeliveryLocation,to_ProgramVechicleModelYearSet,to_ProgramValidCategoriesSet,to_ProgramValidVendorsSet"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						callback(oData.results[0]);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});

		},

		getProgramSummary: function (inData, callback) {
			var bModel = this.getBookingOdataV2Model();

			var key = bModel.createKey("/BookingProgramSummary", {
				"PROGRAM_UUID": inData.PROGRAM_UUID
			});

			bModel.read(key, {
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getDealerBookingRecords: function (inData, callback) {
			var that = this;
			var items = [];
			//var retItemsLength=0;

			function processPages(odata) {
				var retItems = odata.results;
				//retItemsLength+=retItems.length;
				//var nonDuplicateRecords=[],nonDuplicateParts=[];
				if (!!retItems && retItems.length > 0) {
					/*if(inData.Filter== "VENDOR_ID" || inData.Filter== "TIRESIZE")
					{
						for(var k=0; k<retItems.length; k++)
						{
						 if(!nonDuplicateParts.includes(retItems[k].PART_NUM))
						 {
							  nonDuplicateParts.push(retItems[k].PART_NUM);
							  nonDuplicateRecords.push(retItems[k]);
						 }
						}
					items = items.concat(nonDuplicateRecords);
					that.getPageofDealerBookingRecords(inData, retItemsLength, processPages);	
					}*/

					items = items.concat(retItems);
					that.getPageofDealerBookingRecords(inData, items.length, processPages);

				} else {
					// return 
					callback(items);
				}
			}
			this.getPageofDealerBookingRecords(inData, 0, processPages);

		},

		getPageofDealerBookingRecords: function (inData, skip, callback) {
			var bModel = this.getBookingOdataV2Model();
			var lvLang = this.getCurrentLanguageKey();
			// var key = bModel.createKey("/DealerBookingPartInput", {
			// 	"DealerCode": inData.DEALER_CODE,
			// 	"ProgramUUID": inData.PROGRAM_UUID,
			// 	"Lang": lvLang
			// });

			var aFilters = [];
			bModel.setSizeLimit(20000);
			if (inData.Filter !== "") {
				if (inData.FilterValue !== "") {
					var filter1 = new sap.ui.model.Filter(inData.Filter, sap.ui.model.FilterOperator.EQ, inData.FilterValue);
					aFilters.push(filter1);
				}
			}
			if (inData.Filter1 !== "") {
				if (inData.FilterValue1 !== "") {
					var filter2 = new sap.ui.model.Filter(inData.Filter1, sap.ui.model.FilterOperator.EQ, inData.FilterValue1);
					aFilters.push(filter2);
					var filter3 = new sap.ui.model.Filter({
						filters: aFilters,
						and: true
					});
					aFilters = [];
					aFilters.push(filter3);
				}
			}
			if (inData.Filter2 !== "" && inData.Filter2 !== undefined) {
				var aFilters = [];
				if (inData.FilterValue2 !== "" && inData.FilterValue2 !== undefined) {
					var filter2 = new sap.ui.model.Filter(inData.Filter2, sap.ui.model.FilterOperator.NE, inData.FilterValue2);
					aFilters.push(filter2);
				}
				// var key = "/DealerBookingPartInput(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
				// 	"')/Execute";
				var key = "/DealerBookingPartSet(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
					"')/Set";

				bModel.read(key, {
					urlParameters: {
						"$skip": skip,
						"$top": 1000,
						"$inlinecount": "allpages"
					},
					filters: aFilters,
					success: function (oData, oResponse) {
						if (!!oData) {
							callback(oData);
						} else {
							callback(null);
						}
					},
					error: function (err) {
						callback(null);
					}
				});
			} else {
				// var key = "/DealerBookingPartInput(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
				// 	"')/Execute";
				var key = "/DealerBookingPartSet(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
					"')/Set";

				bModel.read(key, {
					urlParameters: {
						//	"$expand": "to_DealerBookingPartPeriodSet,to_ProgramPartsModelYearsSet", expanded entity of no use
						"$skip": skip,
						"$top": 100,
						"$inlinecount": "allpages"
					},
					filters: aFilters,
					success: function (oData, oResponse) {
						if (!!oData) {
							callback(oData);
						} else {
							callback(null);
						}
					},
					error: function (err) {
						callback(null);
					}
				});
			}
		},
		getDealerBookingVendorRecords: function (inData, callback) {
			var that = this;
			var items = [];
			//var retItemsLength=0;

			function processPages(odata) {
				var retItems = odata.results;
				//retItemsLength+=retItems.length;
				//var nonDuplicateRecords=[],nonDuplicateParts=[];
				if (!!retItems && retItems.length > 0) {
					/*if(inData.Filter== "VENDOR_ID" || inData.Filter== "TIRESIZE")
					{
						for(var k=0; k<retItems.length; k++)
						{
						 if(!nonDuplicateParts.includes(retItems[k].PART_NUM))
						 {
							  nonDuplicateParts.push(retItems[k].PART_NUM);
							  nonDuplicateRecords.push(retItems[k]);
						 }
						}
					items = items.concat(nonDuplicateRecords);
					that.getPageofDealerBookingRecords(inData, retItemsLength, processPages);	
					}*/

					items = items.concat(retItems);
					that.getPageofDealerBookingVendorRecords(inData, items.length, processPages);

				} else {
					// return 
					callback(items);
				}
			}
			this.getPageofDealerBookingVendorRecords(inData, 0, processPages);

		},
		getPageofDealerBookingVendorRecords: function (inData, skip, callback) {
			var bModel = this.getBookingOdataV2Model();
			var lvLang = this.getCurrentLanguageKey();
			// var key = bModel.createKey("/DealerBookingPartInput", {
			// 	"DealerCode": inData.DEALER_CODE,
			// 	"ProgramUUID": inData.PROGRAM_UUID,
			// 	"Lang": lvLang
			// });

			var aFilters = [];
			bModel.setSizeLimit(20000);
			/*	var filter0 = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, inData.PROGRAM_UUID);
				aFilters.push(filter0);
				var filter01 = new sap.ui.model.Filter("DEALER_CODE", sap.ui.model.FilterOperator.EQ, inData.DEALER_CODE);
				aFilters.push(filter01);
			*/
			if (inData.Filter !== "") {
				if (inData.FilterValue !== "") {
					var filter1 = new sap.ui.model.Filter(inData.Filter, sap.ui.model.FilterOperator.EQ, inData.FilterValue);
					aFilters.push(filter1);
				}
			}
			if (inData.Filter1 !== "") {
				if (inData.FilterValue1 !== "") {
					var filter2 = new sap.ui.model.Filter(inData.Filter1, sap.ui.model.FilterOperator.EQ, inData.FilterValue1);
					aFilters.push(filter2);
				}
			}
			// var key = "/DealerBookingPartVendorInput(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
			// 	"')/Execute";
			var key = "/DealerBookingPartVendorSet(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
				"')/Set";
			//	var key = "/DealerBookingPartVendorSet";
			bModel.read(key, {
				urlParameters: {
					//	"$expand": "to_DealerBookingPartPeriodVendorSet,to_ProgramPartsModelYearsVendorSet", expanded entity of no use
					"$skip": skip,
					"$top": 100,
					"$inlinecount": "allpages"
				},
				filters: aFilters,
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},
		getDealerBookingRecordsX: function (inData, callback) {
			var bModel = this.getBookingOdataV2Model();
			var lvLang = this.getCurrentLanguageKey();
			// var key = bModel.createKey("/DealerBookingPartInput", {
			// 	"DealerCode": inData.DEALER_CODE,
			// 	"ProgramUUID": inData.PROGRAM_UUID,
			// 	"Lang": lvLang
			// });
			// var key = "/DealerBookingPartInput(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
			// 	"')/Execute";
			var key = "/DealerBookingPartSet(InDealerCode='" + inData.DEALER_CODE + "',Lang='" + lvLang + "',ProgramUUID='" + inData.PROGRAM_UUID +
				"')/Set";
			bModel.read(key, {
				urlParameters: {
					"$expand": "to_DealerBookingPartPeriodSet,to_ProgramPartsModelYearsSet",
					"$skip": "skip",
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getDeliveryScheduleRecords: function (inData, callback) {
			var that = this;
			var items = [];

			function processPages(retItems) {
				if (!!retItems && retItems.length > 0) {
					items = items.concat(retItems);
					that.getPageofDeliveryScheduleRecords(inData, items.length, processPages);
				} else {
					// return 
					callback(items);
				}
			}
			this.getPageofDeliveryScheduleRecords(inData, 0, processPages);

		},

		getPageofDeliveryScheduleRecords: function (inData, skip, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var lvLang = this.getCurrentLanguageKey();
			// var key = bModel.createKey("/DealerBookingCategoryDeliveryInput", {
			// 	"DealerCode": inData.DEALER_CODE,
			// 	"ProgramUUID": inData.PROGRAM_UUID,
			// 	"Lang": lvLang
			// });
			var key = bModel.createKey("/DealerBookingCategoryDeliverySet", {
				"DealerCode": inData.DEALER_CODE,
				"ProgramUUID": inData.PROGRAM_UUID,
				"Lang": lvLang
			});

			// bModel.read(key + "/Execute", {
			// 	urlParameters: {
			// 		"$skip": skip,
			// 		"$top": 1000,
			// 		"$expand": "to_DealerBookingCategoryDeliverySchedule,to_DeliveryLocation,to_DeliveryMethodSet,to_DeliveryMethodName"
			// 			// "$expand": "to_DealerBookingCategoryDeliverySchedule,to_DeliveryMethodSet,to_DeliveryLocation"
			// 	},                       
			bModel.read(key + "/Set", {
				urlParameters: {
					"$skip": skip,
					"$top": 1000

					//"$expand": "to_DealerBookingCategoryDeliverySchedule,to_DeliveryLocation,to_DeliveryMethodSet,to_DeliveryMethodName"
					// "$expand": "to_DealerBookingCategoryDeliverySchedule,to_DeliveryMethodSet,to_DeliveryLocation"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length != 0) {
						var obj = {};
						obj.inData = JSON.stringify(oData);
						obj.dealerCode = inData.DEALER_CODE;
						bModel.create("/readEntities", obj, {
							success: function (data, response) {
								console.log(data);
								callback(data.readEntities.results);
							},
							error: function (err) {
								console.log(err);
								//callbackFunc(null);
							}
						});
						// 	bModel.callFunction("/readEntities", {
						//     method: "POST",
						// 	inData:JSON.stringify(obj),
						//     // urlParameters: {
						//     //     inData : JSON.stringify(oData),
						// 	// 	dealerCode : inData.DEALER_CODE
						//     // },
						//     success: function (data, response) {
						//         console.log(data);
						//         //callbackFunc(oData);
						//     },
						//     error: function (data, oResponse) {
						//         console.log(data);
						//        // callbackFunc(null);
						//     }
						//    });

						// ManageBooking = oData.results;
						// iteration = oData.results.length;
						// for (var i = 0; i < oData.results.length; i++) {
						// 	//var data = that.getEntityRead(oData, i);
						// 	if (oData.results.length != 0) {
						// 		if (check5 < iteration) {
						// 			filters1.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, inData.PROGRAM_UUID));
						// 			filters1.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, lvLang));
						// 			filters1.push(new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.EQ, oData.results[i].VENDOR_ID));
						// 			filters1.push(new sap.ui.model.Filter("CATEGORY_ID", sap.ui.model.FilterOperator.EQ, oData.results[i].CATEGORY_ID));

						// 			bModel.read("/ProgramValidDeliveryMethodLangSet", {
						// 				filters: filters1,
						// 				success: function (data, Response) {
						// 					console.log("I am inside 1st Read call");
						// 					console.log("The i value :" + i);
						// 					if (check1 < iteration) {
						// 						ManageBooking[check1].to_DeliveryMethodSet = data;
						// 						filters2.push(new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, ManageBooking[check1].PROGRAM_UUID));
						// 						filters2.push(new sap.ui.model.Filter("DEALER_CODE", sap.ui.model.FilterOperator.EQ, inData.DEALER_CODE));
						// 						filters2.push(new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.EQ, ManageBooking[check1].VENDOR_ID));
						// 						filters2.push(new sap.ui.model.Filter("CATEGORY_ID", sap.ui.model.FilterOperator.EQ, ManageBooking[check1].CATEGORY_ID));
						// 						check1++;
						// 					}
						// 					bModel.read("/DealerBookingCategoryDeliveryScheduleSet", {
						// 						filters: filters2,
						// 						success: function (data1, Response) {
						// 							console.log("I am inside 2nd Read call");
						// 							console.log(data1);
						// 							if (check2 < iteration) {
						// 								ManageBooking[check2].to_DealerBookingCategoryDeliverySchedule = data1;
						// 								filters3.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, ManageBooking[check2].LANGUAGE_KEY));
						// 								filters3.push(new sap.ui.model.Filter("DEL_METHOD", sap.ui.model.FilterOperator.EQ, ManageBooking[check2].DEL_METHOD));
						// 								check2++;
						// 							}
						// 							bModel.read("/DeliveryMethodNameSet", {
						// 								filters: filters3,
						// 								success: function (data2, Response) {
						// 									console.log("I am inside 3rd Read call");
						// 									console.log(data2);
						// 									if (check3 < iteration) {
						// 										console.log(data2);
						// 										ManageBooking[check3].to_DeliveryMethodName = data2;
						// 										filters4.push(new sap.ui.model.Filter("OBJECT_KEY", sap.ui.model.FilterOperator.EQ, ManageBooking[check3].DEL_LOCATION_UUID));
						// 										filters4.push(new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, ManageBooking[check3].LANGUAGE_KEY));
						// 										check3++;																
						// 									}	
						// 									bModel.read("/ProgramDeliveryLocationLangSet", {
						// 										filters: filters4,
						// 										success: function (data3, Response) {
						// 											console.log("I am inside 4th Read call");
						// 											console.log(data3);
						// 											if(check4<iteration) {
						// 											ManageBooking[check4].to_DeliveryLocation = data3;
						// 											check4++;
						// 											check5++;
						// 											return ManageBooking;
						// 											}
						// 										},							
						// 										error: function (err) {
						// 											console.log(err);
						// 										}

						// 									});														

						// 								}, error: function (err) {
						// 									console.log(err);
						// 								}
						// 							});
						// 						}, error: function (err) {
						// 							console.log(err);
						// 						}
						// 					});
						// 				}, error: function (err) {
						// 					console.log(err);
						// 				}
						// 			});
						// 		}

						// 		} else {
						// 			callback(null);
						// 		}
						// 	}

						// } 
						// console.log("4rd read call completed" + check4);
						// console.log("Read call completed");
					} else {
						callback(null);
					}

				}, error: function (err) {
					callback(null);
				}

			});
		},

		getDeliveryScheduleRecordsX: function (inData, skip, callback) {
			var bModel = this.getBookingOdataV2Model();
			var lvLang = this.getCurrentLanguageKey();
			// var key = bModel.createKey("/DealerBookingCategoryDeliveryInput", {
			// 	"DealerCode": inData.DEALER_CODE,
			// 	"ProgramUUID": inData.PROGRAM_UUID,
			// 	"Lang": lvLang
			// });
			var key = bModel.createKey("/DealerBookingCategoryDeliverySet", {
				"DealerCode": inData.DEALER_CODE,
				"ProgramUUID": inData.PROGRAM_UUID,
				"Lang": lvLang
			});

			// bModel.read(key + "/Execute", {
			// 	urlParameters: {
			// 		"$skip": skip,
			// 		"$top": 50,
			// 		"$expand": "to_DealerBookingCategoryDeliverySchedule,to_DeliveryMethodSet,to_DeliveryLocation"
			// 	},

			bModel.read(key + "/Set", {
				urlParameters: {
					"$skip": skip,
					"$top": 50,
					"$expand": "to_DealerBookingCategoryDeliverySchedule,to_DeliveryMethodSet,to_DeliveryLocation"
				},
				success: function (oData, oResponse) {
					if (!!oData) {
						callback(oData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getCategoriesFromS4: function (callback) {
			var that = this;
			var categoriesKeyIndex = [];
			var categoriesIndex = {};
			var categories = {};
			this.getCategoriesEnglish(function (enList) {
				if (!!enList && !!enList.length > 0) {
					for (var i1 = 0; i1 < enList.length; i1++) {
						if (categoriesKeyIndex.indexOf(enList[i1].PRODH) < 0) {
							// only  if not found 
							categoriesKeyIndex.push(enList[i1].PRODH);
							categoriesIndex[enList[i1].PRODH] = {
								key: enList[i1].PRODH,
								enDesc: enList[i1].VTEXT,
								frDesc: ""
							};
						}
					}

					that.getCategoriesFrench(function (frList) {
						if (!!frList && !!frList.length > 0) {
							for (var i2 = 0; i2 < frList.length; i2++) {
								if (categoriesKeyIndex.indexOf(frList[i2].PRODH) < 0) {
									// only  if not found 
									categoriesKeyIndex.push(frList[i2].PRODH);
									categoriesIndex[frList[i2].PRODH] = {
										key: frList[i2].PRODH,
										enDesc: "",
										frDesc: frList[i2].VTEXT
									};
								} else {
									categoriesIndex[frList[i2].PRODH].frDesc = frList[i2].VTEXT;
								}
							}
						}

						// finalized the list 
						var enDe = null;
						var frDe = null;
						if (!!categoriesKeyIndex && categoriesKeyIndex.length > 0) {
							for (var i3 = 0; i3 < categoriesKeyIndex.length; i3++) {
								// make sure there is desc for the lang
								enDe = categoriesIndex[categoriesKeyIndex[i3]].enDesc;
								frDe = categoriesIndex[categoriesKeyIndex[i3]].frDesc;
								if (!frDe) {
									categoriesIndex[categoriesKeyIndex[i3]].frDesc = enDe;
								}
								if (!enDe) {
									categoriesIndex[categoriesKeyIndex[i3]].enDesc = frDe;
								}

							}
						}
						categories.keys = categoriesKeyIndex;
						categories.entries = categoriesIndex;
						callback(categories);
					});
				} else {
					callback(null);
				}
			});
		},

		getCategoriesEnglish: function (callback) {
			var bModel = this.getProductModel();
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("STUFE", sap.ui.model.FilterOperator.EQ, "3");
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE", sap.ui.model.FilterOperator.EQ, "E");
			bModel.read("/ZC_Product_CategorySet", {
				urlParameters: {
					"$select": "PRODH,VTEXT",
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						callback(oData.results);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getCategoriesFrench: function (callback) {
			var bModel = this.getProductModel();
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("STUFE", sap.ui.model.FilterOperator.EQ, "3");
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE", sap.ui.model.FilterOperator.EQ, "F");
			bModel.read("/ZC_Product_CategorySet", {
				urlParameters: {
					"$select": "PRODH,VTEXT",
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						callback(oData.results);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});

		},

		//depreacted 
		getCategoryDetailsX: function (categoryId, callback) {
			var iModel = this.getModel(CONT_PRODUCT_MODEL);
			var items = iModel.getProperty("/items");
			var outData = null;
			if (!!items && !!items.length && items.length > 0) {
				for (var i = 0; i < items.length > 0; i++) {
					if (items[i].key === categoryId) {
						outData = {
							key: categoryId,
							enDesc: items[i].name,
							frDesc: items[i].name,
							desc: items[i].name
						};
					}
				}
			}
			callback(outData);
		},

		// TODO YYH	
		getCategoryDetails: function (categoryId, callback) {
			var iModel = this.getModel(CONT_CATEGORY_MODEL);
			var items = iModel.getProperty("/entries");
			var outData = items[categoryId];
			callback(outData);
		},

		getListDMitems: function (callback) {
			var that = this;
			var items = [];

			function processPages(retItems) {
				if (!!retItems && retItems.length > 0) {
					items = items.concat(retItems);
					that.getPageOfListDMitems(items.length, processPages);
				} else {
					// return 
					callback(items);
				}
			}
			this.getPageOfListDMitems(0, processPages);
		},

		getPageOfListDMitems: function (skip, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			bModel.read("/DeliveryMethods", {
				urlParameters: {
					"$skip": skip,
					"$top": 1000
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.isNew = false;
							item.isDistributor = true;
							item.key = oData.results[i].DEL_METHOD;
							if (that.isFrench()) {
								item.frDesc = oData.results[i].FR_NAME;
								item.desc = oData.results[i].FR_NAME;
							} else {
								item.enDesc = oData.results[i].EN_NAME;
								item.desc = oData.results[i].EN_NAME;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListVendor: function (programUUID, notinlcudeInvalid, callback) {
			var that = this;
			var items = [];
			var oFilter = [];

			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUID);

			if (notinlcudeInvalid) {
				oFilter[1] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			function processPages(retItems) {
				if (!!retItems && retItems.length > 0) {
					items = items.concat(retItems);
					that.getPageOfListVendor(oFilter, items.length, processPages);
				} else {
					// return 
					callback(items);
				}
			}

			this.getPageOfListVendor(oFilter, 0, processPages);
		},

		getPageOfListVendor: function (filters, skip, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			bModel.read("/ProgramVendorSet", {
				urlParameters: {
					"$skip": skip,
					"$top": 1000
				},
				filters: filters,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.key = oData.results[i].VENDOR_ID;
							if (that.isFrench()) {
								item.frDesc = oData.results[i].FR_DESC;
								item.desc = oData.results[i].FR_DESC;
							} else {
								item.enDesc = oData.results[i].EN_DESC;
								item.desc = oData.results[i].EN_DESC;
							}
							if (oData.results[i].DISTRIBUTOR === "X") {
								item.isDistributor = true;
							} else {
								item.isDistributor = false;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListVendorMessages: function (programUUID, onlyValid, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUID);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());

			if (onlyValid) {
				oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			bModel.read("/ProgramVendorLangSet", {
				urlParameters: {
					// "$inlinecount": "allpages",
					"$expand": "to_messages"
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						var messages = null;
						var iObject = null;

						for (var i = 0; i < oData.results.length; i++) {
							iObject = oData.results[i];

							item = {};
							item.selected = false;
							item.isNew = false;
							item.isValid = iObject.VALID;
							item.objectKey = iObject.OBJECT_KEY;
							item.key = iObject.VENDOR_ID;

							item.frDesc = iObject.VENDOR_DESC;
							item.enDesc = iObject.VENDOR_DESC;
							item.desc = iObject.VENDOR_DESC;
							if (iObject.DISTRIBUTOR === "X") {
								item.isDistributor = true;
							} else {
								item.isDistributor = false;
							}

							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.messages = [];
							if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
								for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
									item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
								}
							}
							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.messages = [];
							if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
								for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
									item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
								}
							}

							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListCategory: function (programUUId, onlyValid, callback) {
			var that = this;
			var items = [];

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);

			if (onlyValid) {
				oFilter[1] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			function processPages(retItems) {
				if (!!retItems && retItems.length > 0) {
					items = items.concat(retItems);
					that.getPageofListCategory(oFilter, items.length, processPages);
				} else {
					// return 
					callback(items);
				}
			}

			this.getPageofListCategory(oFilter, 0, processPages);
		},

		getPageofListCategory: function (oFilter, skip, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			bModel.read("/ProgramCategorySet", {
				urlParameters: {
					"$skip": skip,
					"$top": 1000
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.isNew = false;
							item.isValid = oData.results[i].VALID;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.key = oData.results[i].CATEGORY_ID;
							if (that.isFrench()) {
								item.frDesc = oData.results[i].FR_DESC;
								item.desc = oData.results[i].FR_DESC;
							} else {
								item.enDesc = oData.results[i].EN_DESC;
								item.desc = oData.results[i].EN_DESC;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListCategoryMessages: function (programUUId, onlyValid, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());

			if (onlyValid) {
				oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			bModel.read("/ProgramCategoryLangSet", {
				urlParameters: {
					// "$inlinecount": "allpages",
					"$expand": "to_messages"
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					var messages = null;
					var iObject = null;
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							iObject = oData.results[i];
							item = {};
							item.selected = false;
							item.isNew = false;
							item.isValid = iObject.VALID;
							item.objectKey = iObject.OBJECT_KEY;
							item.key = iObject.CATEGORY_ID;

							item.desc = iObject.CATEGORY_DESC;
							item.enDesc = iObject.CATEGORY_DESC;
							item.frDesc = iObject.CATEGORY_DESC;

							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.messages = [];
							if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
								for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
									item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
								}
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		/*
		 * get list of valid categories 
		 */
		getValidCategoryList: function (programUuuid, callbackFunc) {

			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/validCategories", {
				method: "GET",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: programUuuid
				},
				success: function (oData, response) {
					callbackFunc(oData);
				},
				error: function (oData, oResponse) {
					callbackFunc(null);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
			// $.ajax({
			// 	url: "/xsjs/validCategories.xsjs?programUuid=" + programUuuid,
			// 	type: "GET",
			// 	dataType: "json",
			// 	success: function (oData, a, b) {
			// 		callbackFunc(oData);
			// 	},
			// 	error: function (response) {
			// 		callbackFunc(null);
			// 	}
			// });
		},

		saveUploadedCategoryList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/categoryUploader.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			var obj = {};
			obj.inData = JSON.stringify(data)
			bModel.create("/categoryUploader", obj, {
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
		},

		saveUploadedVendorList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/vendorUploader.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			var obj = {};
			obj.inData = JSON.stringify(data);
			bModel.create("/vendorUploader", obj, {
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});




		},

		saveUploadedDeliveryMethodList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/deliveryMethodUploader.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			var obj = {};
			obj.inData = JSON.stringify(data);
			bModel.create("/deliveryMethodUploader", obj, {
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});






		},

		saveUploadedDeliveryLocationList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/deliveryLocationUploader.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			var obj = {};
			obj.inData = JSON.stringify(data),
				bModel.create("/deliveryLocationUploader", obj, {
					// method: "POST",
					// urlParameters: {
					// 	// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// 	// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// 	// ZzsoReqNo: requestid
					// 	programUuid: data.programUuid,
					// 	inData: JSON.stringify(data.updateList),
					// 	updatedBy: data.updatedBy
					// },
					success: function (rdata, response) {
						callbackFunc(true);
					},
					error: function (oData, oResponse) {
						callbackFunc(false);
						// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
						// 	.MessageBox.Action.OK, null, null);
					}
				});
		},

		saveUploadedPartFitmentList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/partFitmentUploader.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			var obj = {};
			obj.inData = JSON.stringify(data);
			bModel.create("/partFitmentUploader", obj, {
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});




		},

		getDistinctTiresizeList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "GET",
			// 	url: "/xsjs/tiresizeInput.xsjs?programUUID='" + data.programUuid + "'",
			// 	dataType: "json",
			// 	contentType: "application/json",

			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(rdata, true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(null, false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/tiresizeInput", {
				method: "GET",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUUID: data.programUuid
				},
				success: function (rdata, response) {
					callbackFunc(rdata.results, true);
				},
				error: function (oData, oResponse) {
					callbackFunc(null, false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});

		},
		getAllDealersReport: function (data, callbackFunc) {

			// $.ajax({
			// 	type: "GET",
			// 	url: "/xsjs/allDealerBookingReport.xsjs?programUUID='" + data + "'",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(rdata);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(null);
			// 	}
			// });

			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/allDealerBookingReport", {
				method: "GET",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUUID: data
				},
				success: function (rdata, response) {
					callbackFunc(rdata.results);
				},
				error: function (oData, oResponse) {
					callbackFunc(null);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});

		},


		getDistinctDealersList: function (data, callbackFunc) {
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/dealerBooked", {
				method: "GET",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUUID: data
				},
				success: function (rdata, response) {
					callbackFunc(rdata, true);
				},
				error: function (oData, oResponse) {
					callbackFunc(null, false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});

			// $.ajax({
			// 	type: "GET",
			// 	url: "/xsjs/dealerBooked.xsjs?programUUID='" + data + "'",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(rdata, true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(null, false);
			// 	}
			// });

		},
		getDistinctSeriesYearList: function (data, callbackFunc) {

			// $.ajax({
			// 	type: "GET",
			// 	url: "/xsjs/SeriesYear.xsjs?programUUID='" + data.programUuid + "'",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(rdata, true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(null, false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/seriesYear", {
				method: "GET",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUUID: data.programUuid
				},
				success: function (rdata, response) {
					callbackFunc(rdata.results, true);
				},
				error: function (oData, oResponse) {
					callbackFunc(null, false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});





		},
		getDistinctSeriesYearListOfBrand: function (data, callbackFunc) {

			// $.ajax({
			// 	type: "GET",
			// 	url: "/xsjs/SeriesYearBrand.xsjs?programUUID=" + data.programUuid + "&division=" + data.division,
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(rdata, true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(null, false);
			// 	}
			// });

			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/seriesYearBrand", {
				method: "GET",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUUID: data.programUuid,
					division: data.division
				},
				success: function (rdata, response) {
					callbackFunc(rdata.results, true);
				},
				error: function (oData, oResponse) {
					callbackFunc(null, false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});






		},

		saveUploadedPartsList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/partsUploader.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });

			var bModel = this.getBookingOdataV2Model();
			var obj = {};
			obj.inData = JSON.stringify(data);
			bModel.create("/partsUploader", obj, {
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});




		},

		saveUploadedPriorPurchaseList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/priorPurchaseUploader.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var obj = {};
			obj.inData = JSON.stringify(data);
			var bModel = this.getBookingOdataV2Model();
			bModel.create("/priorPurchaseUploader", obj, {
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});

		},

		deleteAllCategoryList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/categoryDeleteAll.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/categoryDeleteAll", {
				method: "POST",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: data.programUuid

				},
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
		},

		deleteAllVendorList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/vendorDeleteAll.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/vendorDeleteAll", {
				method: "POST",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: data.programUuid

				},
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
		},

		deleteAllDeliveryMethodList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/deliveryMethodDeleteAll.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/deliveryMethodDeleteAll", {
				method: "POST",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: data.programUuid

				},
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});





		},

		deleteAllDeliveryLocationList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/deliveryLocationDeleteAll.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/deliveryLocationDeleteAll", {
				method: "POST",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: data.programUuid

				},
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
		},

		deleteAllPartFitmentList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/partFitmentDeleteAll.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/partFitmentDeleteAll", {
				method: "POST",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: data.programUuid

				},
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
		},

		deleteAllPartsList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/partsDeleteAll.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/partsDeleteAll", {
				method: "POST",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: data.programUuid

				},
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
		},

		deleteAllPriorPurchaseList: function (data, callbackFunc) {
			// $.ajax({
			// 	type: "POST",
			// 	url: "/xsjs/priorPurchaseDeleteAll.xsjs",
			// 	dataType: "json",
			// 	contentType: "application/json",
			// 	data: JSON.stringify(data),
			// 	success: function (rdata, textStatus, jqXHR) {
			// 		callbackFunc(true);
			// 	},
			// 	error: function (jqXHR, textStatus, errorThrown) {
			// 		callbackFunc(false);
			// 	}
			// });
			var bModel = this.getBookingOdataV2Model();
			bModel.callFunction("/priorPurchaseDeleteAll", {
				method: "POST",
				urlParameters: {
					// Reason: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/resonCancelId_val"),
					// Reason_comment: CSOR_controller.getOwnerComponent().getModel("LocalDataModel").getProperty("/comment_ch_res"),
					// ZzsoReqNo: requestid
					programUuid: data.programUuid

				},
				success: function (rdata, response) {
					callbackFunc(true);
				},
				error: function (oData, oResponse) {
					callbackFunc(false);
					// sap.m.MessageBox.show(oData.Message, sap.m.MessageBox.Icon.ERROR, "Error", sap.m
					// 	.MessageBox.Action.OK, null, null);
				}
			});
		},

		getListDeliveryMethod: function (programuuId, includeinvalid, callback) {
			var isFrench = this.isFrench();
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programuuId);

			if (includeinvalid) {
				oFilter[1] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");

			}

			bModel.read("/ProgramDeliveryMethodSet", {
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.isNew = false;
							item.isValid = oData.results[i].VALID;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.vendorId = oData.results[i].VENDOR_ID;
							item.categoryId = oData.results[i].CATEGORY_ID;
							item.dmId = oData.results[i].DEL_METHOD;

							if (isFrench) {
								item.dmName = oData.results[i].FR_DEL_M_NAME;
								item.vendorName = oData.results[i].FR_VENDOR_DESC;
								item.categoryName = oData.results[i].FR_CATEGORY_DESC;
							} else {
								item.dmName = oData.results[i].EN_DEL_M_NAME;
								item.vendorName = oData.results[i].EN_VENDOR_DESC;
								item.categoryName = oData.results[i].EN_CATEGORY_DESC;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListDeliveryMethodMessages: function (programuuId, onlyValid, callback) {
			var isFrench = this.isFrench();
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programuuId);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());

			if (onlyValid) {
				oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			bModel.read("/ProgramDeliveryMethodLangSet", {
				urlParameters: {
					// "$inlinecount": "allpages",
					"$expand": "to_messages"
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						var messages = null;
						var iObject = null;

						for (var i = 0; i < oData.results.length; i++) {
							iObject = oData.results[i];
							item = {};
							item.selected = false;
							item.isNew = false;
							item.objectKey = iObject.OBJECT_KEY;
							item.vendorId = iObject.VENDOR_ID;
							item.categoryId = iObject.CATEGORY_ID;
							item.dmId = iObject.DEL_METHOD;
							item.isValid = iObject.VALID;

							item.dmName = iObject.DEL_METHOD_NAME;
							item.vendorName = iObject.VENDOR_DESC;
							item.categoryName = iObject.CATEGORY_DESC;

							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.messages = [];
							if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
								for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
									item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
								}
							}

							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListProgramPartFitments: function (programUUId, includeValid, callback) {
			var isFrench = this.isFrench();
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);

			if (includeValid) {
				oFilter[1] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			bModel.read("/ProgramPartFitmentSet", {
				// urlParameters: {
				// 	"$inlinecount": "allpages"
				// },
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.isValid = oData.results[i].VALID;
							item.modelCode = oData.results[i].MODEL_CODE;
							item.brand = oData.results[i].BRAND_NAME;
							item.partId = oData.results[i].PART_NUM;
							item.year = oData.results[i].YEAR;

							item.partDescEn = oData.results[i].EN_PART_DESC;
							item.partDescFr = oData.results[i].FR_PART_DESC;
							item.modelDescEn = oData.results[i].EN_MODEL_DESC;
							item.modelDescEn = oData.results[i].FR_MODEL_DESC;
							if (isFrench) {
								item.partDesc = oData.results[i].FR_PART_DESC;
								item.modelDesc = oData.results[i].FR_MODEL_DESC;
							} else {
								item.partDesc = oData.results[i].EN_PART_DESC;
								item.modelDesc = oData.results[i].EN_MODEL_DESC;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getPartFitments: function (programUUId, partNum, callback) {
			var isFrench = this.isFrench();
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);
			oFilter[1] = new sap.ui.model.Filter("PART_NUM", sap.ui.model.FilterOperator.EQ, partNum);
			oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");

			bModel.read("/ProgramPartFitmentSet", {
				// urlParameters: {
				// 	"$inlinecount": "allpages"
				// },
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.modelCode = oData.results[i].MODEL_CODE;
							item.brand = oData.results[i].BRAND_NAME;
							item.partId = oData.results[i].PART_NUM;
							item.year = oData.results[i].YEAR;

							if (isFrench) {
								item.partDesc = oData.results[i].FR_PART_DESC;
								item.modelDesc = oData.results[i].FR_MODEL_DESC;
							} else {
								item.partDesc = oData.results[i].EN_PART_DESC;
								item.modelDesc = oData.results[i].EN_MODEL_DESC;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListProgramPartFitmentsMessages: function (programUUId, onlyValid, callback) {
			var isFrench = this.isFrench();
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());

			if (onlyValid) {
				oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			bModel.read("/ProgramPartFitmentLangSet", {
				urlParameters: {
					// "$inlinecount": "allpages",
					"$expand": "to_messages"
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						var messages = null;
						var iObject = null;

						for (var i = 0; i < oData.results.length; i++) {
							iObject = oData.results[i];

							item = {};
							item.selected = false;
							item.objectKey = iObject.OBJECT_KEY;
							item.isValid = iObject.VALID;
							item.modelCode = iObject.MODEL_CODE;
							item.brand = iObject.BRAND_NAME;
							item.partId = iObject.PART_NUM;
							item.year = iObject.YEAR;

							item.partDescEn = iObject.PART_DESC;
							item.partDescFr = iObject.PART_DESC;
							item.modelDescEn = iObject.MODEL_DESC;
							item.modelDescEn = iObject.MODEL_DESC;
							item.partDesc = iObject.PART_DESC;
							item.modelDesc = iObject.MODEL_DESC;
							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.messages = [];
							if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
								for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
									item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
								}
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListProgramParts: function (programUUId, includeValid, callback) {
			var that = this;

			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);

			if (includeValid) {
				oFilter[1] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");

			}

			bModel.read("/ProgramPartSet", {
				// urlParameters: {
				// 	"$inlinecount": "allpages"
				// },
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.isValid = oData.results[i].VALID;
							item.vendorId = oData.results[i].VENDOR_ID;
							item.categoryId = oData.results[i].CATEGORY_ID;
							item.partId = oData.results[i].PART_NUM;
							item.details = oData.results[i].DETAIL;

							if (that.isFrench()) {
								item.partDesc = oData.results[i].FR_DESC;
								item.vendorName = oData.results[i].FR_VENDOR_DESC;
								item.categoryName = oData.results[i].FR_CATEGORY_DESC;
							} else {
								item.partDesc = oData.results[i].EN_DESC;
								item.vendorName = oData.results[i].EN_VENDOR_DESC;
								item.categoryName = oData.results[i].EN_CATEGORY_DESC;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListProgramPartsMessages: function (programUUId, onlyValid, callback) {
			var that = this;

			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());

			if (onlyValid) {
				oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			bModel.read("/ProgramPartLangSet", {
				urlParameters: {
					// "$inlinecount": "allpages",
					"$expand": "to_messages"
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						var messages = null;
						var iObject = null;

						for (var i = 0; i < oData.results.length; i++) {
							iObject = oData.results[i];
							item = {};
							item.selected = false;
							item.objectKey = iObject.OBJECT_KEY;
							item.isValid = iObject.VALID;
							item.vendorId = iObject.VENDOR_ID;
							item.categoryId = iObject.CATEGORY_ID;
							item.partId = iObject.PART_NUM;
							item.details = iObject.DETAIL;

							item.partDesc = iObject.PART_DESC;
							item.vendorName = iObject.VENDOR_DESC;
							item.categoryName = iObject.CATEGORY_DESC;
							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.messages = [];
							if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
								for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
									item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
								}
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListProgramDelLoc: function (programUUId, includeinvalid, vendorId, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);
			oFilter[1] = new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.EQ, vendorId);

			if (includeinvalid) {
				oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			bModel.read("/ProgramDeliveryLocationSet", {
				// urlParameters: {

				// "$inlinecount": "allpages"
				// },
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.isNew = false;
							item.isValid = oData.results[i].VALID;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.currentVendor = oData.results[i].VENDOR_ID;
							item.isNew = false;
							item.key = oData.results[i].DEL_LOCATION_ID;
							if (that.isFrench()) {
								item.name = oData.results[i].FR_DEL_LOCATION_NAME;
							} else {
								item.name = oData.results[i].EN_DEL_LOCATION_NAME;
							}
							item.addressDetail = {};
							item.addressDetail.line1 = oData.results[i].DEL_ADDRESS1;
							item.addressDetail.line2 = oData.results[i].DEL_ADDRESS2;
							item.addressDetail.city = oData.results[i].DEL_CITY;
							item.addressDetail.province = oData.results[i].DEL_PROVINCE;
							item.addressDetail.zip = formatter.maskZip(oData.results[i].DEL_POSTAL_CODE);
							item.phone = formatter.maskPhone(oData.results[i].DEL_PHONE_NUMBER);
							item.address = formatter.addresses(item.addressDetail);

							items.push(item);

						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListPageOfProgramDelLocMessages: function (oFilter, skip, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			bModel.read("/ProgramDeliveryLocationLangSet", {
				urlParameters: {
					//"$expand": "to_messages",
					"$skip": skip,
					"$top": 1000
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						// var messages = null;
						var iObject = null;

						for (var i = 0; i < oData.results.length; i++) {
							iObject = oData.results[i];
							item = {};
							item.selected = false;
							item.isNew = false;
							item.isValid = iObject.VALID;
							item.objectKey = iObject.OBJECT_KEY;
							item.currentVendor = iObject.VENDOR_ID;
							item.isNew = false;
							item.key = iObject.DEL_LOCATION_ID;
							item.name = iObject.DEL_LOCATION_NAME;

							item.addressDetail = {};
							item.addressDetail.line1 = iObject.DEL_ADDRESS1;
							item.addressDetail.line2 = iObject.DEL_ADDRESS2;
							item.addressDetail.city = iObject.DEL_CITY;
							item.addressDetail.province = iObject.DEL_PROVINCE;
							item.addressDetail.zip = formatter.maskZip(iObject.DEL_POSTAL_CODE);
							item.phone = formatter.maskPhone(iObject.DEL_PHONE_NUMBER);
							item.address = formatter.addresses(item.addressDetail);

							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.to_messages = iObject.to_messages;
							// item.messages = [];
							// if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
							// 	for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
							// 		item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
							// 	}
							// }

							items.push(item);

						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListProgramDelLocMessages: function (programUUId, onlyValid, vendorId, callback) {
			var that = this;
			var items = [];

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());
			oFilter[2] = new sap.ui.model.Filter("VENDOR_ID", sap.ui.model.FilterOperator.EQ, vendorId);

			if (onlyValid) {
				oFilter[3] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");
			}

			function processPages(retItems) {
				if (!!retItems && retItems.length > 0) {
					items = items.concat(retItems);
					that.getListPageOfProgramDelLocMessages(oFilter, items.length, processPages);
				} else {
					// return 
					callback(items);
				}
			}

			that.getListPageOfProgramDelLocMessages(oFilter, 0, processPages);
		},

		getListProgramPriorPur: function (programUUId, includeValid, callback) {
			var isFrench = this.isFrench();
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);

			if (includeValid) {
				oFilter[1] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");

			}

			bModel.read("/ProgramPriorPurchaseSet", {
				// urlParameters: {
				// 	"$inlinecount": "allpages"
				// },
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						for (var i = 0; i < oData.results.length; i++) {
							item = {};
							item.selected = false;
							item.isNew = false;
							item.programId = oData.results[i].PROGRAM_ID;
							item.objectKey = oData.results[i].OBJECT_KEY;
							item.isValid = oData.results[i].VALID;

							item.dealerId = oData.results[i].DEALER_CODE;
							item.dealerId_s = oData.results[i].DEALER_CODE_S;
							item.partId = oData.results[i].PART_NUM;
							item.purchases = oData.results[i].PRIOR_PURCHASES;

							if (isFrench) {
								item.partDesc = oData.results[i].FR_PART_DESC;
								item.dealerName = oData.results[i].FR_DEALER_DESC;
							} else {
								item.partDesc = oData.results[i].EN_PART_DESC;
								item.dealerName = oData.results[i].EN_DEALER_DESC;
							}
							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getListProgramPriorPurMessages: function (programUUId, onlyValid, callback) {
			var isFrench = this.isFrench();
			var bModel = this.getBookingOdataV2Model();
			var items = [];
			var item = null;

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, programUUId);
			oFilter[1] = new sap.ui.model.Filter("LANGUAGE_KEY", sap.ui.model.FilterOperator.EQ, this.getCurrentLanguageKey());

			if (onlyValid) {
				oFilter[2] = new sap.ui.model.Filter("VALID", sap.ui.model.FilterOperator.EQ, "X");

			}

			bModel.read("/ProgramPriorPurchaseLangSet", {
				urlParameters: {
					// "$inlinecount": "allpages",
					"$expand": "to_messages"
				},
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						var messages = null;
						var iObject = null;

						for (var i = 0; i < oData.results.length; i++) {
							iObject = oData.results[i];
							item = {};
							item.selected = false;
							item.isNew = false;
							item.programId = iObject.PROGRAM_ID;
							item.objectKey = iObject.OBJECT_KEY;
							item.isValid = iObject.VALID;

							item.dealerId = iObject.DEALER_CODE;
							item.dealerId_s = iObject.DEALER_CODE_S;
							item.partId = iObject.PART_NUM;
							item.purchases = iObject.PRIOR_PURCHASES;

							item.partDesc = iObject.PART_DESC;
							item.dealerName = iObject.DEALER_DESC;

							if (!!iObject.VALID && iObject.VALID === "X") {
								item.hasError = false;
							} else {
								item.hasError = true;
							}
							item.messages = [];
							if (!!iObject.to_messages && !!iObject.to_messages.results && !!iObject.to_messages.results.length > 0) {
								for (var ix = 0; ix < iObject.to_messages.results.length; ix++) {
									item.messages.push(iObject.to_messages.results[ix].ERROR_DESC);
								}
							}

							items.push(item);
						}
						callback(items);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getProgramParts: function (objectKey, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramPartSet", {
				"OBJECT_KEY": objectKey
			});

			bModel.read(dKey, {
				success: function (oData, oResponse) {
					var reObj = {};
					reObj.isNew = false;
					reObj.isValid = oData.VALID;
					reObj.objectKey = oData.OBJECT_KEY;
					reObj.vendorId = oData.VENDOR_ID;
					reObj.categoryId = oData.CATEGORY_ID;
					reObj.partId = oData.PART_NUM;
					reObj.details = oData.DETAIL;
					if (that.isFrench()) {
						reObj.partDesc = oData.FR_DESC;
						reObj.vendorName = oData.FR_VENDOR_DESC;
						reObj.categoryName = oData.FR_CATEGORY_DESC;
					} else {
						reObj.partDesc = oData.EN_DESC;
						reObj.vendorName = oData.EN_VENDOR_DESC;
						reObj.categoryName = oData.EN_CATEGORY_DESC;
					}
					callback(reObj);
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getProgramPriorPurcahse: function (objectKey, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramPriorPurchaseSet", {
				"OBJECT_KEY": objectKey
			});

			bModel.read(dKey, {
				success: function (oData, oResponse) {
					var reObj = {};

					reObj.objectKey = oData.OBJECT_KEY;
					reObj.programUUId = oData.PROGRAM_UUID;
					reObj.isValid = oData.VALID;
					reObj.dealerId = oData.DEALER_CODE;
					reObj.dealerId_s = oData.DEALER_CODE_S;
					reObj.partId = oData.PART_NUM;
					reObj.purchases = oData.PRIOR_PURCHASES;

					if (that.isFrench()) {
						reObj.partDesc = oData.FR_PART_DESC;
						reObj.dealerName = oData.FR_DEALER_DESC;
					} else {
						reObj.partDesc = oData.EN_PART_DESC;
						reObj.dealerName = oData.EN_DEALER_DESC;
					}

					callback(reObj);
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getProgramDeliveryMethod: function (objectKey, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramDeliveryMethodSet", {
				"OBJECT_KEY": objectKey
			});

			bModel.read(dKey, {
				success: function (oData, oResponse) {
					var reObj = {};
					reObj.objectKey = oData.OBJECT_KEY;
					reObj.isValid = oData.VALID;
					reObj.vendorId = oData.VENDOR_ID;
					reObj.categoryId = oData.CATEGORY_ID;
					reObj.dmId = oData.DEL_METHOD;

					if (that.isFrench()) {
						reObj.dmName = oData.FR_DEL_M_NAME;
						reObj.vendorName = oData.FR_VENDOR_DESC;
						reObj.categoryName = oData.FR_CATEGORY_DESC;
					} else {
						reObj.dmName = oData.EN_DEL_M_NAME;
						reObj.vendorName = oData.EN_VENDOR_DESC;
						reObj.categoryName = oData.EN_CATEGORY_DESC;
					}
					callback(reObj);
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		updateProgramCategory: function (programId, department, categoryId, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramCategory", {
				"PROGRAM_ID": programId,
				"DEPART": department,
				"CATEGORY_ID": categoryId
			});
			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.update(dKey, obj, {
				success: function (oData, oResponse) {
					callback(categoryId, true);
				},
				error: function (err) {
					callback(categoryId, false);
				}
			});
		},
		updateProgramCategoryNew: function (objectKey, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramCategorySet", {
				"OBJECT_KEY": objectKey
			});
			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();

			bModel.create("/programCategoryUpdate", obj, {
				success: function (oData, oResponse) {
					if (oData.programCategoryUpdate.HTTP_STATUS_CODE === "552" || oData.programCategoryUpdate.HTTP_STATUS_CODE === 552) {
						MessageBox.error(resourceBundle.getText(oData.programCategoryUpdate.ERROR_MESSAGE));
						callback(objectKey, false);
					} else if (oData.programCategoryUpdate.HTTP_STATUS_CODE === "554" || oData.programCategoryUpdate.HTTP_STATUS_CODE === 554) {
						MessageBox.error(resourceBundle.getText(oData.programCategoryUpdate.ERROR_MESSAGE));
						callback(objectKey, false);
					} else {
						callback(objectKey, true);
					}

				},
				error: function (err) {
					var code = JSON.parse(err.responseText).error.message.value;
					MessageBox.error(code);
					callback(objectKey, false);
				}
			});
		},

		updateProgramVendor: function (todoList, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();
			var arr = todoList[0];

			var dKey = bModel.createKey("/ProgramVendorSet", {
				"OBJECT_KEY": arr.OBJECT_KEY
			});

			var obj = {};
			obj.OBJECT_KEY = arr.OBJECT_KEY;
			obj.PROGRAM_UUID = arr.PROGRAM_UUID;
			obj.VENDOR_ID = arr.VENDOR_ID;
			obj.VALID = arr.VALID;
			obj.BATCH_MODE = "";
			obj.ERROR_CODES = "";
			obj.EN_DESC = "";
			obj.FR_DESC = "";
			obj.DISTRIBUTOR = arr.DISTRIBUTOR;
			obj.CHANGED_BY = that.getUserId();

			bModel.create("/programVendorUpdate", obj, {
				success: function (oData, oResponse) {
					callback(arr.OBJECT_KEY, true);
				},
				error: function (err) {
					var code = JSON.parse(err.responseText).error.message.value;
					MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code));
					callback(arr.OBJECT_KEY, false);
				}
			});
		},

		updateProgramVendorNew: function (objectKey, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();
			var that = this;
			var obj = {};
			var errorCodes = [];

			//MiniProgramVendorInputType

			// var dKey = bModel.createKey("/MiniProgramVendorInput", {
			// 	"ProgramUid": inObj.PROGRAM_UUID,
			// 	"Language": this.getCurrentLanguageKey()
			// });
			//MiniProgramVendorSet  ProgramVendorSet
			var dKey = bModel.createKey("/MiniProgramVendorSet", {
				"OBJECT_KEY": objectKey
			});
			// var obj = inObj;
			// obj.CHANGED_BY = this.getUserId();

			// bModel.update(dKey, obj, {
			// 	success: function (oData, oResponse) {
			// 		callback(objectKey, true);
			// 	},
			// 	error: function (err) {
			// 		var code = JSON.parse(err.responseText).error.message.value;
			// 		MessageBox.error(code);
			// 		callback(objectKey, false);
			// 	}
			// });
			// if (inObj.isDuplicated) {
			// 	errorCodes.push('BP01036');
			// }
			obj.PROGRAM_UUID = inObj.PROGRAM_UUID;
			obj.VENDOR_ID = inObj.VENDOR_ID;
			obj.DISTRIBUTOR = inObj.DISTRIBUTOR;
			obj.BATCH_MODE = "X";
			obj.EN_DESC = "";
			obj.FR_DESC = "";
			obj.VALID = "";
			obj.ERROR_CODES = "";
			this.getValidVendor(inObj.VENDOR_ID, function (vendorObj) {

				if (!!vendorObj) {
					obj.EN_DESC = vendorObj.SupplierName;
					obj.FR_DESC = vendorObj.SupplierName_fr;
				} else {
					errorCodes.push('BP01035');
				}
				if (errorCodes.length > 0) {
					obj.VALID = "";
					obj.ERROR_CODES = errorCodes.join();
				} else {
					obj.VALID = "X";
					obj.ERROR_CODES = "";
				}
				obj.CHANGED_BY = that.getUserId();
				bModel.update(dKey, obj, {
					success: function (oData, oResponse) {
						callback(oData, true);
					},
					error: function (err) {
						callback(obj, false);
					}
				});
			});
		},

		createProgramCategory: function (index, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.create("/programCategoryCreate", obj, {
				success: function (oData, oResponse) {
					callback(index, oData, true);
				},
				error: function (err) {
					callback(index, obj, false);
				}
			});
		},

		readBookingProgramStatus: function (inObj, callback) {
			var bModel = this.getBookingOdataV2Model();
			var aFilters = [];
			aFilters[0] = new sap.ui.model.Filter("PROGRAM_UUID", sap.ui.model.FilterOperator.EQ, inObj);
			//aFilters[1] = new sap.ui.model.Filter("DEALER_CODE", sap.ui.model.FilterOperator.EQ, inObj);

			bModel.read("/DealerBookingStatusSet", {
				filters: aFilters,
				success: function (oData, oResponse) {
					callback(oData, true);
				},
				error: function (err) {
					callback(err, false);
				}
			});
		},

		confirmBookingProgram: function (inObj, confirmed, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			if (confirmed) {
				obj.B_STATUS = "AT";
			} else {
				obj.B_STATUS = "DT";
			}
			obj.CREATED_BY = this.getUserId();
			//bModel.create("/DealerBookingStatusInput/Execute", obj, {
			bModel.create("/bookingProgramStatusCreate", obj, {
				success: function (oData, oResponse) {
					callback(oData, true);
				},
				error: function (err) {
					callback(obj, false);
				}
			});
		},

		createDealerBookingStatus: function (inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			//bModel.create("/DealerBookingStatusSet", obj, {
			bModel.create("/bookingProgramStatusCreate", obj, {
				success: function (oData, oResponse) {
					callback(oData, true);
				},
				error: function (err) {
					callback(obj, false);
				}
			});
		},

		deleteProgramCategory: function (objectKey, callback) {
			var bModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();

			var dKey = bModel.createKey("/ProgramCategorySet", {
				"OBJECT_KEY": objectKey
			});
			//bModel.remove(dKey, {
			bModel.callFunction("/programCategoryDelete", {
				method: "POST",
				urlParameters: {
					"OBJECT_KEY": objectKey
				},
				success: function (oData, oResponse) {
					if (oData.programCategoryDelete.HTTP_STATUS_CODE === "552" || oData.programCategoryDelete.HTTP_STATUS_CODE === 552) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programCategoryDelete.ERROR_MESSAGE));
						callback(objectKey, false);
					} else if (oData.programCategoryDelete.HTTP_STATUS_CODE === "556" || oData.programCategoryDelete.HTTP_STATUS_CODE === 556) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programCategoryDelete.ERROR_MESSAGE));
						callback(objectKey, false);
					} else {
						callback(objectKey, true);
					}
				},
				error: function (err) {
					var code = JSON.parse(err.responseText).error.message.value;
					MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code));
					callback(objectKey, false);
				}
			});
		},

		deleteProgramCategoryAll: function (programUUID, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramCategoryDeleteAll", {
				"PROGRAM_UUID": programUUID
			});
			bModel.remove(dKey, {
				success: function (oData, oResponse) {
					callback(programUUID, true);
				},
				error: function (err) {
					if (err.statusCode === "404" || err.statusCode === 404) {
						callback(programUUID, true);
					} else {
						callback(programUUID, false);
					}
				}
			});
		},

		deleteProgramVendor: function (objectKey, callback) {
			var bModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();

			var dKey = bModel.createKey("/ProgramVendorSet", {
				"OBJECT_KEY": objectKey
			});
			bModel.callFunction("/programVendorDelete", {
				method: "POST",
				urlParameters: {
					"OBJECT_KEY": objectKey
				},
				success: function (oData, oResponse) {
					if (oData.programVendorDelete.HTTP_STATUS_CODE === "552" || oData.programVendorDelete.HTTP_STATUS_CODE === 552) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programVendorDelete.ERROR_MESSAGE));
						callback(objectKey, false);
					} else if (oData.programVendorDelete.HTTP_STATUS_CODE === "556" || oData.programVendorDelete.HTTP_STATUS_CODE === 556) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programVendorDelete.ERROR_MESSAGE));
						callback(objectKey, false);
					} else {
						callback(objectKey, true);
					}

				},
				error: function (err) {
					var code = JSON.parse(err.responseText).error.message.value;
					MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code));
					callback(objectKey, false);
				}
			});
		},

		createProgramVendorInBatch: function (index, inObj, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			var obj = {};
			var errorCodes = [];
			if (inObj.isDuplicated) {
				errorCodes.push('BP01036');
			}
			obj.PROGRAM_UUID = inObj.PROGRAM_UUID;
			obj.VENDOR_ID = inObj.VENDOR_ID;
			obj.DISTRIBUTOR = inObj.DISTRIBUTOR;
			obj.BATCH_MODE = "X";
			obj.EN_DESC = "";
			obj.FR_DESC = "";
			obj.VALID = "";
			obj.ERROR_CODES = "";
			this.getValidVendor(inObj.VENDOR_ID, function (vendorObj) {

				if (!!vendorObj) {
					obj.EN_DESC = vendorObj.SupplierName;
					obj.FR_DESC = vendorObj.SupplierName_fr;
				} else {
					errorCodes.push('BP01035');
				}
				if (errorCodes.length > 0) {
					obj.VALID = "";
					obj.ERROR_CODES = errorCodes.join();
				} else {
					obj.VALID = "X";
					obj.ERROR_CODES = "";
				}
				obj.CHANGED_BY = that.getUserId();
				bModel.create("/ProgramVendorSet/" + 0 + "/BookingProgram.programVendorCreate", obj, {
					success: function (oData, oResponse) {
						if (oData.value.HTTP_STATUS_CODE === "551" || oData.value.HTTP_STATUS_CODE === 551) {
							MessageBox.error(resourceBundle.getText("Message.error.vendor.exist", [iKey,
								oItem.desc
							]));
						} else if (oData.value.HTTP_STATUS_CODE === "552" || oData.value.HTTP_STATUS_CODE === 552) {
							MessageBox.error(resourceBundle.getText("Message.error.programid.empty"));
						} else {
							callback(index, oData, true);
						}
					},
					error: function (err) {
						callback(index, obj, false);
					}
				});
			});
		},

		createProgramVendor: function (index, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.create("/ProgramVendorSet/" + 0 + "/BookingProgram.programVendorCreate", obj, {
				success: function (oData, oResponse) {
					callback(index, oData, true);
				},
				error: function (err) {
					callback(index, obj, false);
				}
			});
		},

		deleteProgramVendorAll: function (programUUID, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramVendorAll", {
				"PROGRAM_UUID": programUUID
			});
			bModel.remove(dKey, {
				success: function (oData, oResponse) {
					callback(programUUID, true);
				},
				error: function (err) {
					if (err.statusCode === "404" || err.statusCode === 404) {
						callback(programUUID, true);
					} else {
						callback(programUUID, false);
					}
				}
			});
		},

		deleteProgramDeliveryMethod: function (ids, callback) {
			var bModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();

			var dKey = bModel.createKey("/ProgramDeliveryMethodSet", {
				"OBJECT_KEY": ids[0]
			});
			bModel.callFunction("/programDeliveryMethodDelete", {
				method: "POST",
				urlParameters: {
					"OBJECT_KEY": ids[0]
				},
				success: function (oData, oResponse) {
					if (oData.programDeliveryMethodDelete.HTTP_STATUS_CODE === "552" || oData.programDeliveryMethodDelete.HTTP_STATUS_CODE === 552) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programDeliveryMethodDelete.ERROR_MESSAGE));
						callback(ids, false);
					} else if (oData.programDeliveryMethodDelete.HTTP_STATUS_CODE === "556" || oData.programDeliveryMethodDelete.HTTP_STATUS_CODE === 556) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programDeliveryMethodDelete.ERROR_MESSAGE));
						callback(ids, false);
					} else {
						callback(ids, true);
					}
				},
				error: function (err) {
					var code = JSON.parse(err.responseText).error.message.value;
					MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code));
					callback(ids, false);
				}
			});
		},

		createProgramDeliveryMethod: function (index, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.create("/ProgramDeliveryMethodSet/" + 0 + "/BookingProgram.programDeliveryMethodCreate", obj, {
				success: function (oData, oResponse) {
					callback(index, oData, true);
				},
				error: function (err) {
					callback(index, obj, false);
				}
			});
		},

		deleteProgramDeliveryMethodAll: function (programUUID, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramDeliveryMethodAll", {
				"PROGRAM_UUID": programUUID
			});
			bModel.remove(dKey, {
				success: function (oData, oResponse) {
					callback(programUUID, true);
				},
				error: function (err) {
					if (err.statusCode === "404" || err.statusCode === 404) {
						callback(programUUID, true);
					} else {
						callback(programUUID, false);
					}
				}
			});
		},

		deleteProgramParts: function (ids, callback) {
			var bModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();

			var dKey = bModel.createKey("/ProgramPartSet", {
				"OBJECT_KEY": ids[0]
			});
			bModel.callFunction("/programPartDelete", {
				method: "POST",
				urlParameters: {
					"OBJECT_KEY": ids[0]
				},
				success: function (oData, oResponse) {
					if (oData.programPartDelete.HTTP_STATUS_CODE === "552" || oData.programPartDelete.HTTP_STATUS_CODE === 552) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programPartDelete.ERROR_MESSAGE));
						callback(ids, false);
					} else if (oData.programPartDelete.HTTP_STATUS_CODE === "556" || oData.programPartDelete.HTTP_STATUS_CODE === 556) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programPartDelete.ERROR_MESSAGE));
						callback(ids, false);
					} else {
						callback(ids, true);
					}
				},
				error: function (err) {
					var code = JSON.parse(err.responseText).error.message.value;
					MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code));
					callback(ids, false);
				}
			});
		},

		deleteProgramPartFitment: function (ids, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramPartFitmentSet", {
				"OBJECT_KEY": ids[0]
			});
			bModel.callFunction("/programPartFitmentDelete", {
				method: "POST",
				urlParameters: {
					"OBJECT_KEY": ids[0]
				},
				success: function (oData, oResponse) {
					if (oData.programPartFitmentDelete.HTTP_STATUS_CODE === "552" || oData.programPartFitmentDelete.HTTP_STATUS_CODE === 552) {
						callback(ids, false);
					} else {
						callback(ids, true);
					}

				},
				error: function (err) {
					callback(ids, false);
				}
			});
		},

		createProgramParts: function (index, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.create("/ProgramPartSet/" + 0 + "/BookingProgram.programPartCreate", obj, {
				success: function (oData, oResponse) {
					console.log(oData);
					console.log(oData.value);
					callback(index, oData.value, true);

				},
				error: function (err) {
					callback(index, obj, false);
				}
			});
		},

		createProgramPartsInBatch: function (index, inObj, callback) {
			var that = this;
			var bModel = this.getBookingOdataV2Model();
			inObj.BATCH_MODE = 'X';
			inObj.EN_DESC = "";
			inObj.FR_DESC = "";
			inObj.VALID = 'X';
			inObj.ERROR_CODES = '';
			if (!!inObj.duplicated) { // should not waste time 
				inObj.VALID = '';
				inObj.ERROR_CODES = 'BP01046';
				that.createProgramParts(index, inObj, callback);
			} else {
				this.getValidPartInfoWithVendor(inObj.PART_NUM, inObj.VENDOR_ID, inObj.CATEGORY_ID, function (partObj) {
					if (!!partObj) {
						inObj.VALID = 'X';
						inObj.ERROR_CODES = '';
						inObj.EN_DESC = partObj.Description;
						inObj.FR_DESC = partObj.Description;
						that.getTireSize(partObj.MaterialNumber, function (tireSize) {
							if (!!tireSize) {
								inObj.DETAIL = tireSize;
							} else {
								inObj.DETAIL = "";
							}
							that.createProgramParts(index, inObj, callback);
						});
					} else {
						inObj.VALID = '';
						inObj.ERROR_CODES = 'BP01045';
						that.createProgramParts(index, inObj, callback);
					}
				});
			}
		},

		createProgramPartFitment: function (index, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.create("/ProgramPartFitmentSet/" + 0 + "/BookingProgram.programPartFitmentCreate", obj, {
				success: function (oData, oResponse) {
					// callback(index, oData, true);
					callback(index, oData.value, true);
				},
				error: function (err) {
					callback(index, obj, false);
				}
			});
		},

		createProgramPartFitmentInBatch: function (index, inObj, callback) {
			var that = this;
			var errorCodes = [];
			var bModel = this.getBookingOdataV2Model();
			inObj.BATCH_MODE = 'X';
			inObj.VALID = 'X';
			inObj.ERROR_CODES = '';
			inObj.EN_MODEL_DESC = "";
			inObj.FR_MODEL_DESC = "";
			inObj.EN_PART_DESC = "";
			inObj.FR_PART_DESC = "";
			inObj.BRAND = "";
			inObj.BRAND_NAME = "";

			if (!!inObj.duplicated) {
				errorCodes.push('BP01074');
				that.createProgramPartFitment(index, inObj, callback);
			} else {
				this.getValidModelYears(inObj.MODEL_CODE, function (modelObj) {
					if (!!modelObj) {
						inObj.EN_MODEL_DESC = modelObj.enDesc;
						inObj.FR_MODEL_DESC = modelObj.frDesc;
						inObj.BRAND_NAME = modelObj.Brand;
						if (!!modelObj.Brand && modelObj.Brand === 'LEXUS') {
							inObj.BRAND = '20';
						} else {
							inObj.BRAND = '10';
						}
						if (!!!inObj.YEAR || modelObj.years.indexOf(inObj.YEAR) < 0) {
							errorCodes.push('BP01075');
						}
					} else {
						errorCodes.push('BP01071');
					}

					if (!!errorCodes && errorCodes.length > 0) {
						inObj.VALID = '';
						inObj.ERROR_CODES = errorCodes.join();
					}
					that.createProgramPartFitment(index, inObj, callback);
				});
			}
		},

		getValidModelYears: function (model, callback) {
			var bModel = this.getVehicleCatalogModel();
			var objModel = null;
			var retModel = null;
			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("Model", sap.ui.model.FilterOperator.EQ, model);

			bModel.read("/zc_model", {
				urlParameters: {
					"$expand": "to_modelyear"
				},
				filters: oFilter,

				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && oData.results.length > 0) {
						objModel = oData.results[0];
						retModel = {};
						retModel.Model = objModel.Model;
						retModel.Brand = objModel.Brand;
						retModel.enDesc = objModel.ModelDescriptionEN;
						retModel.frDesc = objModel.ModelDescriptionFR;
						retModel.years = [];
						if (!!objModel && !!objModel.to_modelyear && !!objModel.to_modelyear.results && objModel.to_modelyear.results.length > 0) {
							for (var x = 0; x < objModel.to_modelyear.results.length; x++) {
								retModel.years.push(objModel.to_modelyear.results[x].ModelYear);
							}
						}
					}
					callback(retModel);
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		getValidPartInfoWithVendor: function (partNum, vendorId, category, callback) {
			var bModel = this.getVendorMeterialModel();

			var oFilter = [];
			oFilter[0] = new sap.ui.model.Filter("Category", sap.ui.model.FilterOperator.Contains, category);
			oFilter[1] = new sap.ui.model.Filter("MaterialNumber", sap.ui.model.FilterOperator.EQ, partNum);
			oFilter[2] = new sap.ui.model.Filter("Vendor", sap.ui.model.FilterOperator.EQ, vendorId);

			bModel.read("/zc_vendor_material", {
				// urlParameters: {
				// 	"$inlinecount": "allpages"
				// },
				filters: oFilter,
				success: function (oData, oResponse) {
					if (!!oData && !!oData.results && !!oData.results.length && !!oData.results.length > 0) {
						callback(oData.results[0]);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		},

		deleteProgramPartsAll: function (programUUID, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramPartAll", {
				"PROGRAM_UUID": programUUID
			});
			bModel.remove(dKey, {
				success: function (oData, oResponse) {
					// process sap-message?
					callback(programUUID, true);
				},
				error: function (err) {
					if (err.statusCode === "404" || err.statusCode === 404) {
						callback(programUUID, true);
					} else {
						callback(programUUID, false);
					}
				}
			});
		},

		deleteProgramPartFitmentAll: function (programUUID, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramPartFitmentAll", {
				"PROGRAM_UUID": programUUID
			});
			bModel.remove(dKey, {
				success: function (oData, oResponse) {
					// process sap-message?
					callback(programUUID, true);
				},
				error: function (err) {
					if (err.statusCode === "404" || err.statusCode === 404) {
						callback(programUUID, true);
					} else {
						callback(programUUID, false);
					}
				}
			});
		},

		deleteProgramPriorPur: function (ids, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramPriorPurchaseSet", {
				"OBJECT_KEY": ids[0]
			});
			bModel.callFunction("/programPriorPurchaseMiniDelete",{
				method: "POST",
				urlParameters: {
					"OBJECT_KEY": ids[0]
				},
				success: function (oData, oResponse) {
					// process sap-message?
					callback(ids, true);
				},
				error: function (err) {
					callback(ids, false);
				}
			});
		},

		createProgramPriorPur: function (index, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.create("/ProgramPriorPurchaseSet/" + 0 + "/BookingProgram.programPriorPurchaseMiniCreate", obj, {
				success: function (oData, oResponse) {
					callback(index, oData, true);
				},
				error: function (err) {
					callback(index, obj, false);
				}
			});
		},

		createProgramPriorPurInBatch: function (index, inObj, callback) {
			var that = this;
			var errorCodes = [];
			var bModel = this.getBookingOdataV2Model();
			inObj.BATCH_MODE = 'X';
			inObj.EN_DEALER_DESC = "";
			inObj.FR_DEALER_DESC = "";
			inObj.EN_PART_DESC = "";
			inObj.FR_PART_DESC = "";
			inObj.DEALER_CODE = "";
			inObj.VALID = 'X';
			inObj.ERROR_CODES = '';

			if (!!inObj.duplicated) {
				errorCodes.push('BP01073');
			}

			this.getBusinessPartnersByDealerCode(inObj.DEALER_CODE_S, function (dealerObj) {
				if (!!dealerObj) {
					inObj.DEALER_CODE = dealerObj.BusinessPartner.toString();
					inObj.EN_DESC = dealerObj.OrganizationBPName1;
					inObj.FR_DESC = dealerObj.OrganizationBPName1;
				} else {
					errorCodes.push('BP01072');
				}
				if (!!errorCodes && errorCodes.length > 0) {
					inObj.VALID = '';
					inObj.ERROR_CODES = errorCodes.join();
				}
				that.createProgramPriorPur(index, inObj, callback);
			});

		},

		deleteProgramPriorPurAll: function (programUUID, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramPriorPurchaseAll", {
				"PROGRAM_UUID": programUUID
			});
			bModel.remove(dKey, {
				success: function (oData, oResponse) {
					// process sap-message?
					callback(programUUID, true);
				},
				error: function (err) {
					if (err.statusCode === "404" || err.statusCode === 404) {
						callback(programUUID, true);
					} else {
						callback(programUUID, false);
					}
				}
			});
		},

		deleteProgramDelLoc: function (ids, callback) {
			var bModel = this.getBookingOdataV2Model();
			var resourceBundle = this.getResourceBundle();

			var dKey = bModel.createKey("/ProgramDeliveryLocationSet", {
				"OBJECT_KEY": ids[0]
			});
			bModel.callFunction("/programDeliveryLocationDelete", {
				method: "POST",
				urlParameters: {
					"OBJECT_KEY": ids[0]
				},
				success: function (oData, oResponse) {
					// process sap-message?
					if (oData.programDeliveryLocationDelete.HTTP_STATUS_CODE === "552" || oData.programDeliveryLocationDelete.HTTP_STATUS_CODE === 552) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programDeliveryLocationDelete.ERROR_MESSAGE));
						callback(ids, false);
					} else if (oData.programDeliveryLocationDelete.HTTP_STATUS_CODE === "556" || oData.programDeliveryLocationDelete.HTTP_STATUS_CODE === 556) {
						MessageBox.error(resourceBundle.getText("Message.xsdata.error." + oData.programDeliveryLocationDelete.ERROR_MESSAGE));
						callback(ids, false);
					} else {
						callback(ids, true);
					}
				},
				error: function (err) {
					var code = JSON.parse(err.responseText).error.message.value;
					MessageBox.error(resourceBundle.getText("Message.xsdata.error." + code));

					callback(ids, false);
				}
			});
		},

		createProgramDelLoc: function (index, inObj, callback) {
			var bModel = this.getBookingOdataV2Model();

			var obj = inObj;
			obj.CHANGED_BY = this.getUserId();
			bModel.create("/ProgramDeliveryLocationSet/" + 0 + "/BookingProgram.programDeliveryLocationCreate", obj, {
				success: function (oData, oResponse) {
					callback(index, oData, true);
				},
				error: function (err) {
					callback(index, obj, false);
				}
			});
		},

		deleteProgramDelLocAll: function (programUUID, vendorID, callback) {
			var bModel = this.getBookingOdataV2Model();

			var dKey = bModel.createKey("/ProgramVendorDeliveryLocationAll", {
				"PROGRAM_UUID": programUUID,
				"VENDOR_ID": vendorID
			});
			bModel.remove(dKey, {
				success: function (oData, oResponse) {
					// process sap-message?
					callback(programUUID, true);
				},
				error: function (err) {
					if (err.statusCode === "404" || err.statusCode === 404) {
						callback(programUUID, true);
					} else {
						callback(programUUID, false);
					}
				}
			});
		},

		getPartsDetails: function (partNum, callback) {
			var bModel = this.getProductModel();
			var DraftId = "00000000-0000-0000-0000-000000000000"; // added by ReddyVi - defect #17564
			var dKey = bModel.createKey("/C_Product", {
				"Product": partNum, // partNum.padStart(18, "0")
				"DraftUUID": DraftId,
				"IsActiveEntity": true
			});

			bModel.read(dKey, {
				urlParameters: {
					"$expand": "to_MaterialName"
				},
				success: function (oData, oResponse) {
					if (!!oData && !!oData.to_MaterialName && !!oData.to_MaterialName.results && oData.to_MaterialName.results.length > 0) {
						var reData = {};
						var iData = null;
						for (var i = 0; i < oData.to_MaterialName.results.length; i++) {
							iData = oData.to_MaterialName.results[i];
							if (iData.Language === "EN") {
								reData.enDesc = iData.MaterialName;
							} else if (iData.Language === "FR") {
								reData.frDesc = iData.MaterialName;
							}
						}
						if (!!reData.enDesc) {
							if (!!!reData.frDesc) {
								reData.frDesc = reData.enDesc;
							}
						} else {
							reData.enDesc = reData.frDesc;
						}
						callback(reData);
					} else {
						callback(null);
					}
				},
				error: function (err) {
					callback(null);
				}
			});
		}

	});

});