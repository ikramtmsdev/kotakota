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

        return BaseController.extend("sap.ui.kotakota.controller.rute.Create", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                //GET LOKASI
                var dataRute = await this.AjaxGetData("ZoneData");
                var oZoneModel  = new JSONModel(dataRute);
                this.getView().byId('RuteFrom').setModel(oZoneModel,'oRuteFrom');
                this.getView().byId('RuteTo').setModel(oZoneModel,'oRuteTo'); 
                
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
                var RuteFrom = this.getView().byId("RuteFrom").getValue();
                if (!RuteFrom) {
                    ret = 'please fill in the required fields';
                }
                var RuteTo = this.getView().byId("RuteTo").getValue();
                if (!RuteTo) {
                    ret = 'please fill in the required fields';
                }
                var RuteName = this.getView().byId("RuteName").getValue();
                if (!RuteName) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var RuteFrom  = that.getView().byId("RuteFrom").getSelectedKey();
                var RuteTo    = that.getView().byId("RuteTo").getSelectedKey();
                var Active    = that.getView().byId("Active").getSelectedKey();
                var RuteType  = that.getView().byId("RuteType").getSelectedKey();                                                                
                var RuteName  = that.getView().byId("RuteName").getValue();
                var Distance  = that.getView().byId("Distance").getValue();
                var RuteGroup = that.getView().byId("RuteGroup").getValue();
                var iNum      = parseInt(Distance);
                var ID        = RuteFrom  + "-" + RuteTo;
                var post = {
                    "ID": ID,
                    "RuteFrom": RuteFrom,
                    "RuteTo": RuteTo,
                    "Active": Active,
                    "RuteType": RuteType,
                    "RuteName": RuteName,
                    "Distance": iNum,
                    "RuteGroup": RuteGroup
                };
                try {
                    await this.AjaxPostData("Rute", post);
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