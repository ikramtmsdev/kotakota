sap.ui.define([
    "./BaseController",
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/json/JSONModel',
    "sap/ui/table/RowAction",
    "sap/ui/table/RowActionItem",
    "sap/m/MessageToast",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/ui/core/library"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (BaseController, Controller, JSONModel, RowAction, RowActionItem, MessageToast, MessageBox, Fragment, CoreLibrary) {
        "use strict";

        var ValueState = CoreLibrary.ValueState,
            oData = {};

        return BaseController.extend("sap.ui.searchservice.controller.App", {
            onInit: function () {

                this.bindingElement();

            },

            bindingElement: async function () {
                //GET TipeLayanan
                var that = this;
                var TipeLayananData = await this.AjaxGetData("TipeLayanan");
                var oLayananModel = new JSONModel(TipeLayananData);
                that.getView().byId('TipeLayanan').setModel(oLayananModel, 'oLayanan');

            },

            onChangeTipeLayanan: async function (oEvent) {
                var that = this;
                var DoorToDoor = "", DoorToPol = "", PolToPod = "", PodToDoor = "";
                var LayananID = this.getView().byId("TipeLayanan").getSelectedKey();

                var TipeLayananData = await this.AjaxGetData("TipeLayanan/" + LayananID);
                DoorToDoor = TipeLayananData.DoorToDoor;
                that.getView().byId("DoorToDoor").setValue(DoorToDoor);
                DoorToPol = TipeLayananData.DoorToPol;
                that.getView().byId("DoorToPol").setValue(DoorToPol);
                PolToPod = TipeLayananData.PolToPod;
                that.getView().byId("PolToPod").setValue(PolToPod);
                PodToDoor = TipeLayananData.PodToDoor;
                that.getView().byId("PodToDoor").setValue(PodToDoor);

                var unitProdukDarat = "", unitProdukLaut = "", urls = "";
                if (DoorToDoor != "") {
                    unitProdukDarat = DoorToDoor;

                    that.getView().byId('Origin').setEditable(true)
                    that.getView().byId('Destination').setEditable(true)
                    that.getView().byId('POL').setEditable(false)
                    that.getView().byId('POD').setEditable(false)
                }
                else if (DoorToPol != "") {
                    unitProdukDarat = DoorToPol;

                    that.getView().byId('Origin').setEditable(true)
                    that.getView().byId('Destination').setEditable(false)
                    that.getView().byId('POL').setEditable(true)
                    that.getView().byId('POD').setEditable(false)
                }
                else if (PodToDoor != "") {
                    unitProdukDarat = PodToDoor;
                    that.getView().byId('Origin').setEditable(false)
                    that.getView().byId('Destination').setEditable(true)
                    that.getView().byId('POL').setEditable(false)
                    that.getView().byId('POD').setEditable(true)
                }

                if (PolToPod != "") {
                    unitProdukLaut = PolToPod;
                    that.getView().byId('Origin').setEditable(false)
                    that.getView().byId('Destination').setEditable(false)
                    that.getView().byId('POL').setEditable(true)
                    that.getView().byId('POD').setEditable(true)
                }


                //#region  Detail Perjalana
                var tipe = "POINT";
                var ZoneData = await this.AjaxGetData("Zone?$filter=ZoneType eq '" + tipe + "'");
                var oOriginDestinationModel = new JSONModel(ZoneData);
                that.getView().byId('Origin').setModel(oOriginDestinationModel, 'oOriginDestination');
                that.getView().byId('Destination').setModel(oOriginDestinationModel, 'oOriginDestination');


                tipe = "PORT";
                ZoneData = await this.AjaxGetData("Zone?$filter=ZoneType eq '" + tipe + "'");
                var oPolPodModel = new JSONModel(ZoneData);

                that.getView().byId('POL').setModel(oPolPodModel, 'oPolPod');
                that.getView().byId('POD').setModel(oPolPodModel, 'oPolPod');
                //#endregion


                var ProdukData = await this.AjaxGetData("JenisMuatanKelas", "https://apiapps.cfapps.ap11.hana.ondemand.com/select/");
                var oProduk = new JSONModel(ProdukData);
                that.getView().byId('JenisMuatan').setModel(oProduk, 'oProduk');


                var unit_produk = "";
                if (unitProdukDarat != "") {
                    unit_produk = unitProdukDarat;
                }
                else {
                    unit_produk = unitProdukLaut;
                }
                that.getView().byId('UnitProduk').setValue(unit_produk);
                // that.onChangeJenisMuatan();

            },

            onChangeJenisMuatan: async function (oEvent) {
                var UnitProduk = this.getView().byId("UnitProduk").getValue();
                var JenisMuatan = this.getView().byId("JenisMuatan").getSelectedKey();

                var that = this;
                // var regid = Region;
                var dataDarat = await this.AjaxGetData("TipeUnitProduk?$filter=ProdukGroup eq 'LNDFRG' and JenisMuatanKelas eq '" + JenisMuatan + "'");
                var dataLaut = await this.AjaxGetData("TipeUnitProduk?$filter=ProdukGroup eq 'SEAFRG' and JenisMuatanKelas eq '" + JenisMuatan + "'");
                var oTipeUnitDaratModel = new JSONModel(dataDarat);
                var oTipeUnitLautModel = new JSONModel(dataLaut);


                if (UnitProduk == "SEAFRG") {
                    that.getView().byId('TipeUnitLaut').setModel(oTipeUnitLautModel, 'oTipeUnitLautModel');
                }
                else {
                    that.getView().byId('TipeUnitDarat').setModel(oTipeUnitDaratModel, 'oTipeUnitDarat');
                }

            },

            onChangeTipeUnitDarat: async function (oEvent) {
                var TipeUnitDarat = this.getView().byId("TipeUnitDarat").getSelectedKey();
                var unitProdukDarat = ""
                var that = this;

                if (that.getView().byId('DoorToDoor').getValue() != "") {
                    unitProdukDarat = that.getView().byId('DoorToDoor').getValue();
                }
                else if (that.getView().byId('DoorToPol').getValue() != "") {
                    unitProdukDarat = that.getView().byId('DoorToPol').getValue();
                }
                else if (that.getView().byId('PodToDoor').getValue() != "") {
                    unitProdukDarat = that.getView().byId('PodToDoor').getValue();
                }

                that.getView().byId('UnitTipeID').setValue(TipeUnitDarat);

            },


            onSearch: async function () {
                this.getView().setBusy(true);
                var Pricebook = await this.AjaxGetData("KontrakView?$filter=ProdukKode eq 'LNDFRG-IDJKT-IDTJP-TRCTN20' and KontrakPartnerPelanggan eq 'KK'");
                var modifdata = [];
                var jml = this.getView().byId("Jumlah").getValue();
                var TipeLayanan = this.getView().byId("TipeLayanan").getSelectedKey();
                for (var i = 0; i < Pricebook.value.length; i++) {
                    var oProduct = Pricebook.value[i];
                    oProduct.Jumlah = jml;
                    oProduct.NamaLayanan = TipeLayanan;
                    oProduct.Price = oProduct.JumlahAR * jml;
                    modifdata.push(oProduct);
                }


                Pricebook.value = modifdata;

                var oPricebook = new JSONModel(Pricebook);
                this.getView().setModel(oPricebook, "Pricebook");

                var oTable = this.byId("mainTable");
                var iCount = 3;

                var fnPress = this.handleActionPress.bind(this);

                var oTemplate = new RowAction({
                    items: [
                        new RowActionItem({ icon: "sap-icon://detail-view", text: "Detail", press: fnPress }),
                        // new RowActionItem({ icon: "sap-icon://delete", text: "Delete", press: fnPress })
                    ]
                });

                oTable.setRowActionTemplate(oTemplate);
                oTable.setRowActionCount(iCount);
                this.getView().setBusy(false);

            },

            handleActionPress: function (oEvent) {
                var oRow = oEvent.getParameter("row");
                var oItem = oEvent.getParameter("item");
                var oAction = (oItem.getText() || oItem.getType());
                var NoKontrak = this.getView().getModel("Pricebook").getProperty("NoKontrak", oRow.getBindingContext("Pricebook"));
                var ProdukKode = this.getView().getModel("Pricebook").getProperty("ProdukKode", oRow.getBindingContext("Pricebook"));
                var ID = "(NoKontrak='" + NoKontrak + "',ProdukKode='" + ProdukKode + "')";

                if (oAction == "Detail") {
                    // this.getOwnerComponent().getRouter().navTo("PricebookDetail", { id: ID });
                    this.handleOpenDialog(ID);
                }
            },

            handleOpenDialog: async function (id) {
                this.getView().setBusy(true);

                var oView = this.getView();
                var today = new Date();
                var formatedDate = this.formatDate(today);

                var data = await this.AjaxGetData("KontrakView" + id);
                var LayananData = new JSONModel(data);
                LayananData.oData.namaPengirimState = ValueState.Error;
                LayananData.oData.PelangganID = "TMS";
                LayananData.oData.JenisLayanan = this.getView().byId("TipeLayanan").getSelectedKey();
                LayananData.oData.JenisMuatan = this.getView().byId("JenisMuatan").getSelectedKey();
                LayananData.oData.Jumlah = parseInt(this.getView().byId("Jumlah").getValue());

                LayananData.oData.HargaFix = Math.round((LayananData.oData.HargaFix * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.HargaVar = Math.round((LayananData.oData.HargaVar * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.diskonamount = Math.round((LayananData.oData.diskonamount * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.HargaPenawaranFix = Math.round((LayananData.oData.HargaPenawaranFix * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.HargaPenawanVar = Math.round((LayananData.oData.HargaPenawanVar * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.Pajak = Math.round((LayananData.oData.Pajak * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.PotPph = Math.round((LayananData.oData.PotPph * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.JumlahAR = Math.round((LayananData.oData.JumlahAR * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.KomisiJmlMin = Math.round((LayananData.oData.KomisiJmlMin * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.PajakKomisi = Math.round((LayananData.oData.PajakKomisi * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.PphKomisi = Math.round((LayananData.oData.PphKomisi * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.JumlahAP = Math.round((LayananData.oData.JumlahAP * LayananData.oData.Jumlah) * 100) / 100;
                LayananData.oData.ApPenjual = Math.round((LayananData.oData.ApPenjual * LayananData.oData.Jumlah) * 100) / 100;

                LayananData.oData.QuoteNo = LayananData.oData.PenjualID + LayananData.oData.PelangganID + formatedDate + this.getRandomNumber();
                LayananData.oData.BillingNo = LayananData.oData.QuoteNo + LayananData.oData.PenjualID + LayananData.oData.PelangganID + formatedDate + this.getRandomNumber();

                LayananData.oData.StatusDelivery = "Quote";
                LayananData.oData.StatusQuote = "Quote";

                // oData = {
                //     namaPengirimState: ValueState.Error
                //     // emailPengirimState: ValueState.Error,
                //     // productType: "Mobile",
                //     // reviewButton: false,
                //     // backButtonVisible: false,
                //     // availabilityType: "In store",
                //     // productVAT: false,
                //     // measurement: "",
                //     // productManufacturer: "N/A",
                //     // productDescription: "N/A",
                //     // size: "N/A",
                //     // productPrice: "N/A",
                //     // manufacturingDate: "N/A",
                //     // discountGroup: ""
                // };


                oView.setModel(LayananData);
                oView.bindElement({
                    path: "/"
                });

                // var oModel = new JSONModel(),
                //     oInitialModelState = Object.assign({}, oData);



                // oModel.setData(oInitialModelState);
                // this.getView().setModel(oModel);
                // var oView = this.getView();

                // create Dialog
                if (!this._pDialog) {
                    this._pDialog = Fragment.load({
                        id: oView.getId(),
                        name: "sap.ui.searchservice.view.App",
                        controller: this
                    }).then(function (oDialog) {
                        oDialog.attachAfterOpen(this.onDialogAfterOpen, this);
                        oView.addDependent(oDialog);
                        // oDialog.bindElement("/ProductCollection/0");
                        // oDialog.bindElement("/ProductCollection/0");
                        oDialog.bindElement({
                            path: "/"
                        });
                        return oDialog;
                    }.bind(this));
                }
                this._pDialog.then(function (oDialog) {
                    oDialog.open();
                });
                this.getView().setBusy(false);
            },

            onDialogAfterOpen: function () {
                this._oWizard = this.byId("CreateProductWizard");

                // this.handleButtonsVisibility();
            },

            handleButtonsVisibility: function () {
                var oModel = this.getView().getModel();

                switch (this._oWizard.getProgress()) {
                    case 1:
                        oModel.setProperty("/nextButtonVisible", true);
                        oModel.setProperty("/nextButtonEnabled", true);
                        oModel.setProperty("/backButtonVisible", false);
                        oModel.setProperty("/reviewButtonVisible", false);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                    case 2:
                        oModel.setProperty("/backButtonVisible", true);
                        break;
                    case 3:
                        oModel.setProperty("/nextButtonVisible", false);
                        oModel.setProperty("/reviewButtonVisible", true);
                        oModel.setProperty("/finishButtonVisible", false);
                        break;
                    case 4:
                        oModel.setProperty("/finishButtonVisible", true);
                        oModel.setProperty("/backButtonVisible", false);
                        oModel.setProperty("/reviewButtonVisible", false);
                        break;
                    default: break;
                }

            },

            setProductType: function (oEvent) {
                // var sProductType = oEvent.getSource().getTitle();
                // this.getView().getModel().setProperty("/productType", sProductType);
                // this.byId("ProductStepChosenType").setText("Chosen product type: " + sProductType);
                // // this._oWizard.validateStep(this.byId("ProductTypeStep"));
            },

            setProductTypeFromSegmented: function (oEvent) {
                // var sProductType = oEvent.getParameters().item.getText();
                // this.getView().getModel().setProperty("/productType", sProductType);
                // this._oWizard.validateStep(this.byId("ProductTypeStep"));
            },

            additionalInfoValidation: function () {
                var oModel = this.getView().getModel(),
                    sName = this.byId("NamaPengirim").getValue(),
                    sEmailPengirim = this.byId("EmailPengirim").getValue();


                oModel.setProperty("/backButtonVisible", false);
                oModel.setProperty("/backButtonVisible", false);
                oModel.setProperty("/reviewButtonVisible", false);
                oModel.setProperty("/finishButtonVisible", false);

                // this.handleButtonsVisibility();

                if (this.validateEmail(sEmailPengirim)) {
                    oModel.setProperty("/emailPengirimState", ValueState.None);
                } else {
                    oModel.setProperty("/emailPengirimState", ValueState.Error);
                }

                if (sName.length < 2) {
                    oModel.setProperty("/namaPengirimState", ValueState.Error);
                } else {
                    oModel.setProperty("/namaPengirimState", ValueState.None);
                }

                if (sName.length < 2 || !this.validateEmail(sEmailPengirim)) {
                    // this._oWizard.invalidateStep(this.byId("ProductInfoStep"));
                    oModel.setProperty("/nextButtonEnabled", false);
                    oModel.setProperty("/finishButtonVisible", false);
                } else {

                    this._oWizard.validateStep(this.byId("ProductInfoStep"));
                    oModel.setProperty("/nextButtonEnabled", true);
                }
            },

            optionalStepActivation: function () {
                MessageToast.show(
                    'This event is fired on activate of Step3.'
                );
            },
            optionalStepCompletion: function () {
                MessageToast.show(
                    'This event is fired on complete of Step3. You can use it to gather the information, and lock the input data.'
                );
            },

            editStepOne: function () {
                this._handleNavigationToStep(0);
            },

            editStepTwo: function () {
                this._handleNavigationToStep(1);
            },

            editStepThree: function () {
                this._handleNavigationToStep(2);
            },

            // editStepFour: function () {
            //     this._handleNavigationToStep(3);
            // },

            _handleNavigationToStep: function (iStepNumber) {
                this._pDialog.then(function (oDialog) {
                    oDialog.open();
                    this._oWizard.goToStep(this._oWizard.getSteps()[iStepNumber], true);
                }.bind(this));
            },

            _handleMessageBoxOpen: function (sMessage, sMessageBoxType) {
                var ini = this;
                MessageBox[sMessageBoxType](sMessage, {
                    actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                    onClose: async function (oAction) {
                        if (oAction === MessageBox.Action.YES) {
                            if (sMessageBoxType == "confirm") {
                                await ini.insertData();
                            }
                            this.getView().getModel().setData(Object.assign({}, oData));
                            this._oWizard.discardProgress(this._oWizard.getSteps()[0]);
                            this.byId("wizardDialog").close();

                        }
                    }.bind(this)
                });
            },

            insertData: async function () {
                this.getView().setBusy(true);
                var oView = this.getView();
                var oDataModel = oView.getModel().oData;

                //insert quote info
                var quoteModel = {
                    "ID": oDataModel.QuoteNo,
                    "OrderStatus": "Booked",
                    "TipeQuote": "Otomatis",
                    "PelangganID": oDataModel.PelangganID,
                    "PenjualID": oDataModel.PenjualID,
                    "SellerRating": oDataModel.SellerRating,
                    "JenisLayanan": oDataModel.JenisLayanan,
                    "JenisKelasMuatan": oDataModel.JenisMuatan,
                    "StdWeight": null,
                    "WeightMuatan": null,
                    "DimensiMuatan": null,
                    "HsCode": oDataModel.HSCode,
                    "NilaiBarang": null,
                    "Contract": oDataModel.NoKontrak,
                    "Validity": oDataModel.PeriodeSelesai,
                    "PenawaranJumlahAR": oDataModel.JumlahAR
                }
                await this.AjaxPostData("QuoteInfo", quoteModel);

                // insert order info
                var orderInfoModel = {
                    "ID": oDataModel.QuoteNo,
                    "PelangganID": oDataModel.PelangganID,
                    "PenjualID": oDataModel.PenjualID,
                    "InternalOrderRef": oDataModel.InternalOrderRef,
                    "StatusQuote": "Booked",
                    "JenisLayanan": oDataModel.JenisLayanan,
                    "JenisMuatan": oDataModel.JenisMuatan,
                    "HSCode": oDataModel.HSCode,
                    "NilaiMuatan": oDataModel.NilaiMuatan,
                    "NamaPengirim": oDataModel.NamaPengirim,
                    "KontakPengirim": oDataModel.KontakPengirim,
                    "EmailPengirim": oDataModel.EmailPengirim,
                    "NamaPenerima": oDataModel.NamaPenerima,
                    "KontakPenerima": oDataModel.KontakPenerima,
                    "PesananAtasNama": oDataModel.PesananAtasNama,
                    "KontakAtasNama": oDataModel.KontakAtasNama,
                    "EmailAtasNama": oDataModel.EmailAtasNama,
                    "NotePengiriman": oDataModel.NotePengiriman,
                    "TanggalBookOrder": oDataModel.TanggalBookOrder,
                    "TanggalOrderClosed": oDataModel.TanggalOrderClosed
                    // "Puas":oDataModel.Puas,
                    // "ComplainTicketNo":oDataModel.ComplainTicketNo,
                    // "StatusDokumen":oDataModel.StatusDokumen

                }
                await this.AjaxPostData("OrderInfo", orderInfoModel);

                // insert billing info
                var billingInfoModel = {
                    "BillingNo": oDataModel.BillingNo,
                    "QuoteNo": oDataModel.QuoteNo,
                    "BillingItem": 1,
                    "ProdukKode": oDataModel.ProdukKode,
                    "NamaProduk": oDataModel.NamaProduk,
                    "RuteID": oDataModel.RuteID,
                    "Tanggal": oDataModel.Tanggal,
                    "Qty": oDataModel.Jumlah,
                    "UOM": oDataModel.Uom,
                    "Curr": oDataModel.TarifCurr,
                    "Kurs": oDataModel.Rate,
                    "KontrakPercent": oDataModel.KontrakPercent,
                    "KontrakAmount": oDataModel.KontrakAmount,
                    "AdjManual": oDataModel.AdjManual,
                    "HargaPenawaran": oDataModel.HargaPenawaranFix,
                    "PajakRate": oDataModel.TarifTax,
                    "Pajak": oDataModel.Pajak,
                    "PotPphRate": oDataModel.TarifPph,
                    "PotPph": oDataModel.PotPph,
                    "JumlahAR": oDataModel.JumlahAR,
                    "KomisiRate": oDataModel.KomisiRate,
                    "JmlKomisiMin": oDataModel.KomisiJmlMin,
                    "PajakKomisi": oDataModel.KomisiRate,
                    "PotPphKotaKota": oDataModel.PphKomisi,
                    "PajakKomisKotaKota": oDataModel.PajakKomisi,
                    "JumlahAP": oDataModel.JumlahAP,
                    "ApPenjual": oDataModel.ApPenjual
                }
                await this.AjaxPostData("BillingInfo", billingInfoModel);
                this.getView().setBusy(false);

                this.getRouter().navTo("OrderCompleted", { QuoteNo: oDataModel.QuoteNo });
            },

            onDialogNextButton: function () {

                if (this._oWizard.getProgressStep().getValidated()) {
                    this._oWizard.nextStep();
                }

                this.handleButtonsVisibility();
            },

            onDialogBackButton: function () {
                this._oWizard.previousStep();
                this.handleButtonsVisibility();
            },

            handleWizardCancel: function () {
                this._handleMessageBoxOpen("Are you sure you want to cancel?", "warning");
            },

            handleWizardSubmit: function () {
                this._handleMessageBoxOpen("Are you sure you want to book?", "confirm");

            },


            discardProgress: function () {
                var oModel = this.getView().getModel();
                // this._oWizard.discardProgress(this.byId("ProductTypeStep"));

                var clearContent = function (aContent) {
                    for (var i = 0; i < aContent.length; i++) {
                        if (aContent[i].setValue) {
                            aContent[i].setValue("");
                        }

                        if (aContent[i].getContent) {
                            clearContent(aContent[i].getContent());
                        }
                    }
                };

                oModel.setProperty("/emailPengirimState", ValueState.Error);
                oModel.setProperty("/namaPengirimState", ValueState.Error);
                clearContent(this._oWizard.getSteps());
            }
        });
    });
