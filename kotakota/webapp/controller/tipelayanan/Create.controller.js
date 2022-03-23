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

        return BaseController.extend("sap.ui.kotakota.controller.tipelayanan.Create", {
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
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
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

                var post = {
                    "ID": ID,
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
                    await this.AjaxPostData("TipeLayanan", post);
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