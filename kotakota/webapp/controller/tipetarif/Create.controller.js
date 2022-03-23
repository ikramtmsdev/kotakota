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

        return BaseController.extend("sap.ui.kotakota.controller.tipetarif.Create", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                
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
                var ID = this.getView().byId("ID").getValue();
                if (!ID) {
                    ret = 'please fill in the required fields';
                }
                var TarifTipe = this.getView().byId("TarifTipe").getValue();
                if (!TarifTipe) {
                    ret = 'please fill in the required fields';
                }
                var NamaTarif = this.getView().byId("NamaTarif").getValue();
                if (!NamaTarif) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var Active = that.getView().byId("Active").getSelectedKey();
                var ID = that.getView().byId("ID").getValue();
                var TarifTipe = that.getView().byId("TarifTipe").getValue();
                var NamaTarif = that.getView().byId("NamaTarif").getValue();
                var TarifDeskripsi = that.getView().byId("TarifDeskripsi").getValue();
                var TarifRate = that.getView().byId("TarifRate").getValue();
                var TarifMin = that.getView().byId("TarifMin").getValue();
                var TarifMax = that.getView().byId("TarifMax").getValue();
                var BerlakuDari = that.getView().byId("BerlakuDari").getValue();
                if (!BerlakuDari) {
                    BerlakuDari = null;
                }
                var BerlakuSampai = that.getView().byId("BerlakuSampai").getValue();
                if (!BerlakuSampai) {
                    BerlakuSampai = null;
                }
                
                var post = {
                    "Active": Active,
                    "ID": ID,
                    "TarifTipe": TarifTipe,
                    "NamaTarif": NamaTarif,
                    "TarifDeskripsi": TarifDeskripsi,
                    "TarifRate": parseFloat(TarifRate),
                    "TarifMin": parseFloat(TarifMin),
                    "TarifMax": parseFloat(TarifMax),
                    "BerlakuDari": BerlakuDari,
                    "BerlakuSampai": BerlakuSampai
                };
                try {
                    await this.AjaxPostData("TipeTarif", post);
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