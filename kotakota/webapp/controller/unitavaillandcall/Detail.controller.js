sap.ui.define([
    'sap/ui/kotakota/controller/BaseController',
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

        return BaseController.extend("sap.ui.kotakota.controller.unitavaillandcall.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("UnitAvailLandCallDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var UnitAvailLandCall = await this.AjaxGetData("UnitAvailLandCall/" + ID);
                var oUnitAvailLandCall = new JSONModel(UnitAvailLandCall);
                this.getView().setModel(oUnitAvailLandCall);
                oView.bindElement({
                    path: "/"
                });
                oView.setBusy(false);
            },

            bindingElement: async function () {
                //Penjual
                var dataPenjual = await this.AjaxGetData("Seller");
                var oPenjualModel = new JSONModel(dataPenjual);
                this.getView().byId('PenjualID').setModel(oPenjualModel, 'oPenjual');

                //Unit Tipe
                var dataUnit = await this.AjaxGetData("TipeUnitProduk?$filter=ProdukGroup eq 'LNDFRG'");
                var oTipeunitModel = new JSONModel(dataUnit);
                this.getView().byId('UnitTipeID').setModel(oTipeunitModel, 'oUnitTipeId');

                //Pelayaran
                var dataRute = await this.AjaxGetData("RuteData?$filter=TypeAsal ne 'PORT' and TypeTujuan ne 'PORT'");
                var oRuteModel = new JSONModel(dataRute);
                this.getView().byId('RuteID').setModel(oRuteModel, 'oRute');
            },

            onEdit: function (oEvent) {
                this.getView().byId('btnSave').setEnabled(true);
                this.getView().byId('btnCancel').setEnabled(true);

                this.getView().byId('Active').setEditable(true);
                this.getView().byId('IntExtUnit').setEditable(true);
                this.getView().byId('UnitTesedia').setEditable(true);
                this.getView().byId('CbmTersedia').setEditable(true);
                this.getView().byId('KgTersedia').setEditable(true);
            },

            onSave: function (oEvent) {
                var ini = this;
                var valid = this.formValidation();
                if (valid != '') {
                    return MessageToast.show(valid);
                };
                MessageBox.confirm("Are you sure?", {
                    onClose: function (sAction) {
                        if (sAction == "OK") {
                            ini.postData();
                        }
                    }
                });
            },

            formValidation: function () {
                var ret = '';
                return ret
            },

            postData: async function () {
                this.getView().setBusy(true);
                var that = this;
                var ID = that.getView().byId("ID").getValue();
                var Active = that.getView().byId("Active").getSelectedKey();
                var IntExtUnit = that.getView().byId("IntExtUnit").getSelectedKey();
                var UnitTesedia = that.getView().byId("UnitTesedia").getValue();
                var CbmTersedia = that.getView().byId("CbmTersedia").getValue();
                var KgTersedia = that.getView().byId("KgTersedia").getValue();

                var patch = {
                    "Status": Active,
                    "IntExtUnit": IntExtUnit,
                    "UnitTesedia": parseInt(UnitTesedia),
                    "CbmTersedia": parseInt(CbmTersedia),
                    "KgTersedia": parseInt(KgTersedia),
                };
                try {
                    await this.AjaxPatchData("UnitAvailLandCall/" + ID, patch);
                    MessageToast.show("Edit success");
                    window.history.go(-1);

                } catch (error) {
                    MessageBox.error(error.responseJSON.error.message);
                }

                this.getView().setBusy(false);
            },

            onBack: function (oEvent) {
                window.history.go(-1);
            }
        });
    });