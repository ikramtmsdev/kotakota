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

        return BaseController.extend("sap.ui.kotakota.controller.seller.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("SellerDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var Seller = await this.AjaxGetData("Seller/" + ID);
                var oSeller = new JSONModel(Seller);
                this.getView().setModel(oSeller);
                oView.bindElement({
                    path: "/"
                });
                oView.setBusy(false);
            },

            bindingElement: async function () {
                var CustomerData = await this.AjaxGetData("Customer");
                var oCustomerModel  = new JSONModel(CustomerData);
                this.getView().byId('PelangganID').setModel(oCustomerModel,'oCustomer');

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
                this.getView().setBusy(true);
                var that = this;
                var Active = that.getView().byId("Active").getSelectedKey();
                var PelangganID = that.getView().byId("PelangganID").getValue();
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

                var patch = {
                    "Active": Active,
                    "PelangganID": PelangganID,
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
                    await this.AjaxPatchData("Seller/" + ID, patch);
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