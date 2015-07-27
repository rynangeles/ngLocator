Google maps API angular
====

Simple Google map API `Autocomplete` binded to `Map` with `Marker`.

Usage
----

```
// app.js
angular.module('app', ['locator', . . .]);

// template.html
<ng-locator location="location.detail"></ng-locator>
```

`location.detail` - model to bind with.

return
----
`location.detail.address`

`location.detail.coords`

`location.detail.city`

`location.detail.state`

`location.detail.postal`