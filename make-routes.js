var MakeRoutes = (function () {

  var paths = undefined;
  var _routes = undefined;

  function makePaths(hash) {
    var path = arguments[1] === undefined ? '' : arguments[1];
    var hashKey = arguments[2] === undefined ? false : arguments[2];

    var result = {};
    var new_path = '';
    if (hashKey) {
      new_path = path ? '' + path + '/' + hashKey : hashKey;
    }

    function addCollection(key) {
      var collectionPath = '' + new_path + '/:' + hashKey + '_id';
      var collection = hash[key];
      for (var collectionKey in collection) {
        var to = false;
        if (check(collection[collectionKey]).isFunction()) {
          to = collection[collectionKey];
        } else if (collection[collectionKey].to) {
          to = collection[collectionKey].to;
          collectionKey = routeToPath(collection[collectionKey]) || collectionKey;
        }
        result[collectionKey] = setResult(collectionPath, collectionKey, to);
      }
    }

    function setResult(path, action, to) {
      switch (action) {
        case 'show':
          action = ':id';
          break;
        case 'index':
          action = false;
          break;
      }

      if (!path) {
        path = action;
        action = false;
      }

      path = action ? '/' + path + '/' + action : '/' + path;
      return { path: path, to: to };
    }

    for (var key in hash) {
      var current = hash[key];
      if (check(current).isFunction()) {
        result[key] = setResult(new_path, key, current);
      } else if (check(current).isObject()) {
        var _path = current.path ? routeToPath(current) : key;
        if (current.to) {
          result[key] = setResult(new_path, _path, current.to);
        } else if (check(key).isCollection()) {
          addCollection(key);
        } else {
          result[key] = makePaths(hash[key], new_path, _path);
        }
      }
    }
    return result;
  }

  function makeRoutes() {
    var obj = arguments[0] === undefined ? paths : arguments[0];
    var key = arguments[1] === undefined ? false : arguments[1];

    for (var objKey in obj) {
      var current = obj[objKey];
      var result = false;
      if (current.path) {
        result = { path: current.path, to: current.to };
        delete obj[objKey].path;
        delete obj[objKey].to;
      }

      var resultKey = key ? '' + key + '_' + objKey : objKey;

      if (check(obj[objKey]).isEmpty()) {
        paths[resultKey] = result;
      } else {
        makeRoutes(obj[objKey], resultKey);
        delete obj[objKey];
      }
    }
  }

  function check(value) {
    return {
      isFunction: function isFunction() {
        return typeof value === 'function';
      },
      isObject: function isObject() {
        return value !== null && typeof value === 'object';
      },
      isEmpty: function isEmpty() {
        return Object.keys(value).length === 0;
      },
      isCollection: function isCollection() {
        return value === 'collection';
      }
    };
  }

  function routeToPath(route) {
    return route.path ? route.path.split('/')[1] : false;
  }

  var buildRoute = function buildRoute(key, params) {
    function replaceParams(string) {
      if (params) {
        for (var p in params) {
          string = string.replace(':' + p, params[p]);
        }
      }
      return string;
    }

    function checkRoute() {
      if (_routes[key]) {
        return true;
      } else {
        console.warn('Invalid route name: ', key);
        return false;
      }
    }

    return checkRoute() ? replaceParams(_routes[key].path) : '';
  };

  function buildRoutes(hash) {
    paths = makePaths(hash);

    makeRoutes(paths);
    _routes = paths;
  }

  return {
    init: function init(hash) {
      buildRoutes(hash);
    },
    all: function all() {
      return _routes;
    },
    route: function route(key, params) {
      return buildRoute(key, params);
    }
  };
})();
