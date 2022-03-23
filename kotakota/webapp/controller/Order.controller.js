sap.ui.define([
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
	"sap/m/MessageBox",
	"sap/m/MessageToast",
    'sap/ui/kotakota/model/formatter'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController, JSONModel, Device, MessageBox, MessageToast, formatter) {
        "use strict";

        return BaseController.extend("sap.ui.kotakota.controller.Order", {
            formatter: formatter,

            onInit: function () {
                var oViewModel = new JSONModel({
                    currentUser: "Administrator",
                    lastLogin: new Date(Date.now() - 86400000)
                });

                this.setModel(oViewModel, "view");
                var dataModel = this.getOwnerComponent().getModel("tableData");
			    this.getView().setModel(dataModel, "DataModel");
                var RegisterProduk = this.getOwnerComponent().getModel("RegisterProduk");
			    this.getView().setModel(RegisterProduk, "RegisterProduk");
                MessageBox.alert("The quantity you have reported exceeds the quantity planed.");
            }


        });
    });
