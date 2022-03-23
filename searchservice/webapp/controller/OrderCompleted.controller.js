sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/library",
    'sap/m/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Controller, JSONModel, MessageToast, MessageBox, Fragment, CoreLibrary, mobileLibrary) {
        "use strict";
        var URLHelper = mobileLibrary.URLHelper;

        return BaseController.extend("sap.ui.searchservice.controller.OrderCompleted", {
            onInit: function () {
                this._oRouter = this.getRouter();
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("OrderCompleted").attachPatternMatched(this._onPatternMatched, this);

               
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var QuoteNo = oArgs.QuoteNo;
                oView = this.getView();

                var odata = {
                    "QuoteNo": QuoteNo
                }
                var oModel = new JSONModel();

                oModel.setData(odata);
                var oView = this.getView();
                oView.setModel(oModel);
                oView.bindElement({
                    path: "/"
                });
            },
            
            onReturnToShopButtonPress: function () {
                //navigates back to home screen
                // this._setLayout("Two");
                // this.getRouter().navTo("TargetApp");
                URLHelper.redirect("https://search.kotakota.id/webapp/", false);

            }
    
        });
    });
