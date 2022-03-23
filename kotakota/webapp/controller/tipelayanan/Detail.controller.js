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

        return BaseController.extend("sap.ui.kotakota.controller.tipelayanan.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("TipeLayananDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var TipeLayanan = await this.AjaxGetData("TipeLayanan/" + ID);
                var oTipeLayanan = new JSONModel(TipeLayanan);
                this.getView().setModel(oTipeLayanan);
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

                this.getView().byId('DomIns').setEditable(true);
                this.getView().byId('Incoterm').setEditable(true);
                this.getView().byId('NamaLayanan').setEditable(true);
                this.getView().byId('DescLayanan').setEditable(true);
                this.getView().byId('DescBiaya').setEditable(true);
                this.getView().byId('JmlStop').setEditable(true);
                this.getView().byId('DoorToDoor').setEditable(true);
                this.getView().byId('DoorToPol').setEditable(true);
                this.getView().byId('PolToPod').setEditable(true);
                this.getView().byId('PodToDoor').setEditable(true);
                this.getView().byId('StopSatu').setEditable(true);
                this.getView().byId('StopDua').setEditable(true);
                this.getView().byId('Active').setEditable(true);
                this.getView().byId('LchToPol').setEditable(true);
                this.getView().byId('HndToPol').setEditable(true);
                this.getView().byId('LolToPol').setEditable(true);
                this.getView().byId('LchToPod').setEditable(true);
                this.getView().byId('HndToPod').setEditable(true);
                this.getView().byId('LolToPod').setEditable(true);
                this.getView().byId('Insur').setEditable(true);
                this.getView().byId('AddSatu').setEditable(true);
                this.getView().byId('AddDua').setEditable(true);
                this.getView().byId('AddTiga').setEditable(true);
                this.getView().byId('AddEmpat').setEditable(true);
                this.getView().byId('AddLima').setEditable(true);
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
                var Incoterm = that.getView().byId("Incoterm").getValue();
                var NamaLayanan = that.getView().byId("NamaLayanan").getValue();
                var DescLayanan = that.getView().byId("DescLayanan").getValue();
                var DescBiaya = that.getView().byId("DescBiaya").getValue();
                var JmlStop = that.getView().byId("JmlStop").getValue();
                var DoorToDoor = that.getView().byId("DoorToDoor").getValue();
                var DoorToPol = that.getView().byId("DoorToPol").getValue();
                var PolToPod = that.getView().byId("PolToPod").getValue();
                var PodToDoor = that.getView().byId("PodToDoor").getValue();
                var StopSatu = that.getView().byId("StopSatu").getValue();
                var StopDua = that.getView().byId("StopDua").getValue();
                var LchToPol = that.getView().byId("LchToPol").getValue();
                var HndToPol = that.getView().byId("HndToPol").getValue();
                var LolToPol = that.getView().byId("LolToPol").getValue();
                var LchToPod = that.getView().byId("LchToPod").getValue();
                var HndToPod = that.getView().byId("HndToPod").getValue();
                var LolToPod = that.getView().byId("LolToPod").getValue();
                var Insur = that.getView().byId("Insur").getValue();
                var AddSatu = that.getView().byId("AddSatu").getValue();
                var AddDua = that.getView().byId("AddDua").getValue();
                var AddTiga = that.getView().byId("AddTiga").getValue();
                var AddEmpat = that.getView().byId("AddEmpat").getValue();
                var AddLima = that.getView().byId("AddLima").getValue();

                var Active = that.getView().byId("Active").getSelectedKey();
                var DomIns = that.getView().byId("DomIns").getSelectedKey();
                
                var patch = {
                    "Incoterm": Incoterm,
                    "NamaLayanan": NamaLayanan,
                    "DescLayanan": DescLayanan,
                    "DescBiaya": DescBiaya,
                    "JmlStop": parseInt(JmlStop),
                    "DoorToDoor": DoorToDoor,
                    "DoorToPol": DoorToPol,
                    "PolToPod": PolToPod,
                    "PodToDoor": PodToDoor,
                    "StopSatu": StopSatu,
                    "StopDua": StopDua,
                    "LchToPol": LchToPol,
                    "HndToPol": HndToPol,
                    "LolToPol": LolToPol,
                    "LchToPod": LchToPod,
                    "HndToPod": HndToPod,
                    "LolToPod": LolToPod,
                    "Insur": Insur,
                    "AddSatu": AddSatu,
                    "AddDua": AddDua,
                    "AddTiga": AddTiga,
                    "AddEmpat": AddEmpat,
                    "AddLima": AddLima,
                    "Active": Active,
                    "DomIns": DomIns
                };
                try {
                    await this.AjaxPatchData("TipeLayanan/" + ID, patch);
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