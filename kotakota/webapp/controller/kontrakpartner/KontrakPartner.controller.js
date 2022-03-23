sap.ui.define([
    'sap/ui/kotakota/controller/BaseController',
    'sap/ui/model/json/JSONModel',
    "sap/ui/table/RowAction",
    "sap/ui/table/RowActionItem",
    'sap/ui/Device',
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    'sap/ui/kotakota/model/formatter',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController, JSONModel, RowAction, RowActionItem, Device, MessageBox, MessageToast, formatter, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("sap.ui.kotakota.controller.kontrakpartner.KontrakPartner", {
            formatter: formatter,

            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("KontrakPartner").attachPatternMatched(this._onPatternMatched, this);

            },

            _onPatternMatched: async function (oEvent) {
                // var Partner = this.getOwnerComponent().getModel("Partner");
                var KontrakPartner = await this.AjaxGetData("KontrakPartner");
                var oKontrakPartner = new JSONModel(KontrakPartner);
                this.getView().setModel(oKontrakPartner, "KontrakPartner");

                var oTable = this.byId("mainTable");
                var iCount = 3;

                var fnPress = this.handleActionPress.bind(this);

                var oTemplate = new RowAction({
                    items: [
                        new RowActionItem({ icon: "sap-icon://detail-view", text: "Detail", press: fnPress }),
                        new RowActionItem({ icon: "sap-icon://delete", text: "Delete", press: fnPress })
                    ]
                });

                oTable.setRowActionTemplate(oTemplate);
                oTable.setRowActionCount(iCount);
            },

            filterGlobally: function (oEvent) {
                var sQuery = oEvent.getParameter("query");
                this._oGlobalFilter = null;

                if (sQuery) {
                    this._oGlobalFilter = new Filter([
                        new Filter("ID", FilterOperator.Contains, sQuery),
                        new Filter("Nama", FilterOperator.Contains, sQuery)
                    ], false);
                }

                this._filter();
            },

            _filter: function () {
                var oFilter = null;

                if (this._oGlobalFilter && this._oPriceFilter) {
                    oFilter = new Filter([this._oGlobalFilter, this._oPriceFilter], true);
                } else if (this._oGlobalFilter) {
                    oFilter = this._oGlobalFilter;
                }

                this.byId("mainTable").getBinding().filter(oFilter, "Application");
            },

            getSelectedDelete: function (oEvent) {
                var ini = this;
                var oTable = this.byId("mainTable");
                var aIndices = oTable.getSelectedIndices();
                var sMsg;
                if (aIndices.length < 1) {
                    sMsg = "no item selected";
                    MessageToast.show(sMsg);
                } else {
                    MessageBox.confirm("Are you sure?", {
                        onClose: async function (sAction) {
                            if (sAction == "OK") {
                                try {
                                    ini.getView().setBusy(true);
                                    aIndices.forEach(async element => {
                                        var context = oTable.getContextByIndex(element);
                                        var PelangganID = context.getObject().PelangganID;
                                        var PenjualID = context.getObject().PenjualID;
                                        var ID = "(PelangganID='" + PelangganID + "',PenjualID='" + PenjualID + "')";
                                        await ini.AjaxDeleteData("KontrakPartner(ID='" + ID + "')");
                                    });
                                } catch (error) {

                                }
                                alert('Delete succes')
                                ini._onPatternMatched();
                                ini.getView().setBusy(false);
                            }
                        }
                    });
                }

            },

            onAdd: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("KontrakPartnerAdd");
            },

            handleActionPress: function (oEvent) {
                var oRow = oEvent.getParameter("row");
                var oItem = oEvent.getParameter("item");
                var oAction = (oItem.getText() || oItem.getType());
                var PelangganID = this.getView().getModel("KontrakPartner").getProperty("PelangganID", oRow.getBindingContext("KontrakPartner"));
                var PenjualID = this.getView().getModel("KontrakPartner").getProperty("PenjualID", oRow.getBindingContext("KontrakPartner"));
                var ID = "(PelangganID='" + PelangganID + "',PenjualID='" + PenjualID + "')";

                if (oAction == "Delete") {
                    this.onDelete(ID);
                }
                else if (oAction == "Detail") {
                    this.getOwnerComponent().getRouter().navTo("KontrakPartnerDetail", { id: ID });
                }
            },

            onDelete: function (ID) {
                var ini = this;
                MessageBox.confirm("Are you sure?", {
                    onClose: async function (sAction) {
                        if (sAction == "OK") {
                            await ini.AjaxDeleteData("KontrakPartner" + ID);
                            ini._onPatternMatched();
                        }
                    }
                });
            }
        });
    });
