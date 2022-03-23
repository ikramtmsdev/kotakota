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

        return BaseController.extend("sap.ui.kotakota.controller.kontrakview.KontrakView", {
            formatter: formatter,

            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("KontrakView").attachPatternMatched(this._onPatternMatched, this);

            },

            _onPatternMatched: async function (oEvent) {
                // var KontrakView = this.getOwnerComponent().getModel("KontrakView");
                var KontrakView = await this.AjaxGetData("KontrakView");
                var oKontrakView = new JSONModel(KontrakView);
                this.getView().setModel(oKontrakView, "KontrakView");

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


            onAdd: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("KontrakViewAdd");
            },

            handleActionPress: function (oEvent) {
                var oRow = oEvent.getParameter("row");
                var oItem = oEvent.getParameter("item");
                var oAction = (oItem.getText() || oItem.getType());
                var NoKontrak = this.getView().getModel("KontrakView").getProperty("NoKontrak", oRow.getBindingContext("KontrakView"));
                var ProdukKode = this.getView().getModel("KontrakView").getProperty("ProdukKode", oRow.getBindingContext("KontrakView"));
                var ID = "(NoKontrak='" + NoKontrak + "',ProdukKode='" + ProdukKode + "')";
                
                if (oAction == "Detail") {
                    this.getOwnerComponent().getRouter().navTo("KontrakViewDetail", { id: ID });
                }
            },
        });
    });
