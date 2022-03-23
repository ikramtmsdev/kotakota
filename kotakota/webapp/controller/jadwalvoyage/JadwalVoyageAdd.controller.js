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

        return BaseController.extend("sap.ui.kotakota.controller.jadwalvoyage.JadwalVoyageAdd", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                //Penjual
                var dataRute = await this.AjaxGetData("RuteData?$filter=TypeAsal eq 'PORT' and TypeTujuan eq 'PORT'");
                var oRuteModel = new JSONModel(dataRute);
                this.getView().byId('RuteID').setModel(oRuteModel,'oRute');
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
                var RuteID = this.getView().byId("RuteID").getSelectedKey();
                if (!RuteID) {
                    ret = 'please fill in the required fields';
                }
                var Pelno = this.getView().byId("Pelno").getValue();
                if (!Pelno) {
                    ret = 'please fill in the required fields';
                }
                var Pelname = this.getView().byId("Pelname").getValue();
                if (!Pelname) {
                    ret = 'please fill in the required fields';
                }
                var EtdPol = this.getView().byId("EtdPol").getValue();
                if (!EtdPol) {
                    ret = 'please fill in the required fields';
                }
                var EtaPod = this.getView().byId("EtaPod").getValue();
                if (!EtaPod) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                this.getView().setBusy(true);
                var RuteID  = this.getView().byId("RuteID").getSelectedKey();
                var Pelno   = this.getView().byId("Pelno").getValue();
                var Pelname   = this.getView().byId("Pelname").getValue();
                var Active   = this.getView().byId("Active").getSelectedKey();
                var PelType   = this.getView().byId("PelType").getSelectedKey();
                var NmKapal   = this.getView().byId("NmKapal").getValue();
                var EtdPol   = this.getView().byId("EtdPol").getValue();
                if (!EtdPol) {
                    EtdPol = null;
                }
                var EtaPod   = this.getView().byId("EtaPod").getValue();
                if (!EtaPod) {
                    EtaPod = null;
                }
                var Berth   = this.getView().byId("Berth").getValue();
                if (!Berth) {
                    Berth = null;
                }                
                var SailTime   = this.getView().byId("SailTime").getValue();
                var Status   = this.getView().byId("Status").getSelectedKey();
                var OpDate   = this.getView().byId("OpDate").getValue();
                if (!OpDate) {
                    OpDate = null;
                }                
                var OpTime   = this.getView().byId("OpTime").getValue();
                if (!OpTime) {
                    OpTime = null;
                }                
                var CsDate   = this.getView().byId("CsDate").getValue();
                if (!CsDate) {
                    CsDate = null;
                }                
                var CsTime   = this.getView().byId("CsTime").getValue();
                if (!CsTime) {
                    CsTime = null;
                }                
                var PelStop   = this.getView().byId("PelStop").getValue();
                var PelNote   = this.getView().byId("PelNote").getValue();
                
                var ID     = RuteID +'-' + Pelname + '/' + Pelno;

                var post = {
                    "ID": ID,
                    "RuteID": RuteID,
                    "Pelno": Pelno,
                    "Pelname": Pelname,
                    "Active": Active,
                    "PelType": PelType,
                    "NmKapal": NmKapal,
                    "EtdPol": EtdPol,
                    "EtaPod": EtaPod,
                    "Berth": Berth,
                    "SailTime": parseInt(SailTime),
                    "Status": Status,
                    "OpDate": OpDate,
                    "OpTime": OpTime,
                    "CsDate": CsDate,
                    "CsTime": CsTime,
                    "PelStop": parseInt(PelStop),
                    "PelNote": PelNote
                };
                try {
                    await this.AjaxPostData("Pelayaran", post);
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