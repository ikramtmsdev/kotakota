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

        return BaseController.extend("sap.ui.kotakota.controller.zone.Create", {
            formatter: formatter,

            onInit: async function () {
                this.bindingElement();
            },

            bindingElement: async function () {
                //GET Country
                var dataCountry = await this.AjaxGetData("Country");
                var oCountryModel = new JSONModel(dataCountry);
                this.getView().byId('Country').setModel(oCountryModel, 'oCountry');

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
                var Country = this.getView().byId("Country").getSelectedKey();
                if (!Country) {
                    ret = 'please fill in the required fields';
                }
                var Province = this.getView().byId("Province").getSelectedKey();
                if (!Province) {
                    ret = 'please fill in the required fields';
                }
                var Region = this.getView().byId("Region").getSelectedKey();
                if (!Region) {
                    ret = 'please fill in the required fields';
                }
                var City = this.getView().byId("City").getSelectedKey();
                if (!City) {
                    ret = 'please fill in the required fields';
                }
                return ret
            },

            postData: async function () {
                var that = this;
                this.getView().setBusy(true);
                var CountryID  = this.getView().byId("Country").getSelectedKey();
                var RegionID   = this.getView().byId("Region").getSelectedKey();
                var ProvinceID = this.getView().byId("Province").getSelectedKey();
                var CityID     = this.getView().byId("City").getSelectedKey();
                var ZoneType   = this.getView().byId("ZoneType").getSelectedKey();
                var Active     = this.getView().byId("Active").getSelectedKey();
                var ZoneDesc   = this.getView().byId("ZoneDesc").getValue();
                var Address   = this.getView().byId("Address").getValue();
                var ID     = this.getView().byId("ID").getValue();
                var post = {
                    "ID": ID,
                    "CityID": CityID,
                    "CountryID": CountryID,
                    "RegionID": RegionID,
                    "ProvinceID": ProvinceID,
                    "ZoneType": ZoneType,
                    "Active": Active,
                    "ZoneDesc": ZoneDesc,
                    "mode": "",
                    "Address": Address
                };
                try {
                    await this.AjaxPostData("Zone", post);
                    MessageToast.show("Create success");
                    window.history.go(-1);

                } catch (error) {
                    MessageBox.error(error.responseJSON.error.message);
                }
                this.getView().setBusy(false);
            },

            onBack: function (oEvent) {
                window.history.go(-1);
            },
            onChangeCountry: async function (oEvent) {
                var Country = this.getView().byId("Country").getSelectedKey();
                var url = "Region?$filter=CountryID eq '" + Country + "'";
                var RegionData = await this.AjaxGetData(url);
                var oRegionModel = new JSONModel(RegionData);
                this.getView().byId('Region').setModel(oRegionModel, 'oRegion');

            },
            onChangeRegion: async function (oEvent) {
                var Country = this.getView().byId("Country").getSelectedKey();
                var Region = this.getView().byId("Region").getSelectedKey();

                var url = "Province?$filter=CountryID eq '" + Country + "' and RegionID eq '" + Region + "'";
                var ProvinceData = await this.AjaxGetData(url);
                var oProvModel = new JSONModel(ProvinceData);
                this.getView().byId('Province').setModel(oProvModel, 'oProvince');
            },
            onChangeProvince: async function (oEvent) {
                var Province = this.getView().byId("Province").getSelectedKey();
                
                var url = "City?$search=" + Province;
                var CityData = await this.AjaxGetData(url);
                var oCityModel = new JSONModel(CityData);
                this.getView().byId('City').setModel(oCityModel, 'oCity');
            }
        });
    });