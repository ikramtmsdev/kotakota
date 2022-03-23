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

        return BaseController.extend("sap.ui.kotakota.controller.Pricebook.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("PricebookDetail").attachPatternMatched(this._onPatternMatched, this);
                this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var Pricebook = await this.AjaxGetData("Pricebook" + ID);
                var oPricebook = new JSONModel(Pricebook);
                this.getView().setModel(oPricebook);
                oView.bindElement({
                    path: "/"
                });
                oView.setBusy(false);
            },

            bindingElement: async function () {
                var that = this;
                //ProdukGroup
                $.ajax({
                    method: "GET",
                    url: "https://apiapps.cfapps.ap11.hana.ondemand.com/select/ProdukGroup",
                    success: function (data) {
                        var oPenjualModel = new JSONModel(data);
                        that.getView().byId('ProdukGroup').setModel(oPenjualModel, 'oProdukGroup');

                    },
                    error: function (error) {
                        MessageToast.show('Load Layanan Failed');
                    }
                });

                //TipeUnit
                var unitData = await this.AjaxGetData("TipeUnitProduk");
                var oUnitModel = new JSONModel(unitData);
                that.getView().byId('UnitTipeId').setModel(oUnitModel, 'oUnitTipeId');

                //RuteID
                var RuteData = await this.AjaxGetData("Rute");
                var oRuteModel = new JSONModel(RuteData);
                that.getView().byId('RuteID').setModel(oRuteModel, 'oRuteID');

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
                var Active = this.getView().byId("Active").getSelectedKey();
                var PricebookNo = this.getView().byId("PricebookNo").getValue();
                var PenjualID = this.getView().byId("PenjualID").getValue();
                var Klasifikasi = this.getView().byId("Klasifikasi").getValue();
                var ProdukKode = this.getView().byId("ProdukKode").getValue();
                var DomIns = this.getView().byId("DomIns").getSelectedKey();
                var ProdukGroup = this.getView().byId("ProdukGroup").getSelectedKey();
                var UnitTipeId = this.getView().byId("UnitTipeId").getSelectedKey();
                var CekStokTanggal = this.getView().byId("CekStokTanggal").getSelectedKey();
                var CekStokJdwlKapal = this.getView().byId("CekStokJdwlKapal").getSelectedKey();
                var CekStokRute = this.getView().byId("CekStokRute").getSelectedKey();
                var RuteID = this.getView().byId("RuteID").getSelectedKey();
                var Quotation = this.getView().byId("Quotation").getSelectedKey();
                var CekOnCall = this.getView().byId("CekOnCall").getSelectedKey();
                var LokasiID = this.getView().byId("LokasiID").getValue();
                var Pelayaran = this.getView().byId("Pelayaran").getValue();
                var StdKM = this.getView().byId("StdKM").getValue();
                var LumpSum = this.getView().byId("LumpSum").getValue();
                var PerKM = this.getView().byId("PerKM").getValue();
                var PerKG = this.getView().byId("PerKG").getValue();
                var PerCBM = this.getView().byId("PerCBM").getValue();
                var Rate = this.getView().byId("Rate").getValue();
                var TarifCurr = this.getView().byId("TarifCurr").getValue();
                var KonversiCBKG = this.getView().byId("KonversiCBKG").getValue();
                var Min = this.getView().byId("Min").getValue();
                var Max = this.getView().byId("Max").getValue();
                var Terms = this.getView().byId("Terms").getValue();

                var patch = {
                    "Active": Active,
                    "DomIns": DomIns,
                    "ProdukGroup": ProdukGroup,
                    "UnitTipeId": UnitTipeId,
                    "CekStokTanggal": CekStokTanggal,
                    "CekStokJdwlKapal": CekStokJdwlKapal,
                    "CekStokRute": CekStokRute,
                    "Quotation": Quotation,
                    "CekOnCall": CekOnCall,
                    "RuteID": RuteID,
                    "LokasiID": LokasiID,
                    "Pelayaran": Pelayaran,
                    "StdKM": parseFloat(StdKM),
                    "LumpSum": parseFloat(LumpSum),
                    "PerKM": parseFloat(PerKM),
                    "PerKG": parseFloat(PerKG),
                    "PerCBM": parseFloat(PerCBM),
                    "Rate": parseFloat(Rate),
                    "TarifCurr": TarifCurr,
                    "KonversiCBKG": parseFloat(KonversiCBKG),
                    "Min": parseFloat(Min),
                    "Max": parseFloat(Max),
                    "Terms": Terms
                };
                try {
                    await this.AjaxPatchData("Pricebook(PricebookNo='" + PricebookNo + "',PenjualID='" + PenjualID + "',Klasifikasi=" + Klasifikasi + ",ProdukKode='" + ProdukKode + "')", patch);
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