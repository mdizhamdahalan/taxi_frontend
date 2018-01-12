# Google Places based autocomplete directive for Ionic framework

by [http://devfanaticblog.com](http://devfanaticblog.com)

[Update for Ionic 2](http://devfanaticblog.com/google-maps-autocomplete-for-ionic-2-applications/)

How to use:

* Add Google maps to your project:
```
<script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?libraries=places,geometry&sensor=false"></script>
```
* Add ion-place-autocomplete.js and ion-place-autocomplete.css to your project
* Use directive as following:
```
<ion-google-place placeholder="Your address" ng-model="yourModel" location-changed="yourLocationChangeCallback"/>
```

## [Demo](http://codepen.io/ivanthecrazy/pen/vNaLJx)
