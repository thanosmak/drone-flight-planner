/**
 * Helper Factory 
 * Contains functionalities regarding the Map 
 */
(function () {
	angular.module("pixApp").factory("MapFactory", MapFactory);

	MapFactory.$inject = [];

	function MapFactory() {
		var MapFactory = {
			map: {},
			polyline: {},
			newRoute: [],
			allRoutes: [],
			markers: [],
			initMap: initMap,
			initPolyline: initPolyline,
			clearMarkers: clearMarkers,
			addMarker: addMarker,
		};

		return MapFactory;


		/**
		 * Init the Map
		 * 
		 * @param {obj} scope 	Controler's Scope 
		 */
		function initMap(scope) {
			var me = this;
			var osm_map_url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
			var latitude = 46.519962;
			var longitude = 6.633597;

			me.map = L.map("leaflet").on("load", onMapLoaded).setView([latitude, longitude], 16);
			me.initPolyline();

			var attribution_text = {
				attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
			};

			L.tileLayer(osm_map_url, attribution_text).addTo(me.map);

			me.map.on("click", onMapClick);

			
			/**
			 * On map click event
			 * 
			 * @param {obj} event 
			 */
			function onMapClick(event) {
				if (scope.editMode) {
					me.newRoute.push(event.latlng);
					var markerColor = (me.newRoute.length == 1) ? 'green' : 'red';

					me.addMarker(event.latlng, markerColor);

					console.log(me.newRoute);
					me.map.invalidateSize();
				}
			}


			/**
			 * On map load
			 */
			function onMapLoaded() {
				setTimeout(function () {
					MapFactory.map.invalidateSize();
				}, 100);
			}

			return me.map;
		}


		/**
		 * Adds a marker on the map and draws a line to that point
		 * 
		 * @param {obj} latlng 	The lat and lng 
		 * @param {str} color	The color of the marker 	
		 */
		function addMarker(latlng, color) {
			var newMarker = new L.Marker(latlng, {icon: getCustomColorMarkerIcon(color)});
			newMarker.addTo(this.map);
			this.markers.push(newMarker);
			this.polyline.addLatLng(latlng);
		}


		/**
		 * Returns the proper colored marker icon
		 * Accepted colors can be found here:
		 * https://github.com/pointhi/leaflet-color-markers
		 * 
		 * @param {str} color	The color 
		 */
		function getCustomColorMarkerIcon(color) {
			return new L.Icon({
				iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-'+ color +'.png',
				shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
				iconSize: [25, 41],
				iconAnchor: [12, 41],
				popupAnchor: [1, -34],
				shadowSize: [41, 41]
			  });
		}


		/**
		 * Init the polyline
		 */
		function initPolyline() {
			if (!MapFactory.polyline._map || MapFactory.polyline._map == null) {
				MapFactory.polyline = new L.Polyline([], { color: "red" }).addTo(this.map);
			}
		}


		/**
		 * Clear all markers and lines from the map
		 */
		function clearMarkers() {
			this.markers.forEach((marker) => {
				MapFactory.map.removeLayer(marker);
			});

			this.newRoute = [];
			this.polyline.removeFrom(MapFactory.map);
		}
	}
})();
