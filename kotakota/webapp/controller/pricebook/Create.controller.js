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

        return BaseController.extend("sap.ui.kotakota.controller.pricebook.Create", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                var that = this;

                //Penjual
                var PenjualData = await this.AjaxGetData("Seller");
                var oPenjualModel = new JSONModel(PenjualData);
                that.getView().byId('PenjualID').setModel(oPenjualModel, 'oPenjual');


                //ProdukGroup
                $.ajax({
                    method: "GET",
                    url: "https://apiapps.cfapps.ap11.hana.ondemand.com/select/ProdukGroup",
                    success: function (data) {
                        var oPenjualModel = new JSONModel(data);
                        that.getView().byId('ProdukGroup').setModel(oPenjualModel, 'oProdukGroup');

                    },
                    error: function (error) {
                        MessageToast.show('Load Layanan Failed');
                    }
                });

                //TipeUnit
                var unitData = await this.AjaxGetData("TipeUnitProduk");
                var oUnitModel = new JSONModel(unitData);
                that.getView().byId('UnitTipeId').setModel(oUnitModel, 'oUnitTipeId');

                //RuteID
                var RuteData = await this.AjaxGetData("Rute");
                var oRuteModel = new JSONModel(RuteData);
                that.getView().byId('RuteID').setModel(oRuteModel, 'oRuteID');
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
                var PenjualID = this.getView().byId("PenjualID").getValue();
                if (!PenjualID) {
                    ret = 'please fill in the required fields';
                }
                var PricebookNo = this.getView().byId("PricebookNo").getValue();
                if (!PricebookNo) {
                    ret = 'please fill in the required fields';
                }
                var ProdukKode = this.getView().byId("ProdukKode").getValue();
                if (!ProdukKode) {
                    ret = 'please fill in the required fields';
                }
                var Klasifikasi = this.getView().byId("Klasifikasi").getValue();
                if (!Klasifikasi) {
                    ret = 'please fill in the required fields';
                }
                var RuteID = this.getView().byId("RuteID").getValue();
                if (!RuteID) {
                    ret = 'please fill in the required fields';
                }
                var UnitTipeId = this.getView().byId("UnitTipeId").getValue();
                if (!UnitTipeId) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var Active = this.getView().byId("Active").getSelectedKey();
                var PricebookNo = this.getView().byId("PricebookNo").getValue();
                var PenjualID = this.getView().byId("PenjualID").getSelectedKey();
                var Klasifikasi = this.getView().byId("Klasifikasi").getValue();
                var ProdukKode = this.getView().byId("ProdukKode").getValue();
                var DomIns = this.getView().byId("DomIns").getSelectedKey();
                var ProdukGroup = this.getView().byId("ProdukGroup").getSelectedKey();
                var UnitTipeId = this.getView().byId("UnitTipeId").getSelectedKey();
                var CekStokTanggal = this.getView().byId("CekStokTanggal").getSelectedKey();
                var CekStokJdwlKapal = this.getView().byId("CekStokJdwlKapal").getSelectedKey();
                var CekStokRute = this.getView().byId("CekStokRute").getSelectedKey();
                var RuteID = this.getView().byId("RuteID").getSelectedKey();
                var Quotation = this.getView().byId("Quotation").getSelectedKey();
                var CekOnCall = this.getView().byId("CekOnCall").getSelectedKey();
                var LokasiID = this.getView().byId("LokasiID").getValue();
                var Pelayaran = this.getView().byId("Pelayaran").getValue();
                var StdKM = this.getView().byId("StdKM").getValue();
                var LumpSum = this.getView().byId("LumpSum").getValue();
                var PerKM = this.getView().byId("PerKM").getValue();
                var PerKG = this.getView().byId("PerKG").getValue();
                var PerCBM = this.getView().byId("PerCBM").getValue();
                var Rate = this.getView().byId("Rate").getValue();
                var TarifCurr = this.getView().byId("TarifCurr").getValue();
                var KonversiCBKG = this.getView().byId("KonversiCBKG").getValue();
                var Min = this.getView().byId("Min").getValue();
                var Max = this.getView().byId("Max").getValue();
                var Terms = this.getView().byId("Terms").getValue();

                var post = {
                    "Active": Active,
                    "PricebookNo": PricebookNo,
                    "PenjualID": PenjualID,
                    "Klasifikasi": parseInt(Klasifikasi),
                    "ProdukKode": ProdukKode,
                    "DomIns": DomIns,
                    "ProdukGroup": ProdukGroup,
                    "UnitTipeId": UnitTipeId,
                    "CekStokTanggal": CekStokTanggal,
                    "CekStokJdwlKapal": CekStokJdwlKapal,
                    "CekStokRute": CekStokRute,
                    "Quotation": Quotation,
                    "CekOnCall": CekOnCall,
                    "RuteID": RuteID,
                    "LokasiID": LokasiID,
                    "Pelayaran": Pelayaran,
                    "StdKM": parseFloat(StdKM),
                    "LumpSum": parseFloat(LumpSum),
                    "PerKM": parseFloat(PerKM),
                    "PerKG": parseFloat(PerKG),
                    "PerCBM": parseFloat(PerCBM),
                    "Rate": parseFloat(Rate),
                    "TarifCurr": TarifCurr,
                    "KonversiCBKG": parseFloat(KonversiCBKG),
                    "Min": parseFloat(Min),
                    "Max": parseFloat(Max),
                    "Terms": Terms
                };
                try {
                    await this.AjaxPostData("Pricebook", post);
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