sap.ui.define([
		"sap/ui/base/Object",
    	"sap/ui/core/message/Message",
    	"sap/ui/core/MessageType",
    	"sap/m/MessageBox"
	], function (UI5Object, Message, MessageType, MessageBox) {
		"use strict";

		return UI5Object.extend("adasdas.dddd.controller.ErrorHandler", {

			/**
			 * Handles application errors by automatically attaching to the model events and displaying errors when needed.
			 * @class
			 * @param {sap.ui.core.UIComponent} oComponent reference to the app's component
			 * @public
			 * @alias adasdas.dddd.controller.ErrorHandler
			 */
			constructor : function (oComponent) {
				var lvModel = null;
				var that = this;				
				this._oResourceBundle = oComponent.getModel("i18n").getResourceBundle();
				this._oComponent = oComponent;
				
				this._bMessageOpen = false;
				this._sErrorText = this._oResourceBundle.getText("errorText");

				this._oRemoteModelList = [];

				lvModel = oComponent.getModel("API_BUSINESS_PARTNER");
				this._oRemoteModelList.push(lvModel);
				lvModel = oComponent.getModel("MD_PRODUCT_OP_SRV");
				this._oRemoteModelList.push(lvModel);
				lvModel = oComponent.getModel("bookingOdataV2");
				this._oRemoteModelList.push(lvModel);

				lvModel = null;

				for(var i= 0; i < this._oRemoteModelList.length; i++){
					lvModel = this._oRemoteModelList[i];

					lvModel.attachMetadataFailed(function (oEvent) {
						sap.ui.core.BusyIndicator.hide();							
					}, this);

					lvModel.attachRequestFailed(function (oEvent) {
						var oParams = oEvent.getParameters();
						var sCode = 0;
						if (!!oParams.response.statusCode){
							sCode =  Number(oParams.response.statusCode);
						}
						
//							(oParams.response.statusCode !== "404" || oParams.response.statusCode !== 404 || (oParams.response.statusCode === "404" && oParams.response.responseText.indexOf("Cannot POST") === 0))) {
						
						if ( sCode > 400 && sCode !== 404 && sCode < 504 ){
							that._showServiceError(oParams.response);
						}
					}, this);
				}
			},

			/**
			 * Shows a {@link sap.m.MessageBox} when the metadata call has failed.
			 * The user can try to refresh the metadata.
			 * @param {string} sDetails a technical error to be displayed on request
			 * @private
			 */
			_showMetadataError : function (sDetails) {
				MessageBox.error(
					this._sErrorText,
					{
						id : "metadataErrorMessageBox",
						details : sDetails,
						styleClass : this._oComponent.getContentDensityClass(),
						actions : [MessageBox.Action.RETRY, MessageBox.Action.CLOSE],
						onClose : function (sAction) {
							if (sAction === MessageBox.Action.RETRY) {
								this._oModel.refreshMetadata();
							}
						}.bind(this)
					}
				);
			},
			
			/**
			 * Shows a {@link sap.m.MessageBox} when a service call has failed.
			 * Only the first error message will be display.
			 * @param {string} sDetails a technical error to be displayed on request
			 * @private
			 */
			_showServiceError : function (sDetails) {
				if (this._bMessageOpen) {
					return;
				}
				this._bMessageOpen = true;

				var tText = this._sErrorText;
				//var eText = sDetails;
				if (sDetails.statusCode >= 400 && sDetails.statusCode < 550){
					if (!!sDetails.responseText){
						try{
							var errDetail = JSON.parse(sDetails.responseText);
							tText = errDetail.error.code + " : " + errDetail.error.message.value;
							//eText = errDetail;
							
						} catch( err){
							tText = sDetails.responseText;
						}
					}
				}
				
				MessageBox.error(
					tText,
					{
						id : "serviceErrorMessageBox",
						details : sDetails,
						styleClass : this._oComponent.getContentDensityClass(),
						actions : [MessageBox.Action.CLOSE],
						onClose : function () {
							this._bMessageOpen = false;
						}.bind(this)
					}
				);
			}		
		});
	}
);