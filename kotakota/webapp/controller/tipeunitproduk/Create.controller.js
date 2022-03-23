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

        return BaseController.extend("sap.ui.kotakota.controller.tipeunitproduk.Create", {
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
                var ProdukGroup = this.getView().byId("ProdukGroup").getValue();
                if (!ProdukGroup) {
                    ret = 'please fill in the required fields';
                }
                var UnitKategori = this.getView().byId("UnitKategori").getValue();
                if (!UnitKategori) {
                    ret = 'please fill in the required fields';
                }
                var UnitTipe = this.getView().byId("UnitTipe").getValue();
                if (!UnitTipe) {
                    ret = 'please fill in the required fields';
                }
                var JenisMuatanKelas = this.getView().byId("JenisMuatanKelas").getValue();
                if (!JenisMuatanKelas) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var ID = that.getView().byId("ID").getValue();
                var ProdukGroup = that.getView().byId("ProdukGroup").getValue();
                var UnitKategori = that.getView().byId("UnitKategori").getValue();
                var JenisMuatanKelas = that.getView().byId("JenisMuatanKelas").getValue();
                var UnitTipe = that.getView().byId("UnitTipe").getValue();
                var UnitDeskripsi = that.getView().byId("UnitDeskripsi").getValue();
                var GOLTol = that.getView().byId("GOLTol").getValue();
                var GOLLaut = that.getView().byId("GOLLaut").getValue();
                var uom = that.getView().byId("uom").getValue();
                var KapasitasKG = that.getView().byId("KapasitasKG").getValue();
                var KapasitasCBM = that.getView().byId("KapasitasCBM").getValue();
                var DimensiPanjang = that.getView().byId("DimensiPanjang").getValue();
                var DimensiLebar = that.getView().byId("DimensiLebar").getValue();
                var DimensiTinggi = that.getView().byId("DimensiTinggi").getValue();
                var LumpSum = that.getView().byId("LumpSum").getSelectedKey();
                var KM = that.getView().byId("KM").getSelectedKey();
                var KG = that.getView().byId("KG").getSelectedKey();
                var CBM = that.getView().byId("CBM").getSelectedKey();
                var Rate = that.getView().byId("Rate").getSelectedKey();
                var KonversiCBKG = that.getView().byId("KonversiCBKG").getSelectedKey();
                var Active = that.getView().byId("Active").getSelectedKey();

                var post = {
                    "ID": ID,
                    "ProdukGroup": ProdukGroup,
                    "UnitKategori": UnitKategori,
                    "UnitTipe": UnitTipe,
                    "JenisMuatanKelas": JenisMuatanKelas,
                    "UnitDeskripsi": UnitDeskripsi,
                    "GOLTol": GOLTol,
                    "GOLLaut": GOLLaut,
                    "uom": uom,
                    "KapasitasKG": parseFloat(KapasitasKG),
                    "KapasitasCBM": parseFloat(KapasitasCBM),
                    "DimensiPanjang": parseFloat(DimensiPanjang),
                    "DimensiLebar": parseFloat(DimensiLebar),
                    "DimensiTinggi": parseFloat(DimensiTinggi),
                    "LumpSum": parseFloat(LumpSum),
                    "KM": KM,
                    "KG": KG,
                    "CBM": CBM,
                    "Rate": Rate,
                    "KonversiCBKG": KonversiCBKG,
                    "Active": Active
                };
                try {
                    await this.AjaxPostData("TipeUnitProduk", post);
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