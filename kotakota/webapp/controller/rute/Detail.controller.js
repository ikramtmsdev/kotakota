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

        return BaseController.extend("sap.ui.kotakota.controller.rute.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("RuteDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var Rute = await this.AjaxGetData("RuteData/" + ID);
                var oRute = new JSONModel(Rute);
                this.getView().setModel(oRute);
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

                this.getView().byId('RuteType').setEditable(true);
                this.getView().byId('RuteName').setEditable(true);
                this.getView().byId('Distance').setEditable(true);
                this.getView().byId('RuteGroup').setEditable(true);
                this.getView().byId('Active').setEditable(true);
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
                var RuteName = this.getView().byId("RuteName").getValue();
                if (!RuteName) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                this.getView().setBusy(true);
                var that      = this;                
                var ID        = that.getView().byId("ID").getValue();                
                var Active    = that.getView().byId("Active").getSelectedKey();  
                var RuteType  = that.getView().byId("RuteType").getSelectedKey(); 
                var RuteName  = that.getView().byId("RuteName").getValue();             
                var Distance  = that.getView().byId("Distance").getValue();
                var iNum      = parseInt(Distance);
                var RuteGroup = that.getView().byId("RuteGroup").getValue();             
                var urlCall  = "https://apiapps.cfapps.ap11.hana.ondemand.com/catalog/Rute/";   
                var patch = {
                    "Active": Active,                                                            
                    "RuteType": RuteType,
                    "RuteName": RuteName,
                    "Distance": iNum,
                    "RuteGroup": RuteGroup
                };
                try {
                    await this.AjaxPatchData("Rute/" + ID, patch);
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