/* global moment:true */
/* global StringMask:true */
sap.ui.define([], function () {
	"use strict";

	return {
		dealernetTrim:function(value){
			if(value !== null && value !== undefined )
			{
			return parseFloat(value).toFixed(2).toString();
			}
			else
			{
			return '0';	
			}
		},
		vendorDescription: function (value) {

			var unique = value.split(' ').filter(function (item, i, allItems) {
				return i == allItems.indexOf(item);
			}).join(' ');

			return unique;
		},
		dmListFt: function (key, value) {
			if (!!value) {
				return value;
			} else if (!!key) {
				return key;
			} else {
				return "";
			}
		},
		formatYear: function (aYear) {
			var resourceBundle = this.getResourceBundle();
			if (aYear === "ALL") {
				return resourceBundle.getText("Label.All.Model.Years");
			} else {
				return aYear;
			}

		},

		isFrench: function () {
			var lang = sap.ui.getCore().getConfiguration().getLanguage();
			if (!!lang && lang.toLowerCase().startsWith("fr")) {
				return true;
			} else {
				return false;
			}
		},

		categoryFormatter: function (categoryLong) {
			if (!!categoryLong) {
				return categoryLong.substring(0, 9);
			} else {
				return "";
			}
		},

		importSatus: function (status) {
			var resourceBundle = this.getResourceBundle();
			switch (status) {
			case "PD":
				return resourceBundle.getText("Label.status.pending");
			case "FD":
				return resourceBundle.getText("Label.status.failed");
			case "UP":
				return resourceBundle.getText("Label.status.uploaded");
			default:
				return "";
			}
		},

		openPGPeriod: function (openDate, closeDate) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var openS = dateFormat.format(openDate, true);
			var closeS = dateFormat.format(closeDate, true);
			return openS + " - " + closeS;
		},

		partsFilter: function (iKey) {
			var resourceBundle = this.getResourceBundle();
			var rSt = "";
			switch (iKey) {
			case "PPB":
				rSt = resourceBundle.getText("Label.Filter.Parts.PB");
				break;
			case "PPP":
				rSt = resourceBundle.getText("Label.Filter.Parts.PP");
				break;
			case "PCB":
				rSt = resourceBundle.getText("Label.Filter.Parts.CB");
				break;
			case "PNC":
				rSt = resourceBundle.getText("Label.Filter.Parts.NC");
				break;
			}
			return rSt;
		},

		partsDropdownFormatter: function (partId, partDesc) {
			if (!!partId) {
				if (!!partDesc) {
					return partId.replace(/^0+/, "") + " - " + partDesc;

				} else {
					return partId.replace(/^0+/, "");
				}
			} else {
				return "";
			}
		},

		dealerDescFormatter: function (dealerId_l, dealerId_s, dealerDesc) {
			var dealerId = dealerId_s;
			var lv_dealerDesc = "";
			if (!!dealerDesc) {
				lv_dealerDesc = dealerDesc;
			}
			if (!dealerId) {
				dealerId = dealerId_l;
			}
			if (!!dealerId) {
				if (dealerId.length > 5) {
					if (!!lv_dealerDesc) {
						return dealerId.substring(dealerId.length - 5) + " - " + lv_dealerDesc;
					} else {
						return dealerId.substring(dealerId.length - 5);
					}
				} else {
					if (!!lv_dealerDesc) {
						return dealerId + " - " + lv_dealerDesc;
					} else {
						return dealerId;
					}

				}
			} else {
				return "";
			}
		},

		getIniPrograDates: function () {
			var myMomnet = moment(new Date()).add(1, "days");
			var retDates = {};
			retDates.wOpen = myMomnet.toDate();
			retDates.dOpen = myMomnet.toDate();
			myMomnet.add(3, "month");
			retDates.wClose = myMomnet.toDate();
			myMomnet.add(3, "month");
			retDates.dClose = myMomnet.toDate();
			return retDates;
		},

		onlyDate: function (oDate) {
		
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MMMM dd, yyyy"
			});
			var dateFormatted = dateFormat.format(oDate, true); // use UTC date format only
			return dateFormatted;
		},

		longDateTitle: function (sTitle) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MMM YYYY"
			});
			var aDate = new Date();
			if (!!sTitle && sTitle.length >= 6) {
				var month = sTitle.substring(0, 2);
				var year = sTitle.substring(2);
				aDate.setMonth(month - 1);
				aDate.setYear(year);
				return dateFormat.format(aDate);
			} else {
				return "";
			}
		},

		twoLine: function (line2, line1) {
			var oLine1 = !!line1 ? line1 : "";
			var oLine2 = !!line2 ? line2 : "";
			return oLine1 + "<BR/>" + oLine2;
		},

		valueDate: function (oDate) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var dateFormatted = dateFormat.format(oDate, false);
			return dateFormatted;
		},

		valueDateFormat: function (oDate) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "yyyy-MM-dd"
			});
			var dateFormatted = dateFormat.format(oDate, true);
			return dateFormatted;
		},
		valueDateFormatNow: function (oDate) {
			//var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
			//	pattern: "yyyy-MM-dd"
			//});
			if(oDate)
			{
			var dateFormatted = oDate.split("T")[0];
			return dateFormatted;
			}
			else
			{
				return "";
			}
		},
		valueLocalDate: function (oDate) {
			if (!!oDate) {
				return new Date(oDate.getUTCFullYear(), oDate.getUTCMonth(), oDate.getUTCDate(), 0, 0, 0); // force to be EST 
			} else {
				return null;
			}
		},
		valueESTDate: function (oDate) {
			if (!!oDate) {
				return new Date(Date.UTC(oDate.getFullYear(), oDate.getMonth(), oDate.getDate(), 5, 0, 0)); // force to be EST 
			} else {
				return null;
			}
		},

		valueUtcESTDate: function (oDate) {
			if (!!oDate) {
				return new Date(Date.UTC(oDate.getUTCFullYear(), oDate.getUTCMonth(), oDate.getUTCDate(), 5, 0, 0)); // force to be EST 
			} else {
				return null;
			}
		},

		getESTDateNoDST: function (sDate) {
			if (!!sDate) {
				var estOffsetTime = sDate + "T05:00:00";
				var mDT = moment.utc(estOffsetTime);
				return mDT.toDate();
			} else {
				return null;
			}
		},

		formatDateTitleForList: function (dayItem, resourceBundle) {
			//var resourceBundle = this.getResourceBundle();			
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MMM d"
			});
			var index = dayItem.index;
			var mondday = dayItem.idate;
			var mtSunday = moment(mondday).endOf("week").add(1, "days");
			return resourceBundle.getText("Label.Week.Period", [index, dateFormat.format(mondday), dateFormat.format(mtSunday.toDate())]);

		},
		formatDateForList: function (date) {
			return moment.utc(date).format("MM-DD-YYYY");
		},

		maskPhone: function (phone) {
			var formatter = new StringMask("(000) 000-0000");
			return formatter.apply(phone);
		},

		maskZip: function (zip) {
			var formatter = new StringMask("U0U 0U0");
			return formatter.apply(zip);
		},

		addresses1: function (address) {
			if (!!address) {
				return address.value + " " + address.address1 + " " + address.address2 + ", " + address.city + " " + address.province + " " +
					address.zip;
			} else {
				return "";
			}
		},

		addresses2: function (address) {
			if (!!address && !!address.OBJECT_KEY) {
				return address.DEL_LOCATION_NAME + " " + address.DEL_ADDRESS1 + " " + address.DEL_ADDRESS2 + ", " + address.DEL_CITY + " " + address
					.DEL_PROVINCE + " " +
					address.zip;
			} else {
				return "";
			}
		},

		addresses: function (address) {
			return address.line1 + " " + address.line2 + ", " + address.city + " " + address.province + " " + address.zip;
		},

		bookingStatus: function (booking) {
			var resourceBundle = this.getResourceBundle();
			return resourceBundle.getText("Message.close.in.days", [booking.closeInDays]);
		},

		dellocCount: function (count) {
			var resourceBundle = this.getResourceBundle();
			return resourceBundle.getText("Label.Delivery.Location.Vendor.Count", [count]);
		},

		departmentShow: function (key, enDesc, frDesc) {
			if (this.isFrench()) {
				return key + " - " + frDesc;
			} else {
				return key + " - " + enDesc;
			}
		},

		dealerNumber: function (pbNumber) {
			if (!!pbNumber && pbNumber.length > 5) {
				return pbNumber.substring(5);
			}
			return pbNumber;
		},

		categoryList: function (key, desc) {
			if (!!key || !!desc) {
				return key + " --- " + desc;
			} else {
				return "";
			}
		},

		dropdownFormatter: function (key, enDesc, frDesc) {
			if (!!key) {
				if (this.isFrench()) {
					return key + " - " + frDesc;
				} else {
					return key + " - " + enDesc;
				}
			} else {
				return "";
			}
		},

		dropdownFormatterXX: function (key, enDesc, frDesc) {
			if (!!key) {
				if (this.isFrench()) {
					return frDesc;
				} else {
					return enDesc;
				}
			} else {
				return "";
			}
		},

		dmFormatter: function (key, desc) {
			if ("DM00001" === key || "DM00002" === key) {
				return desc;
			} else {
				if (!!key) {
					return key + " - " + desc;
				} else {
					return "";
				}
			}
		},

		dmFormatterXX: function (key, desc) {
			if ("DM00001" === key || "DM00002" === key) {
				return desc;
			} else {
				if (!!key) {
					if (!!desc) {
						return desc;
					} else {
						return key;
					}
				} else {
					return "";
				}
			}
		},

		dmFormatterX: function (key) {
			var resourceBundle = this.getResourceBundle();
			switch (key) {
			case "DM00001":
				return resourceBundle.getText("Delivery.Method.DM000001");
			case "DM00002":
				return resourceBundle.getText("Delivery.Method.DM000002");
			default:
				return key;
			}
		},

		dropdownXFormatter: function (key, enDesc, frDesc) {
			if (!!key) {
				if (this.isFrench()) {
					if ("DM00001" === key || "DM00002" === key) {
						return frDesc;

					} else {
						return key + " - " + frDesc;
					}
				} else {
					if ("DM00001" === key || "DM00002" === key) {
						return enDesc;
					} else {
						return key + " - " + enDesc;
					}
				}
			} else {
				return "";
			}
		},

		dropdownXFormatterXX: function (key, enDesc, frDesc) {
			if (!!key) {
				if (this.isFrench()) {
					if ("DM00001" === key || "DM00002" === key) {
						return frDesc;

					} else {
						return frDesc;
					}
				} else {
					if ("DM00001" === key || "DM00002" === key) {
						return enDesc;
					} else {
						return enDesc;
					}
				}
			} else {
				return "";
			}
		},

		descFormatter: function (key, enDesc, frDesc) {
			if (this.isFrench()) {
				return frDesc;
			} else {
				return enDesc;
			}
		},

		descIdFormatter: function (enDesc, frDesc) {
			if (this.isFrench()) {
				return frDesc;
			} else {
				return enDesc;
			}
		},
		idProgram: function (id) {
			var resourceBundle = this.getResourceBundle();
			return resourceBundle.getText("Label.Booking.Program.ID", [id]);
		},

		provinceName: function (prov) {
			var resourceBundle = this.getResourceBundle();
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
		},

		totalPrograms: function (lines) {
			var resourceBundle = this.getResourceBundle();
			return resourceBundle.getText("Label.Find.Booking.Program.Total", [lines]);
		},

		currencyValue: function (sValue) {
			if (!sValue) {
				return "";
			}

			return parseFloat(sValue).toFixed(2);
		},

		linex1Format: function (typeD, typeB, line, campCode, contCode) {
			var lvline;
			if (!!line) {
				lvline = line.replace(/^0+/, "");
				lvline = ""; // don"t show the line number
			}
			if (!!typeD) {
				if (!!lvline) {
					return lvline + " / " + campCode;
				} else {
					return campCode;
				}
			} else if (!!typeB) {
				if (!!lvline) {
					return lvline + " / " + contCode;
				} else {
					return contCode;
				}

			} else {
				return lvline;
			}
		},

		deliveryDate: function (sValue) {
			return "2018";
		},

		round2dec: function (sValue) {
			try {
				if (!!sValue) {
					return parseFloat(sValue).toFixed(2);
				}

			} catch (err) {

			}
			return 0.00;
		},

		linex2Format: function (typeD, typeB, opCode, vin) {
			if (!!typeD) {
				if (!!opCode) {
					return opCode + " / " + vin;
				} else {
					return vin;
				}
			}
			return "";
		},
		sub2boolean: function (value) {
			if (!!value && "YES" === value.toUpperCase()) {
				return true;
			}
			return false;
		},
		getItemNumber: function (sValue) {
			if (!!sValue) {
				return sValue.replace(/^0+/, "");
			}
			return sValue;
		},
		removeLeadingZero: function (sValue) {
			if (!!sValue) {
				return sValue.replace(/^0+/, "");
			}
			return sValue;
		},

		shortDate: function (oDate) {
			var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
				pattern: "MMM dd, yyyy HH:mm"
			});
			var dateFormatted = dateFormat.format(oDate);
			return dateFormatted;
		},

		getItemTooltip: function (uuid, pUuid) {
			var resourceBundle = this.getResourceBundle();
			return resourceBundle.getText("Message.Draft.Item.Id", [uuid, pUuid]);
		},

		totalLine1: function (lines) {
			var resourceBundle = this.getResourceBundle();
			return resourceBundle.getText("Label.CheckOrder.Totalparts", [lines]);
		},

		totalDraft: function (lines) {
			var resourceBundle = this.getResourceBundle();
			return resourceBundle.getText("Label.FindOrder.Total", [lines]);
		},

		partNumberLabelFormat: function (typeB, typeD) {
			var resourceBundle = this.getResourceBundle();
			if (!!typeB) {
				return resourceBundle.getText("Lable.CreateOrder.ContractNumber");
			} else if (!!typeD) {
				return resourceBundle.getText("Lable.CreateOrder.CampaignNumber");
			}
			return "";
		},

		partDescLabelFormat: function (typeB, typeD) {
			var resourceBundle = this.getResourceBundle();
			if (!!typeD) {
				return resourceBundle.getText("Lable.CreateOrder.OpCodeVin");
			}
			return "";
		},

		departmentNames: function (code) {
			var resourceBundle = this.getResourceBundle();
			switch (code) {
			case "D001":
				return "Parts";
			case "D002":
				return "Service Retention";
			case "D003":
				return "Accessories";
			default:
				return "Unkown";
			}
		},

		programStatus: function (code) {
			var resourceBundle = this.getResourceBundle();
			switch (code) {
			case "FT":
				return resourceBundle.getText("Status.Future");
			case "OP":
				return resourceBundle.getText("Status.Open");
			case "CL":
				return resourceBundle.getText("Status.Closed");
			case "CP":
				return resourceBundle.getText("Status.Completed");
			}
		},

		lineNumberFormat: function (line) {
			if (!!line) {
				return line.substr(-2);
			}
		},

		iconMessageFormat: function (messages) {

			var messageLevel = 0; // non
			var meesageItem = null;
			if (!!messages && !!messages.length) {
				for (var i = 1; i < messages.length; i++) {
					if (!!meesageItem) {
						switch (meesageItem.severity) {
						case "error":
							messageLevel = 3;
							break;
						case "warning":
							if (messageLevel < 2) {
								messageLevel = 2;
							}
							break;
						default:
							if (messageLevel < 1) {
								messageLevel = 1;
							}
							break;
						}
					}
				}
			}

			switch (messageLevel) {
			case 3:
				return "#FC0519";
				//return new sap.ui.core.Icon({src: "sap-icon://e-care", color: "#FC0519" }); 
				//return sap.ui.core.IconPool.getIconURI({src: "sap-icon://e-care", color: "#FC0519" });
			case 2:
				return "#FFDAB9";
				//return new sap.ui.core.Icon({src: "sap-icon://e-care", color: "#2DFA06" }); 
				//return sap.ui.core.IconPool.getIconURI({src: "sap-icon://e-care", color: "#2DFA06" });
				// case 1:
				// 	return sap.ui.core.IconPool.getIconURI({src: "sap-icon://e-care", color: "#2DFA06" });
			default:
				return "#2DFA06";
				//return new sap.ui.core.Icon({src: "sap-icon://e-care", color: "#2DFA06" }); 
				// return sap.ui.core.IconPool.getIconURI({src: "sap-icon://e-care", color: "#2DFA06" });
				//						return "sap-icon://e-care";
			}

		}

	};

});