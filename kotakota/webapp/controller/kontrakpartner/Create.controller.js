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

        return BaseController.extend("sap.ui.kotakota.controller.kontrakpartner.Create", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                //GET Seller
                var dataPenjual = await this.AjaxGetData("Seller");
                var oPenjualModel = new JSONModel(dataPenjual);
                this.getView().byId('PenjualID').setModel(oPenjualModel, 'oPenjual');

                //GET Customer
                var dataCustomer = await this.AjaxGetData("Customer");
                var oPelangganModel = new JSONModel(dataCustomer);
                this.getView().byId('PelangganID').setModel(oPelangganModel, 'oPelanggan');

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
                var PelangganID = this.getView().byId("PelangganID").getValue();
                if (!PelangganID) {
                    ret = 'please fill in the required fields';
                }
                var PenjualID = this.getView().byId("PenjualID").getSelectedKey();
                if (!PenjualID) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var Active = that.getView().byId("Active").getSelectedKey();
                var PelangganID = that.getView().byId("PelangganID").getSelectedKey();
                var PenjualID = that.getView().byId("PenjualID").getSelectedKey();
                var Deskripsi = that.getView().byId("Deskripsi").getValue();
                var FungsiPartner = that.getView().byId("FungsiPartner").getSelectedKey();
                var PartnerNote = that.getView().byId("PartnerNote").getValue();

                var post = {
                    "Active": Active,
                    "PelangganID": PelangganID,
                    "PenjualID": PenjualID,
                    "Deskripsi": Deskripsi,
                    "FungsiPartner": FungsiPartner,
                    "PartnerNote": PartnerNote
                };
                try {
                    await this.AjaxPostData("KontrakPartner", post);
                    MessageToast.show("Create success");
                    window.history.go(-1);

                } catch (error) {
                    MessageBox.error(error.responseJSON.error.message);
                }
                this.getView().setBusy(false);
            },

            onBack: function (oEvent) {
                window.history.go(-1);
            },
        });
    });