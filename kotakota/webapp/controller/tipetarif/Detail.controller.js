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

        return BaseController.extend("sap.ui.kotakota.controller.tipetarif.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("TipeTarifDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var TipeTarif = await this.AjaxGetData("TipeTarif/" + ID);
                var oTipeTarif = new JSONModel(TipeTarif);
                this.getView().setModel(oTipeTarif);
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

                // this.getView().byId('Nama').setEditable(true);
                // this.getView().byId('Email').setEditable(true);
                // this.getView().byId('TipePelanggan').setEditable(true);
                // this.getView().byId('TanggalDaftar').setEditable(true);
                // this.getView().byId('Industri').setEditable(true);
                // this.getView().byId('NIB').setEditable(true);
                // this.getView().byId('IdNo').setEditable(true);
                // this.getView().byId('TipeID').setEditable(true);
                // this.getView().byId('Pekerjaan').setEditable(true);
                // this.getView().byId('NoHp').setEditable(true);
                // this.getView().byId('NoTelp').setEditable(true);
                // this.getView().byId('Alamat').setEditable(true);
                // this.getView().byId('KodePos').setEditable(true);
                // this.getView().byId('Active').setEditable(true);
                // this.getView().byId('KodeRef').setEditable(true);
                // this.getView().byId('NamaRek').setEditable(true);
                // this.getView().byId('NoRek').setEditable(true);
                // this.getView().byId('NamaBank').setEditable(true);
                // this.getView().byId('CabangBank').setEditable(true);
                // this.getView().byId('SwiftCode').setEditable(true);
                // this.getView().byId('NegaraBank').setEditable(true);
                // this.getView().byId('NoNpwp').setEditable(true);
                // this.getView().byId('StatusPajak').setEditable(true);
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
                this.getView().setBusy(true);
                var that = this;
                var that = this;
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
                var patch = {
                    "Active": Active,
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
                    await this.AjaxPatchData("TipeTarif/" + ID, patch);
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