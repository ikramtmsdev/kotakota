sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent"
], function (Controller, UIComponent) {
    "use strict";
    var mainUrl = "https://apiapps.cfapps.ap11.hana.ondemand.com/catalog/";

    return Controller.extend("sap.ui.searchservice.controller.BaseController", {

		/**
		 * Convenience method for accessing the router.
		 * @public
		 * @returns {sap.ui.core.routing.Router} the router for this component
		 */
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },

		/**
		 * Convenience method for getting the view model by name.
		 * @public
		 * @param {string} [sName] the model name
		 * @returns {sap.ui.model.Model} the model instance
		 */
        getModel: function (sName) {
            return this.getView().getModel(sName);
        },

		/**
		 * Convenience method for setting the view model.
		 * @public
		 * @param {sap.ui.model.Model} oModel the model instance
		 * @param {string} sName the model name
		 * @returns {sap.ui.mvc.View} the view instance
		 */
        setModel: function (oModel, sName) {
            return this.getView().setModel(oModel, sName);
        },

		/**
		 * Returns a promises which resolves with the resource bundle value of the given key <code>sI18nKey</code>
		 *
		 * @public
		 * @param {string} sI18nKey The key
		 * @param {sap.ui.core.model.ResourceModel} oResourceModel The resource model
		 * @param {string[]} [aPlaceholderValues] The values which will repalce the placeholders in the i18n value
		 * @returns {Promise<string>} The promise
		 */
        getBundleTextByModel: function (sI18nKey, oResourceModel, aPlaceholderValues) {
            return oResourceModel.getResourceBundle().then(function (oBundle) {
                return oBundle.getText(sI18nKey, aPlaceholderValues);
            });
        },

        AjaxGetData: async function (url, _mainUrl = '') {
            var useUrl = '';
            if(_mainUrl != ''){
                useUrl = _mainUrl;
            } else {
                useUrl = mainUrl;
            }
            
            var data = "";
            await $.ajax({
                method: "GET",
                url: useUrl + url,
                success: function (resdata) {
                    data = resdata;
                },
                error: function (res) {
                    data = res.responseJSON.error;
                }
            });
            return data;
        },

        AjaxPostData: async function (url, dataForm) {
            var data = "";
            await $.ajax({
                method: "POST",
                url: mainUrl + url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(dataForm),
                success: function (resdata) {
                    data = resdata
                },
                error: function (res) {
                    data = res.responseJSON.error;
                }
            });
            return data;
        },

        AjaxPatchData: async function (url, dataForm) {
            var data = "";
            await $.ajax({
                method: "PATCH",
                url: mainUrl + url,
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify(dataForm),
                success: function (resdata) {
                    data = resdata
                },
                error: function (res) {
                    data = res.responseJSON.error;
                }
            });
            return data;
        },

        AjaxDeleteData: async function (url) {
            var data = "";
            await $.ajax({
                method: "DELETE",
                url: mainUrl + url,
                headers: { "Content-Type": "application/json" },
                success: function (resdata) {
                    data = resdata
                },
                error: function (res) {
                    data = res.responseJSON.error;
                }
            });

            return data;
        },

        formatDate: function (date, separator = '') {
            var d = new Date(date),
                month = '' + (d.getMonth() + 1),
                day = '' + d.getDate(),
                year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;

            return [year, month, day].join(separator)
        },

        getRandomNumber: function () {
            var x = Math.floor((Math.random() * 10000) + 1);
            return x
        },

        validateEmail: function (email) {
            return String(email)
                .toLowerCase()
                .match(
                    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                );
        }




    });

});
