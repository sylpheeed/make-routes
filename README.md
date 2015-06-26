# make-routes

**This library is only wrapper for other navigation library like [page.js](https://github.com/visionmedia/page.js), [routie](https://github.com/jgallen23/routie) and etc.**

Make-routes is a small(1.6kb) JavaScript library for creating beautiful routes in object style!



Examples:
[demo](http://sylpheeed.github.io/make-routes/examples/)

# Usage

### Installation

#### Via include script
```html
 <script src="make-routes.min.js"></script>
```

#### Via npm
```
 npm install make-routes
```
### Basic usage
```javascript
MakeRoutes.init({
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

### Working with resources
```javascript
MakeRoutes.init({
  user: {
   index: function () {
     //... do something when route is /user
   },
   show: function () {
     //... do something when route is /user/:id
   },
   edit: function(){
     //... do something when route is /user/:id/edit
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

### Working with member
```javascript
MakeRoutes.init({
  user: {
    member: {
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

### Working with collection
```javascript
MakeRoutes.init({
  user: {
    collection: {
      index: function () {
        //... do something when route is /user/index
      },
      show: function () {
        //... do something when route is /user/show
      },
      edit: function () {
        //... do something when route is /user/edit
      }
    }
  },
});
  
console.log(MakeRoutes.all());
 //=>
 // {
 //   user_index: {path: '/user/index', to: function(){...}},
 //   user_show: {path: '/user/show', to: function(){...}},
 //   user_edit: {path: '/user/edit', to: function(){...}},
 // }
```

### Nesting support
```javascript
MakeRoutes.init({
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
MakeRoutes.init({
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

Route building helps easy to build urls for use in your application.

```javascript
MakeRoutes.init({
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

### ShowRoutes helper

```javascript
MakeRoutes.init({
  index: function () {},
  show: function () {},
  edit: function () {},
  new: function () {}
});
  
console.log(MakeRoutes.showRoutes());
 //=> {
 //=> user_index: "/user"
 //=> user_show: "/user/:id"
 //=> user_edit: "/user/:id/edit"
 //=> user_new: "/user/new"
 //=> }
```

