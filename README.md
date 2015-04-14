# make-routes

Make-rotes is a small(1.6kb) JavaScript library for creating beautiful routes in object style!

Examples:
[demo](http://sylpheeed.github.io/make-routes/examples/)

# Usage

### Including file:
```html
 <script src="make-routes.min.js"></script>
```

### Basic usage
```javascript
var routes = {
    user: {
      friends: function () {
        //... do something when route is /user/friends
      },
    },
  };
var resultRoutes = MakeRoutes.init(routes);
```

### Working with rescources
```javascript
var routes = {
    user: {
      show: function () {
        //... do something when route is /user/:id
      },
      index: function () {
        //... do something when route is /user
      },
      new: function(){
        //... do something when route is /user/new
      },
    },
  };
var resultRoutes = MakeRoutes.init(routes);
```

### Collection support
```javascript
var routes = {
    user: {
      //...
      collection: {
        albums: function () {
          //... do something when route is /user/:user_id/albums
        }
      }
    },
  };
var resultRoutes = MakeRoutes.init(routes);
```
