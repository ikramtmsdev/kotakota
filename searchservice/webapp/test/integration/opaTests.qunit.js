/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require(["sap/ui/searchservice/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});
