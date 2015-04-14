# make-routes

**This library is only wrapper for other navigation library like [page.js](https://github.com/visionmedia/page.js), [routie](https://github.com/jgallen23/routie) and etc.**

Make-routes is a small(1.6kb) JavaScript library for creating beautiful routes in object style!



Examples:
[demo](http://sylpheeed.github.io/make-routes/examples/)

# Usage

### Including file:
```html
 <script src="make-routes.min.js"></script>
```

### Basic usage
```javascript
var routes = MakeRoutes.init({
    user: {
      friends: function () {
        //... do something when route is /user/friends
      },
    },
  });
  
 console.log(MakeRoutes.all());
 //=>
 // {
 //   user_friends: {path: '/user/friends', to: function(){...}}
 // }
```

### Working with rescources
```javascript
var routes = MakeRoutes.init({
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
  });
  
  console.log(MakeRoutes.all());
 //=>
 // {
 //   user_show: {path: '/user/:id', to: function(){...}}, 
 //   user_index: {path: '/user', to: function(){...}}, 
 //   user_new: {path: '/user/new', to: function(){...}}, 
 // }
```

### Working with collection
```javascript
var routes = MakeRoutes.init({
    user: {
      collection: {
        albums: function () {
          //... do something when route is /user/:user_id/albums
        }
      }
    },
  });
  
 console.log(MakeRoutes.all());
 //=>
 // {
 //   user_albums: {path: '/user/:user_id/albums', to: function(){...}}, 
 // }
```

### Nesting support
```javascript
var routes = MakeRoutes.init({
    user: {
      friends: {
        actived: function(){
         //... do something when route is /user/friends/actived
        }
      }
    },
  });
  
 console.log(MakeRoutes.all());
 //=>
 // {
 //   user_friends_actived: {path: '/user/friends/actived', to: function(){...}}, 
 // }
```

You can also specify your own path

### Specify your own path
```javascript
var routes = MakeRoutes.init({
    user: {
      path: '/superuser'
      friends: {
        actived: function(){
         //... do something when route is /superuser/friends/actived
        }
      }
    },
  });
  
 console.log(MakeRoutes.all());
 //=>
 // {
 //   user_friends_actived: {path: '/superuser/friends/actived', to: function(){...}}, 
 // }
```

### Route building
```javascript
var routes = MakeRoutes.init({
    user: {
      collection: {
        albums: function () {
          //... do something when route is /user/:user_id/albums
        }
      }
    },
  });
  
 console.log(MakeRoutes.route('user_albums', {user_id: 1}));
 //=> /user/1/albums
```

