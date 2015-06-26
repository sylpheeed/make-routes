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

    function makeResult(path, obj) {
      for (var key in obj) {
        var to = false;
        if (check(obj[key]).isFunction()) {
          to = obj[key];
        } else if (obj[key].to) {
          to = obj[key].to;
          key = routeToPath(obj[key]) || key;
        }
        var argsArray = [].slice.call(arguments, 2);
        result[key] = setResult.apply(this, [path, key, to].concat(argsArray));
      }
    }

    function addMember(key) {
      var memberPath = '' + new_path + '/:' + hashKey + '_id';
      var member = hash[key];
      makeResult(memberPath, member);
    }

    function addCollection(key) {
      var collectionPath = new_path;
      var collection = hash[key];
      makeResult(collectionPath, collection, true);
    }

    function setResult(path, action, to) {
      var collection = arguments[3];

      if (!collection) {
        switch (action) {
          case 'show':
            action = ':id';
            break;
          case 'edit':
            action = ':id/edit';
            break;
          case 'index':
            action = false;
            break;
        }
      }

      if (!path) {
        path = action;
        action = false;
      }

      path = action ? '/' + path + '/' + action : '/' + path;
      return {path: path, to: to};
    }

    for (var key in hash) {
      var current = hash[key];
      if (check(current).isFunction()) {
        result[key] = setResult(new_path, key, current);
      } else if (check(current).isObject()) {
        var _path = current.path ? routeToPath(current) : key;
        if (current.to) {
          result[key] = setResult(new_path, _path, current.to);
        } else if (check(key).isMember()) {
          addMember(key);
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
        result = {path: current.path, to: current.to};
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
      isMember: function isMember() {
        return value === 'member';
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
    showRoutes: function showRoutes() {
      var resultRoutes = {};
      for (var route in _routes) {
        resultRoutes[route] = _routes[route].path;
      }
      return resultRoutes;
    },
    route: function route(key, params) {
      return buildRoute(key, params);
    }
  };
})();
