# drone-flight-planner
A drone flight planner JS App with AngularJS + Leaflet

# Libraries and Technologies used
* AngularJS v1.8.0
* AngularJS Material v1.2.0
* Leaflet v1.6.0
* Material Design Icons


The App keeps the saved routes localy on the browser. 

When the App starts it has 4 pre-selected saved routes for testing purposes. In case you delete ALL routes and refresh, the 4 pre-selected routes will appear again.

In case you want to disable them and use the App regulary, just comment out line 13 in mainController.js
```
// $scope.list = ($scope.list.length == 0) ? DisplayFactory.preSelectedRoutes : $scope.list;
```
