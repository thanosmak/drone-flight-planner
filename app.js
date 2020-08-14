var myApp = angular.module("pixApp", ["ngMaterial", "ngMessages", "ngAnimate"]);

myApp.config([
	"$mdThemingProvider",
	function ($mdThemingProvider) {
		$mdThemingProvider.theme("default").primaryPalette("indigo").accentPalette("purple");
	},
]);

myApp.run([
	"MapFactory", "DisplayFactory",
	function (MapFactory, DisplayFactory) {
	},
]);
