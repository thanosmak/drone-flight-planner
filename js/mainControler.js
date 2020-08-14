(function () {
	angular.module("pixApp").controller("mainControler", mainControler);

	mainControler.$inject = ["$scope", "$mdSidenav", "$mdDialog", "$mdToast", "MapFactory", "DisplayFactory"];

	function mainControler($scope, $mdSidenav, $mdDialog, $mdToast, MapFactory, DisplayFactory) {
		var route = [];
		var map = MapFactory.initMap($scope.editMode);
		var selected_route = null;

		$scope.list = getRouteFromStorage();
		// Comment/Uncomment the following line to start the App with 4 pre-sellected routes or not
		$scope.list = ($scope.list.length == 0) ? DisplayFactory.preSelectedRoutes : $scope.list;
		$scope.editMode = false;
		$scope.pix_logo =
			"data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA4NzYuMzEgNTk0LjMzIj48ZGVmcz48c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT48L2RlZnM+PHRpdGxlPlBpeDREX0xPR09fTUFJTl93aGl0ZV9WMl9SR0I8L3RpdGxlPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTc1Ny44OCw1MTIuNTlIODQ1LjVjMzIuOTQsMCw1Mi43OSwxNiw1Mi43OSw1MC42NmExMjMuMzEsMTIzLjMxLDAsMCwxLTEuMjcsMTYuOUw4NzEuNjksNzQwLjZjLTcuMTcsNDYtMjUuNzYsNjcuNTctNzIuNjMsNjcuNTdINzExWm0tNy4zNywyNjQuMzJoNDUuNmMyMi4zNywwLDM3LjE3LTExLDQxLTMzLjM1TDg2My4yNyw1NzcuMmE2My41MSw2My41MSwwLDAsMCwuODQtOC44NmMwLTE2LjQ5LTEyLjI3LTI0LjUtMzEuMjctMjQuNUg3ODcuMjVaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzIuNSAtMjEzLjgzKSIvPjxwYXRoIGlkPSJTVkdJRCIgY2xhc3M9ImNscy0xIiBkPSJNMzQ3LjI5LDQ1Ny4wNmMtMi41NCw0LjQ1LTEuODMsNy4xNy0uMjgsOC4yM2w3LjU2LTZoLS4yOVM0NDYuOTIsMzY1LjU4LDQ5MSwzMzMuNTFjMTkuMjgsMTcuMzQsMTA0LjA3LDc0LjksMTg0Ljc5LDEwMy44OCwxMDIuOTEsMzcsMjE1LjUxLDQ0LjA5LDIyMiw0MS40NywxMC00LDE0LjU0LTEzLjA4LDE3LTIzbC0yNi4xNi0uMzhoMGMtMi4xMywxLjA2LTEyMC43NC04LjE0LTIwNS45Mi00MS41N0M1ODEuMTMsMzc0LDQ5OC40NywzMDguNiw0OTEsMzA4LjZjLTE2LDAtMTM1LjQ4LDEzMi44NS0xNDMuNzIsMTQ4LjQ2IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtNzIuNSAtMjEzLjgzKSIvPjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+PHBhdGggaWQ9IlNWR0lELTIiIGRhdGEtbmFtZT0iU1ZHSUQiIGNsYXNzPSJjbHMtMSIgZD0iTTkzNCwyMTYuOTNjLTE1NC4wOCwxMzMuMjQtMjY4LDIxMS42NC01NzkuMzgsMjQyLjM2bC03LjU2LDZhMi44LDIuOCwwLDAsMCwxLjQ2LjQ5YzI5NiwyOC42OSw0ODAuNjMtODkuMjUsNTc2LjU2LTIwOS42LTE3LjQ0LDgwLjUyLTMxLjc4LDE4NS41Ny0zNS45NSwxOTguMjYtLjA5LjQ5LS4yOSwxLS4zOCwxLjM2bDI2LjE2LjI5Yy4xLS4zOSwyLjMyLTEyLDMuMS0xNywxLjc0LTEyLjIxLDI1LjI5LTE3MC4zNSwzMC42Mi0yMTMuMTguNTgtNC43NS4zOS05LjY5LTQuOTQtMTEuNjNhMTAuODEsMTAuODEsMCwwLDAtMi45MS0uNDljLTIuNTIsMC00Ljc1LDEuMzYtNi43OCwzLjEiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC03Mi41IC0yMTMuODMpIi8+PC9nPjxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTY2Ni4xOSw1MTIuNTUsNTUxLjk0LDY5Mi43bDguNDIsMjYuNzNINjM3bC0xNC40Nyw4Ny42OWgzNC44M2wxNC04Ny43MSwyMi42NiwwLDQuNC0zMC4zLTIyLC4yMiwyOC4wOS0xNzYuNzgtMzguMjksME02NDEuODYsNjg5LjM4SDU4OC40N0w2NjEuODgsNTY5WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTcyLjUgLTIxMy44MykiLz48cGF0aCBjbGFzcz0iY2xzLTEiIGQ9Ik0xMzIuNDcsNzE5Ljg0aDczLjljNTEuNDEsMCw2OS42MS0yMyw3Ny42NC03MS43NkwzMDYuNTEsNTA0YTExNS43NywxMTUuNzcsMCwwLDAsMS42LTE4LjIxYzAtMzYuNDItMjEuNDItNTMuNTUtNTYuMjMtNTMuNTVIMTMxLjY5TDcyLjUsODA3LjEzaDQ1Ljc2Wk0yNjEsNTAzLDIzOCw2NDkuMTRjLTMuNzUsMjEuNDMtMTUsMzEuMDctMzYuNDEsMzEuMDdIMTM4Ljg5bDMyLjY3LTIwOC4zMmg2My4xOGMxNy42OCwwLDI2Ljc4LDcsMjYuNzgsMjIuNUE0OS40NCw0OS40NCwwLDAsMSwyNjEsNTAzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTcyLjUgLTIxMy44MykiLz48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMzE1LjE4IDI5OC43NSAyNzEuNjcgMjk4Ljc1IDIyNS4zIDU5My4yOCAyNjguNzMgNTkzLjI4IDMxNS4xOCAyOTguNzUiLz48cG9seWdvbiBjbGFzcz0iY2xzLTEiIHBvaW50cz0iMzAxLjIgNTkzLjI5IDM5My4yOCA0NDAuOSAzNTAuMzcgMjk4Ljc2IDM5NS40NiAyOTguNzQgNDIwLjk0IDM5NS4xOSA0NzcuNSAyOTguNzQgNTIyLjkgMjk4Ljc2IDQzNC40NyA0NDUuMzQgNDc4Ljk1IDU5My4yOSA0MzQuNTEgNTkzLjI5IDQwNi45NSA0OTEuODUgMzQ3LjA3IDU5My4yOSAzMDEuMiA1OTMuMjkiLz48L3N2Zz4=";

		$scope.addNewRoute = addNewRoute;
		$scope.saveRoute = saveRoute;
		$scope.saveRouteToStorage = saveRouteToStorage;
		$scope.cancelEditMode = cancelEditMode;
		$scope.selectRoute = selectRoute;
		$scope.deleteSavedRoute = deleteSavedRoute;

		
		/**
		 * Enables the Edit Mode to add new Route
		 */
		function addNewRoute() {
			cancelEditMode();
			$scope.editMode = true;
			MapFactory.initPolyline();
		}


		/**
		 * Checks if user has added at least 2 points 
		 * on the map to open the Save Route Dialog
		 * 
		 * @param {obj} e 	The click event 
		 */
		function saveRoute(e) {
			if (MapFactory.newRoute.length >= 2) {
				DisplayFactory.openConfirmDialog(e, $scope);
			} else {
				var text = "Please choose at least 2 points";
				DisplayFactory.showSimpleToast(text)
			}
		}
		
		
		/**
		 * Saves user's saved routes to local storage
		 */
		function saveRouteToStorage() {
			localStorage.setItem("routes", JSON.stringify($scope.list));
		}
		
		
		/**
		 * Gets user's saved routes from local storage
		 */
		function getRouteFromStorage() {
			var routesStringified = localStorage.getItem("routes");

			if (routesStringified != null) {
				return JSON.parse(routesStringified);
			} else {
				return [];
			}
		}

		
		/**
		 * Cancels Edit Mode
		 */
		function cancelEditMode() {
			$scope.editMode = false;
			MapFactory.clearMarkers();
		}


		/**
		 * Shows on the map the selected route
		 * 
		 * @param {obj} item 	The selected route  
		 */
		function selectRoute(item) {
			cancelEditMode();

			// Check if the same route is already selected 
			if (selected_route != item) {
				MapFactory.initPolyline();

				// Add markers on map
				angular.forEach(item.route, function (point, index) {
					var latLong = L.latLng(parseFloat(point.lat), parseFloat(point.lng));
					var markerColor = (index == 0) ? 'green' : 'red';

					MapFactory.addMarker(latLong, markerColor);
				});

				// Flies to the coordinates of the route
				map.flyToBounds(MapFactory.polyline.getBounds(), { maxZoom: 16 });
				selected_route = item;
			} else {
				selected_route = null;
			}
		}


		/**
		 * Deletes the selected route from the saved routes list
		 * 
		 * @param {int} index 	The index of the selected route
		 */
		function deleteSavedRoute(e, index) {
			e.preventDefault();
			e.stopPropagation();
			
			cancelEditMode();
			$scope.list.splice(index, 1);
			$scope.saveRouteToStorage();
		}
	}
})();
