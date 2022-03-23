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

        return BaseController.extend("sap.ui.kotakota.controller.kontrakpartner.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("KontrakPartnerDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var KontrakPartner = await this.AjaxGetData("KontrakPartner" + ID);
                var oKontrakPartner = new JSONModel(KontrakPartner);
                this.getView().setModel(oKontrakPartner);
                oView.bindElement({
                    path: "/"
                });
                oView.setBusy(false);
            },

            bindingElement: async function () {
                //GET Seller
                var dataPenjual = await this.AjaxGetData("Seller");
                var oPenjualModel = new JSONModel(dataPenjual);
                this.getView().byId('PenjualID').setModel(oPenjualModel, 'oPenjual');

            },

            onEdit: function (oEvent) {
                this.getView().byId('btnSave').setEnabled(true);
                this.getView().byId('btnCancel').setEnabled(true);
                this.getView().byId('Active').setEditable(true);

                this.getView().byId('Deskripsi').setEditable(true);
                this.getView().byId('PartnerNote').setEditable(true);
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
                var that     = this;                
                var PelangganID = that.getView().byId("PelangganID").getValue();
                var Active = that.getView().byId("Active").getSelectedKey();
                var PenjualID = that.getView().byId("PenjualID").getValue();
                var Deskripsi = that.getView().byId("Deskripsi").getValue();
                var PartnerNote = that.getView().byId("PartnerNote").getValue();
                var ID = "(PelangganID='" + PelangganID + "',PenjualID='" + PenjualID + "')";

                var patch = {
                    "Active": Active,
                    "PenjualID": PenjualID,
                    "Deskripsi": Deskripsi,
                    "PartnerNote": PartnerNote
                };
                try {
                    await this.AjaxPatchData("KontrakPartner" + ID, patch);
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