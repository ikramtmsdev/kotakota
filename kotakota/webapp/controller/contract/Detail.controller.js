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

        return BaseController.extend("sap.ui.kotakota.controller.jadwalvoyage.Detail", {
            formatter: formatter,

            onInit: async function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("JadwalVoyageDetail").attachPatternMatched(this._onPatternMatched, this);
                await this.bindingElement();
            },

            _onPatternMatched: async function (oEvent) {
                var oArgs, oView;
                oArgs = oEvent.getParameter("arguments");
                var ID = oArgs.id;
                oView = this.getView();
                oView.setBusy(true);
                var Contract = await this.AjaxGetData("Contract/" + ID);
                var oContract = new JSONModel(Contract);
                this.getView().setModel(oContract);
                oView.bindElement({
                    path: "/"
                });
                oView.setBusy(false);
            },

            bindingElement: async function () {
                //GET Seller
                var that = this;
                // var oPenjualID = await this.AjaxGetData("Seller");	   
                // this.getView().byId('PenjualID').setModel(oPenjualID,'oPenjualID'); 

                //produkgroup
                $.ajax({
                    method: "GET",
                    url: "https://apiapps.cfapps.ap11.hana.ondemand.com/select/ProdukGroup",
                    success: function (data) {
                        var oProductGroup = new JSONModel(data);
                        that.getView().byId('ProductGroup').setModel(oProductGroup, 'oProductGroup');
                    },
                    error: function (error) {
                        MessageToast.show('Load Country Failed');
                    }
                });

                

                // //GET PPN
                var TarifTaxData = await this.AjaxGetData("TipeTarif?$filter=TarifTipe eq 'PPN'");
                var oTarifTax = new JSONModel(TarifTaxData);
                that.getView().byId('TarifIdTax').setModel(oTarifTax, 'oTarifTax');

                // //GET PPH
                var TarifPphData = await this.AjaxGetData("TipeTarif?$filter=TarifTipe eq 'PPH'");
                var oTarifPph = new JSONModel(TarifPphData);
                that.getView().byId('TarifIdPph').setModel(oTarifPph, 'oTarifPph');

                // //GET FEE
                var TaridData = await this.AjaxGetData("TipeTarif?$filter=TarifTipe eq 'FEE'");
                var oTarif = new JSONModel(TaridData);
                that.getView().byId('TarifIdProduk').setModel(oTarif, 'oTarif');

                // //GET FEE
                var TarifTopData = await this.AjaxGetData("TipeTarif?$filter=TarifTipe eq 'TOP'");
                var oTarifTop = new JSONModel(TarifTopData);
                that.getView().byId('TarifIdProduk').setModel(oTarifTop, 'oTarifTop');
            },

            onEdit: function (oEvent) {
                this.getView().byId('btnSave').setEnabled(true);
                this.getView().byId('btnCancel').setEnabled(true);
                this.getView().byId('Active').setEditable(true);

                // this.getView().byId('ContractType').setEditable(true);
                // this.getView().byId('ContractName').setEditable(true);
                // this.getView().byId('Distance').setEditable(true);
                // this.getView().byId('ContractGroup').setEditable(true);
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
                // var ContractName = this.getView().byId("ContractName").getValue();
                // if (!ContractName) {
                //     ret = 'please fill in the required fields';
                // }
                return ret
            },

            postData: async function () {
                this.getView().setBusy(true);
                var that = this;
                var Active = that.getView().byId("Active").getSelectedKey();
                var ID = that.getView().byId("ID").getValue();
                var KontrakPartnerPelanggan = that.getView().byId("KontrakPartnerPelanggan").getValue();
                var KontrakStatus = that.getView().byId("KontrakStatus").getSelectedKey();
                var KontrakDeskripsi = that.getView().byId("KontrakDeskripsi").getValue();
                var PeriodeMulai = that.getView().byId("PeriodeMulai").getValue();
                if (!PeriodeMulai) {
                    PeriodeMulai = null;
                }
                var PeriodeSelesai = that.getView().byId("PeriodeSelesai").getValue();
                if (!PeriodeSelesai) {
                    PeriodeSelesai = null;
                }
                var Klasifikasi = that.getView().byId("Klasifikasi").getValue();
                var ProductGroup = that.getView().byId("ProductGroup").getSelectedKey();
                var Diskon = that.getView().byId("Diskon").getValue();
                var DiskonManual = that.getView().byId("DiskonManual").getSelectedKey();
                var TarifIdTax = that.getView().byId("TarifIdTax").getSelectedKey();
                var TarifTax = that.getView().byId("TarifTax").getValue();
                var TarifIdPph = that.getView().byId("TarifIdPph").getSelectedKey();
                var TarifPph = that.getView().byId("TarifPph").getValue();
                var ValidatitySla = that.getView().byId("ValidatitySla").getValue();
                if (!ValidatitySla) {
                    ValidatitySla = null;
                }
                var TarifIdProduk = that.getView().byId("TarifIdProduk").getSelectedKey();
                var TarifProdukFee = that.getView().byId("TarifProdukFee").getValue();
                var FeeMin = that.getView().byId("FeeMin").getValue();
                var FeeMax = that.getView().byId("FeeMax").getValue();
                var TarifTOP = that.getView().byId("TarifTOP").getSelectedKey();
                var Promo = that.getView().byId("Promo").getSelectedKey();
                var ManualQuot = that.getView().byId("ManualQuot").getSelectedKey();
                var AdditionalInfo = that.getView().byId("AdditionalInfo").getValue();

                var patch = {
                    "Active": Active,
                    "KontrakPartnerPelanggan": KontrakPartnerPelanggan,
                    "KontrakStatus": KontrakStatus,
                    "KontrakDeskripsi": KontrakDeskripsi,
                    "PeriodeMulai": PeriodeMulai,
                    "PeriodeSelesai": PeriodeSelesai,
                    "Klasifikasi": parseInt(Klasifikasi),
                    "ProductGroup": ProductGroup,
                    "Diskon": parseFloat(Diskon),
                    "DiskonManual": DiskonManual,
                    "TarifIdTax": TarifIdTax,
                    "TarifTax": parseFloat(TarifTax),
                    "TarifIdPph": TarifIdPph,
                    "TarifPph": parseFloat(TarifPph),
                    "ValidatitySla": ValidatitySla,
                    "TarifIdProduk": TarifIdProduk,
                    "TarifProdukFee": parseFloat(TarifProdukFee),
                    "FeeMin": parseFloat(FeeMin),
                    "FeeMax": parseFloat(FeeMax),
                    "TarifTOP": TarifTOP,
                    "Promo": Promo,
                    "ManualQuot": ManualQuot,
                    "AdditionalInfo": AdditionalInfo
                };
                try {
                    await this.AjaxPatchData("Contract/" + ID, patch);
                    MessageToast.show("Edit success");
                    window.history.go(-1);

                } catch (error) {
                    MessageBox.error(error.responseJSON.error.message);
                }

                this.getView().setBusy(false);
            },

            onBack: function (oEvent) {
                window.history.go(-1);
            },

            onChangeTarifTax: async function (e) {
                var that = this;
                var TarifIdTax = that.getView().byId("TarifIdTax").getSelectedKey();
                var data = await this.AjaxGetData("TipeTarif/" + TarifIdTax);
                that.getView().byId("TarifTax").setValue(data.TarifRate);
            },

            onChangePph: async function (e) {
                var that = this;
                var TarifIdPph = that.getView().byId("TarifIdPph").getSelectedKey();
                var data = await this.AjaxGetData("TipeTarif/" + TarifIdPph);
                that.getView().byId("TarifPph").setValue(data.TarifRate);
            },

            onChangeTarifProduk: async function (e) {
                var that = this;
                var TarifIdProduk = that.getView().byId("TarifIdProduk").getSelectedKey();
                var data = await this.AjaxGetData("TipeTarif/" + TarifIdProduk);
                that.getView().byId("TarifProdukFee").setValue(data.TarifRate);
                that.getView().byId("FeeMin").setValue(data.TarifMin);
                that.getView().byId("FeeMax").setValue(data.TarifMax);
            }
        });
    });