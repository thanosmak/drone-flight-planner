/**
 * Helper Factory 
 * Functionalities regarding UI elements like toast, dialogs etc. 
 */
(function () {
	angular.module("pixApp").factory("DisplayFactory", DisplayFactory);

	DisplayFactory.$inject = ["$mdToast","$mdDialog"];

	function DisplayFactory($mdToast, $mdDialog) {
		var DisplayFactory = {
			preSelectedRoutes: JSON.parse('[{"name":"Surround Prilly","route":[{"lat":46.5346048095753,"lng":6.599864959716798},{"lat":46.531772164531,"lng":6.601753234863282},{"lat":46.53068037647467,"lng":6.606044769287109},{"lat":46.53118201155022,"lng":6.611666679382325},{"lat":46.5325098467392,"lng":6.613383293151856},{"lat":46.53436876146466,"lng":6.612610816955566},{"lat":46.53693572957581,"lng":6.610894203186036},{"lat":46.53758482872713,"lng":6.607160568237306},{"lat":46.537112757386595,"lng":6.602697372436524},{"lat":46.53619810748543,"lng":6.600422859191895}]},{"name":"Triangle","route":[{"lat":46.50694884270761,"lng":6.635065233977043},{"lat":46.505797236748485,"lng":6.648917198181153},{"lat":46.514269275079805,"lng":6.642222404479981},{"lat":46.506978087840324,"lng":6.635098457336426}]},{"name":"Pix4D Route","route":[{"lat":46.51565931873068,"lng":6.599779129028321},{"lat":46.53802802431068,"lng":6.600809097290039},{"lat":46.53071051706284,"lng":6.616172790527345},{"lat":46.5274645328654,"lng":6.6007232666015625},{"lat":46.51624964035849,"lng":6.598920822143556},{"lat":46.51436058857647,"lng":6.637115478515626},{"lat":46.51436058857647,"lng":6.627931594848634},{"lat":46.53708388523157,"lng":6.629047393798829},{"lat":46.53791000782354,"lng":6.620206832885743},{"lat":46.53702487599409,"lng":6.637973785400391},{"lat":46.53672982884466,"lng":6.64200782775879},{"lat":46.51306182738428,"lng":6.65574073791504},{"lat":46.52652021012962,"lng":6.647844314575196},{"lat":46.51495092431244,"lng":6.6420936584472665},{"lat":46.536021709145245,"lng":6.656513214111328},{"lat":46.53543160234195,"lng":6.674537658691407},{"lat":46.523214951274866,"lng":6.66123390197754},{"lat":46.52262470531749,"lng":6.674537658691407},{"lat":46.53525456905051,"lng":6.6748809814453125},{"lat":46.51199918150451,"lng":6.6742801666259775},{"lat":46.51152688777748,"lng":6.685094833374024},{"lat":46.535726656545165,"lng":6.686983108520508},{"lat":46.52410030818711,"lng":6.70517921447754},{"lat":46.51182207183783,"lng":6.686382293701173}]},{"name":"My Neighbourhood","route":[{"lat":40.5983823523586,"lng":22.97427892684937},{"lat":40.59779613877924,"lng":22.9745364189148},{"lat":40.59976644735739,"lng":22.97642469406128},{"lat":40.60075972140022,"lng":22.975866794586185},{"lat":40.60194837421586,"lng":22.97526597976685},{"lat":40.60276250778329,"lng":22.974879741668705},{"lat":40.60173669786406,"lng":22.96990156173706},{"lat":40.60155758658132,"lng":22.968099117279056},{"lat":40.60009211260421,"lng":22.968485355377197},{"lat":40.59849633773542,"lng":22.9690432548523},{"lat":40.59960361413903,"lng":22.972819805145267},{"lat":40.59880572563569,"lng":22.972412109375},{"lat":40.59913139556281,"lng":22.973871231079105},{"lat":40.59782870633517,"lng":22.974665164947513}]}]'),
            showSimpleToast: showSimpleToast,
            openConfirmDialog: openConfirmDialog
		};

		return DisplayFactory;


        /**
         * Shows a simple toast with a given text
         * 
         * @param {str} text    The text to show 
         */
        function showSimpleToast(text) {
			$mdToast.show(
				$mdToast
					.simple()
					.parent(document.querySelectorAll("#leaflet"))
					.position("top right")
					.textContent(text)
					.hideDelay(3000)
			);
        }

        
        /**
         * Opens the Save Route Dialog
         * 
         * @param {obj} e           The click event
         * @param {obj} mainScope   The scope
         */
        function openConfirmDialog(e, mainScope) {
			// Due CORS policy in modern Browsers and because I am running the app localy
			// I had to write the HTML part of the dialog here
			// It can also be found in confirm_dialog.html
			var template =
				'<md-dialog aria-label="" disable-parent-scroll>' +
				'	<md-dialog-content class="md-dialog-content">' +
				'		<h2 class="md-title">Save Route</h2>' +
				'		<span class="md-dialog-content-body"><p>Give a name to your route in order to save it.</p></span>' +
				'		<form name="newRouteForm">' +
				'			<md-input-container style="width: 100%;">' +
				"				<label>Route Name</label>" +
				'				<input name="newRoute" ng-model="ctrl.new_route_name" required />' +
				'				<div ng-messages="newRouteForm.newRoute.$error">' +
				'					<div ng-message="required">This is required!</div>' +
				"				</div>" +
				"			</md-input-container>" +
				"		</form>" +
				"	</md-dialog-content>" +
				'	<md-dialog-actions layout="row">' +
				'		<md-button type="submit" ng-click="ctrl.cancel()">Cancel</md-button>' +
				'		<md-button type="submit" ng-click="ctrl.confirm()">Save</md-button>' +
				"	</md-dialog-actions>" +
				"</md-dialog>";

			$mdDialog.show({
				parent: angular.element(document.body),
				template: template,
				// templateUrl: "assets/templates/confirm_dialog.html",
                controller: ConfirmDialogController,
                controllerAs: 'ctrl',
				clickOutsideToClose: true,
				disableParentScroll: false,
                locals: mainScope,
                preserveScope: true,
				targetEvent: e,
			});

			ConfirmDialogController.$inject = ["$mdDialog", "locals", "MapFactory"];
			function ConfirmDialogController($mdDialog, locals, MapFactory) {
                var ctrl = this;

				// On confirm
				ctrl.confirm = function () {
					if (ctrl.new_route_name && ctrl.new_route_name.length > 0) {
						var newRoute = {
							name: ctrl.new_route_name,
							route: MapFactory.newRoute,
						};

						locals.list.unshift(newRoute);
						locals.saveRouteToStorage();
						locals.cancelEditMode();
						$mdDialog.hide();
					}
				};

				// On cancel
				ctrl.cancel = function () {
					$mdDialog.hide();
				};
			}
		}
	}
})();
