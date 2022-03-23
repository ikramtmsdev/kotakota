sap.ui.define([
    'sap/ui/kotakota/controller/BaseController',
    'sap/ui/model/json/JSONModel',
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
        BaseController, JSONModel, Device, MessageBox, MessageToast, formatter, Filter, FilterOperator) {
        "use strict";

        return BaseController.extend("sap.ui.kotakota.controller.unitavailland.UnitAvailLand", {
            formatter: formatter,

            onInit: function () {
                this.oRouter = this.getOwnerComponent().getRouter();
                this.oRouter.getRoute("UnitAvailLand").attachPatternMatched(this._onPatternMatched, this);

            },

            _onPatternMatched: async function (oEvent) {
                // var UnitAvailSea = this.getOwnerComponent().getModel("UnitAvailSea");
                var UnitAvailLand = await this.AjaxGetData("UnitAvailLand");
                var oUnitAvailLand = new JSONModel(UnitAvailLand);
                this.getView().setModel(oUnitAvailLand, "UnitAvailLand");
            },

            filterGlobally: function (oEvent) {
                var sQuery = oEvent.getParameter("query");
                this._oGlobalFilter = null;

                if (sQuery) {
                    this._oGlobalFilter = new Filter([
                        new Filter("PenjualID", FilterOperator.Contains, sQuery),
                        new Filter("UnitTipeID", FilterOperator.Contains, sQuery)
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

            onChangeUnittersedia: async function(oEvent) {
                var ID = this.getView().getModel("UnitAvailLand").getProperty("ID", oEvent.getSource().getBindingContext("UnitAvailLand"));
                var UnitTesedia = this.getView().getModel("UnitAvailLand").getProperty("UnitTesedia", oEvent.getSource().getBindingContext("UnitAvailLand"));
                var url = "UnitAvailLand(ID='" + ID + "')";
                var patch = {
                    "UnitTesedia": parseInt(UnitTesedia)
                };

                try {
                    await this.AjaxPatchData(url, patch);
                    MessageToast.show("Update unit available succes")
                } catch (error) {
                    console.log(error)
                    MessageBox.error(error.responseJSON.error.message);                    
                }
            },

            onAdd: function (oEvent) {
                this.getOwnerComponent().getRouter().navTo("UnitAvailLandAdd");
            },

            onDelete: function (oEvent) {
                var ID = this.getView().getModel("UnitAvailLand").getProperty("ID", oEvent.getSource().getBindingContext("UnitAvailLand"));

                var ini = this;
                MessageBox.confirm("Are you sure?", {
                    onClose: async function (sAction) {
                        if (sAction == "OK") {
                            await ini.AjaxDeleteData("UnitAvailLand(ID='" + ID + "')");
                            ini._onPatternMatched();
                        }
                    }
                });
            }
        });
    });
