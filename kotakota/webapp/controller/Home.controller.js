sap.ui.define([
    './BaseController',
    'sap/ui/model/json/JSONModel',
    'sap/ui/Device',
    'sap/ui/kotakota/model/formatter',
	"sap/m/MessageToast",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController, JSONModel, Device, formatter, MessageToast) {
        "use strict";

        return BaseController.extend("sap.ui.kotakota.controller.Home", {
            formatter: formatter,

            onInit: function () {
                var oViewModel = new JSONModel({
                    isPhone: Device.system.phone
                });
                this.setModel(oViewModel, "view");
                Device.media.attachHandler(function (oDevice) {
                    this.getModel("view").setProperty("/isPhone", oDevice.name === "Phone");
                }.bind(this));
                var msg = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy\r\n eirmod.';
			    MessageToast.show(msg);
            }


        });
    });
