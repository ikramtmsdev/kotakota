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

        return BaseController.extend("sap.ui.kotakota.controller.seller.Create", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                var CustomerData = await this.AjaxGetData("Customer");
                var oCustomerModel  = new JSONModel(CustomerData);
                this.getView().byId('PelangganID').setModel(oCustomerModel,'oCustomer');

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
                // var Nama = this.getView().byId("Nama").getValue();
                // if (!Nama) {
                //     ret = 'please fill in the required fields';
                // }
                // var Email = this.getView().byId("Email").getValue();
                // if (!Email) {
                //     ret = 'please fill in the required fields';
                // }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var Active = that.getView().byId("Active").getSelectedKey();
                var PelangganID = that.getView().byId("PelangganID").getSelectedKey();
                var ID = that.getView().byId("ID").getValue();
                var KategoriPenjual = that.getView().byId("KategoriPenjual").getValue();
                var TanggalJadiPenjual = that.getView().byId("TanggalJadiPenjual").getValue();
                if (!TanggalJadiPenjual) {
                    TanggalJadiPenjual = null;
                }
                var DesckripsiPenjual = that.getView().byId("DesckripsiPenjual").getValue();
                var Website = that.getView().byId("Website").getValue();
                var Logo = that.getView().byId("Logo").getValue();
                var LisensiKhusus = that.getView().byId("LisensiKhusus").getValue();
                var NoRek = that.getView().byId("NoRek").getValue();
                var NamaBank = that.getView().byId("NamaBank").getValue();
                var CabangBank = that.getView().byId("CabangBank").getValue();
                var SwiftCode = that.getView().byId("SwiftCode").getValue();
                var NegaraBank = that.getView().byId("NegaraBank").getValue();
                var SellerRating = that.getView().byId("SellerRating").getValue();
                var TidakPuas = that.getView().byId("TidakPuas").getValue();
                var LastAudit = that.getView().byId("LastAudit").getValue();
                if (!LastAudit) {
                    LastAudit = null;
                }
                var AuditNote = that.getView().byId("AuditNote").getValue();
                var PricebookNo = that.getView().byId("PricebookNo").getValue();
                var JumlahKlasifikasi = that.getView().byId("JumlahKlasifikasi").getValue();
                var JumlahKontrak = that.getView().byId("JumlahKontrak").getValue();
                var JumlahPartner = that.getView().byId("JumlahPartner").getValue();
                var TarifFeeTier = that.getView().byId("TarifFeeTier").getValue();

                var post = {
                    "Active": Active,
                    "PelangganID": PelangganID,
                    "ID": ID,
                    "KategoriPenjual": KategoriPenjual,
                    "TanggalJadiPenjual": TanggalJadiPenjual,
                    "DesckripsiPenjual": DesckripsiPenjual,
                    "Website": Website,
                    "Logo": Logo,
                    "LisensiKhusus": LisensiKhusus,
                    "NoRek": NoRek,
                    "NamaBank": NamaBank,
                    "CabangBank": CabangBank,
                    "SwiftCode": SwiftCode,
                    "NegaraBank": NegaraBank,
                    "SellerRating": SellerRating,
                    "TidakPuas": TidakPuas,
                    "LastAudit": LastAudit,
                    "AuditNote": AuditNote,
                    "PricebookNo": PricebookNo,
                    "JumlahKlasifikasi": parseInt(JumlahKlasifikasi),
                    "JumlahKontrak": parseInt(JumlahKontrak),
                    "JumlahPartner": parseInt(JumlahPartner),
                    "TarifFeeTier": TarifFeeTier
                };
                try {
                    await this.AjaxPostData("Seller", post);
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