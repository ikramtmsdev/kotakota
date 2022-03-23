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

        return BaseController.extend("sap.ui.kotakota.controller.unitavailland.UnitAvailLandAdd", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                //Penjual
                var dataPenjual = await this.AjaxGetData("Seller");
                var oPenjualModel = new JSONModel(dataPenjual);
                this.getView().byId('PenjualID').setModel(oPenjualModel, 'oPenjual');

                //Unit Tipe
                var dataUnit = await this.AjaxGetData("TipeUnitProduk?$filter=ProdukGroup eq 'SEAFRG'");
                var oTipeunitModel = new JSONModel(dataUnit);
                this.getView().byId('UnitTipeID').setModel(oTipeunitModel, 'oUnitTipeId');

                //Pelayaran
                var PelayaranData = await this.AjaxGetData("PelayaranData");
                var oPelayaranModel = new JSONModel(PelayaranData);
                this.getView().byId('VoyID').setModel(oPelayaranModel, 'oVoyID');
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
                var PenjualID = this.getView().byId("PenjualID").getSelectedKey();
                if (!PenjualID) {
                    ret = 'please fill in the required fields';
                }
                var UnitTipeID = this.getView().byId("UnitTipeID").getSelectedKey();
                if (!UnitTipeID) {
                    ret = 'please fill in the required fields';
                }
                var VoyID = this.getView().byId("UnitTipeID").getSelectedKey();
                if (!VoyID) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                this.getView().setBusy(true);
                var that = this;
                var Active = that.getView().byId("Active").getSelectedKey();
                var PenjualID = that.getView().byId("PenjualID").getSelectedKey();
                var UnitTipeID = that.getView().byId("UnitTipeID").getSelectedKey();
                var IntExtUnit = that.getView().byId("IntExtUnit").getSelectedKey();
                var VoyID = that.getView().byId("VoyID").getSelectedKey();
                var UnitTesedia = that.getView().byId("UnitTesedia").getValue();
                var UnitTerjual = that.getView().byId("UnitTerjual").getValue();
                var UnitBatal = that.getView().byId("UnitBatal").getValue();
                var CbmTersedia = that.getView().byId("CbmTersedia").getSelectedKey();
                var CbmTerjual = that.getView().byId("CbmTerjual").getValue();
                var CbmBatal = that.getView().byId("CbmBatal").getValue();
                var KgTersedia = that.getView().byId("KgTersedia").getValue();

                var KgTerjual = that.getView().byId("KgTerjual").getValue();
                var KgBatal = that.getView().byId("KgBatal").getValue();

                var ID = PenjualID + UnitTipeID + VoyID

                var post = {
                    "ID": ID,
                    "Status": Active,
                    "PenjualID": PenjualID,
                    "UnitTipeID": UnitTipeID,
                    "IntExtUnit": IntExtUnit,
                    "VoyID": VoyID,
                    "UnitTesedia": parseInt(UnitTesedia),
                    "UnitTerjual": parseInt(UnitTerjual),
                    "UnitBatal": parseInt(UnitBatal),
                    "CbmTersedia": parseInt(CbmTersedia),
                    "CbmTerjual": parseInt(CbmTerjual),
                    "CbmBatal": parseInt(CbmBatal),
                    "KgTersedia": parseInt(KgTersedia),
                    "KgTerjual": parseInt(KgTerjual),
                    "KgBatal": parseInt(KgBatal)
                };
                try {
                    await this.AjaxPostData("UnitAvailSea", post);
                    MessageToast.show("Create success");
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