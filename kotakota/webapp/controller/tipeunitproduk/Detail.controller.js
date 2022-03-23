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

        return BaseController.extend("sap.ui.kotakota.controller.tipeunitproduk.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("TipeUnitProdukDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var TipeUnitProduk = await this.AjaxGetData("TipeUnitProduk/" + ID);
                var oTipeUnitProduk = new JSONModel(TipeUnitProduk);
                this.getView().setModel(oTipeUnitProduk);
                oView.bindElement({
                    path: "/"
                });
                oView.setBusy(false);
            },

            bindingElement: async function () {

            },

            onEdit: function (oEvent) {
                this.getView().byId('btnSave').setEnabled(true);
                this.getView().byId('btnCancel').setEnabled(true);
                this.getView().byId('Active').setEditable(true);

                this.getView().byId('UnitDeskripsi').setEditable(true);
                this.getView().byId('GOLTol').setEditable(true);
                this.getView().byId('GOLLaut').setEditable(true);
                this.getView().byId('uom').setEditable(true);
                this.getView().byId('KapasitasKG').setEditable(true);
                this.getView().byId('KapasitasCBM').setEditable(true);
                this.getView().byId('DimensiPanjang').setEditable(true);
                this.getView().byId('DimensiLebar').setEditable(true);
                this.getView().byId('DimensiTinggi').setEditable(true);
                this.getView().byId('LumpSum').setEditable(true);
                this.getView().byId('KM').setEditable(true);
                this.getView().byId('LumpSum').setEditable(true);
                this.getView().byId('KG').setEditable(true);
                this.getView().byId('CBM').setEditable(true);
                this.getView().byId('Rate').setEditable(true);
                this.getView().byId('KonversiCBKG').setEditable(true);
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

                var patch = {
                    "UnitDeskripsi": UnitDeskripsi,
                    "GOLTol": GOLTol,
                    "GOLLaut": GOLLaut,
                    "uom": uom,
                    "KapasitasKG": parseFloat(KapasitasKG),
                    "KapasitasCBM": parseFloat(KapasitasCBM),
                    "DimensiPanjang":parseFloat( DimensiPanjang),
                    "DimensiLebar": parseFloat(DimensiLebar),
                    "DimensiTinggi": parseFloat(DimensiTinggi),
                    "LumpSum": parseFloat(LumpSum),
                    "KM": KM,
                    "KG": KG,
                    "CBM": CBM,
                    "Rate": Rate,
                    "KonversiCBKG": KonversiCBKG,
                    "Active": Active,
                };
                try {
                    await this.AjaxPatchData("TipeUnitProduk/" + ID, patch);
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