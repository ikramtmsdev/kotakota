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

        return BaseController.extend("sap.ui.kotakota.controller.customer.Create", {
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
                var Nama = this.getView().byId("Nama").getValue();
                if (!Nama) {
                    ret = 'please fill in the required fields';
                }
                var Email = this.getView().byId("Email").getValue();
                if (!Email) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var ID = that.getView().byId("ID").getValue();
                var Active = that.getView().byId("Active").getSelectedKey();
                var Nama = that.getView().byId("Nama").getValue();
                var Email = that.getView().byId("Email").getValue();
                var TipePelanggan = that.getView().byId("TipePelanggan").getSelectedKey();
                var TanggalDaftar = that.getView().byId("TanggalDaftar").getValue();
                if (!TanggalDaftar) {
                    TanggalDaftar = null;
                }
                var Industri = that.getView().byId("Industri").getValue();
                var NIB = that.getView().byId("NIB").getValue();
                var IdNo = that.getView().byId("IdNo").getValue();
                var TipeID = that.getView().byId("TipeID").getValue();
                var Pekerjaan = that.getView().byId("Pekerjaan").getValue();
                var NoHp = that.getView().byId("NoHp").getValue();
                var NoTelp = that.getView().byId("NoTelp").getValue();
                var Alamat = that.getView().byId("Alamat").getValue();
                var KodePos = that.getView().byId("KodePos").getValue();
                var KodeRef = that.getView().byId("KodeRef").getValue();
                var NamaRek = that.getView().byId("NamaRek").getValue();
                var NoRek = that.getView().byId("NoRek").getValue();
                var NamaBank = that.getView().byId("NamaBank").getValue();
                var CabangBank = that.getView().byId("CabangBank").getValue();
                var SwiftCode = that.getView().byId("SwiftCode").getValue();
                var NegaraBank = that.getView().byId("NegaraBank").getValue();
                var NoNpwp = that.getView().byId("NoNpwp").getValue();
                var StatusPajak = that.getView().byId("StatusPajak").getSelectedKey();

                var post = {
                    "ID": ID,
                    "Active": Active,
                    "Nama": Nama,
                    "Email": Email,
                    "TipePelanggan": TipePelanggan,
                    "TanggalDaftar": TanggalDaftar,
                    "Industri": Industri,
                    "NIB": NIB,
                    "IdNo": IdNo,
                    "TipeID": TipeID,
                    "Pekerjaan": Pekerjaan,
                    "NoHp": NoHp,
                    "NoTelp": NoTelp,
                    "Alamat": Alamat,
                    "KodePos": KodePos,
                    "KodeRef": KodeRef,
                    "NamaRek": NamaRek,
                    "NoRek": NoRek,
                    "NamaBank": NamaBank,
                    "CabangBank": CabangBank,
                    "SwiftCode": SwiftCode,
                    "NegaraBank": NegaraBank,
                    "NoNpwp": NoNpwp,
                    "StatusPajak": StatusPajak
                };
                try {
                    await this.AjaxPostData("Customer", post);
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