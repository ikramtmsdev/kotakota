sap.ui.define([
    './BaseController',
    'sap/ui/core/Fragment',
    'sap/ui/core/mvc/Controller',
    'sap/ui/model/json/JSONModel',
    'sap/m/ResponsivePopover',
    'sap/m/MessagePopover',
    'sap/m/ActionSheet',
    'sap/m/Button',
    'sap/m/Link',
    'sap/m/Bar',
    'sap/ui/layout/VerticalLayout',
    'sap/m/NotificationListItem',
    'sap/m/MessagePopoverItem',
    'sap/ui/core/CustomData',
    'sap/m/MessageToast',
    'sap/ui/Device',
    'sap/ui/core/syncStyleClass',
    'sap/m/library'
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (
        BaseController,
        Fragment,
        Controller,
        JSONModel,
        ResponsivePopover,
        MessagePopover,
        ActionSheet,
        Button,
        Link,
        Bar,
        VerticalLayout,
        NotificationListItem,
        MessagePopoverItem,
        CustomData,
        MessageToast,
        Device,
        syncStyleClass,
        mobileLibrary) {
        "use strict";

        return BaseController.extend("sap.ui.kotakota.controller.App", {
            _bExpanded: true,

            onInit: function () {
                this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());

                // if the app starts on desktop devices with small or meduim screen size, collaps the sid navigation
                if (Device.resize.width <= 1024) {
                    this.onSideNavButtonPress();
                }

                Device.media.attachHandler(function (oDevice) {
                    if ((oDevice.name === "Tablet" && this._bExpanded) || oDevice.name === "Desktop") {
                        this.onSideNavButtonPress();
                        // set the _bExpanded to false on tablet devices
                        // extending and collapsing of side navigation should be done when resizing from
                        // desktop to tablet screen sizes)
                        this._bExpanded = (oDevice.name === "Desktop");
                    }
                }.bind(this));

                this.getRouter().attachRouteMatched(this.onRouteChange.bind(this));

            },

            onItemSelect: function (event) {

                var userSelected = event.getParameters("item").item;
                console.log(userSelected.getKey())
                this.getOwnerComponent().getRouter().navTo(userSelected.getKey());
            },

            onRouteChange: function (oEvent) {
                // this.getModel('side').setProperty('/selectedKey', oEvent.getParameter('name'));
                if (Device.system.phone) {
                    this.onSideNavButtonPress();
                }
            },
            
            onSideNavButtonPress: function() {
                var oToolPage = this.byId("app");
                var bSideExpanded = oToolPage.getSideExpanded();
                // this._setToggleButtonTooltip(bSideExpanded);
                oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
            },
    
            _setToggleButtonTooltip : function(bSideExpanded) {
                var oToggleButton = this.byId('sideNavigationToggleButton');
                this.getBundleText(bSideExpanded ? "expandMenuButtonText" : "collpaseMenuButtonText").then(function(sTooltipText){
                    oToggleButton.setTooltip(sTooltipText);
                });
            },
    
        });
    });
