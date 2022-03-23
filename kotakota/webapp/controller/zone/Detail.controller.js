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

        return BaseController.extend("sap.ui.kotakota.controller.zone.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("ZoneDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var Zone = await this.AjaxGetData("ZoneData/" + ID);
                var oZone = new JSONModel(Zone);
                this.getView().setModel(oZone);
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

                this.getView().byId('ZoneDesc').setEditable(true);
                this.getView().byId('Active').setEditable(true);
                this.getView().byId('Address').setEditable(true);
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
                var ID       = that.getView().byId("ID").getValue();                
                var Active   = that.getView().byId("Active").getSelectedKey();                
                var ZoneDesc = that.getView().byId("ZoneDesc").getValue();                        
                var Address = that.getView().byId("Address").getValue();         
                var patch = {
                    "Active": Active,
                    "ZoneDesc": ZoneDesc,
                    "Address": Address
                };
                try {
                    await this.AjaxPatchData("Zone/" + ID, patch);
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