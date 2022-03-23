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

        return BaseController.extend("sap.ui.kotakota.controller.registerproduct.RegProductAdd", {
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
                var dataUnit = await this.AjaxGetData("TipeUnitProduk");
                var oTipeunitModel = new JSONModel(dataUnit);
                this.getView().byId('TipeUnit').setModel(oTipeunitModel, 'oTipeUnit');
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
                var TipeUnit = this.getView().byId("TipeUnit").getSelectedKey();
                if (!TipeUnit) {
                    ret = 'please fill in the required fields';
                }
                var TglAvailableFrom = this.getView().byId("TglAvailableFrom").getValue();
                if (!TglAvailableFrom) {
                    ret = 'please fill in the required fields';
                }
                var TglAvailableTo = this.getView().byId("TglAvailableTo").getValue();
                if (!TglAvailableTo) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                this.getView().setBusy(true);
                var that = this;
                var Active = that.getView().byId("Active").getSelectedKey();
                var PenjualID = that.getView().byId("PenjualID").getSelectedKey();
                var TipeUnit = that.getView().byId("TipeUnit").getSelectedKey();
                var Deskripsi = that.getView().byId("Deskripsi").getValue();
                var FungsiPartner = that.getView().byId("FungsiPartner").getSelectedKey();
                var PartnerNote = that.getView().byId("PartnerNote").getValue();

                var post = {
                    "Active": Active,
                    "PenjualID": PenjualID,
                    "TipeUnit": TipeUnit,
                    "Deskripsi": Deskripsi,
                    "FungsiPartner": FungsiPartner,
                    "PartnerNote": PartnerNote
                };
                try {
                    await this.AjaxPostData("RegisterProduk", post);
                    MessageToast.show("Register product success. Creating unit available is in progress...");
                    try {
                        await this.createUnitAvail();
                        MessageToast.show("Unit available created");
                        window.history.go(-1);
                    } catch (error) {
                        MessageBox.error(error.responseJSON.error.message);
                    }

                } catch (error) {
                    MessageBox.error(error.responseJSON.error.message);
                }
                this.getView().setBusy(false);
            },
            createUnitAvail: async function () {
                var that = this;

                var TglAvailableFrom = this.getView().byId("TglAvailableFrom").getValue();
                var TglAvailableTo = this.getView().byId("TglAvailableTo").getValue();
                var start = new Date(TglAvailableFrom);
                var end = new Date(TglAvailableTo);
                var ustart = start.getTime();
                var uend = end.getTime();
                for (var unix = ustart; unix <= uend; unix += 86400000) {
                    var d = new Date(unix);
                    var month = '' + (d.getMonth() + 1),
                        day = '' + d.getDate(),
                        year = d.getFullYear();

                    if (month.length < 2)
                        month = '0' + month;
                    if (day.length < 2)
                        day = '0' + day;

                    var PenjualID = that.getView().byId("PenjualID").getSelectedKey();
                    var TipeUnit = that.getView().byId("TipeUnit").getSelectedKey();
                    var TglAvailable = [year, month, day].join('-');
                    var ID = PenjualID + TipeUnit + year + month + day

                    var post = {
                        "ID": ID,
                        "Status": "Y",
                        "PenjualID": PenjualID,
                        "UnitTipeID": TipeUnit,
                        "TglAvailable": TglAvailable
                    };
                    await this.AjaxPostData("UnitAvailLand", post);
                }
            },
            onBack: function (oEvent) {
                window.history.go(-1);
            }


        });
    });