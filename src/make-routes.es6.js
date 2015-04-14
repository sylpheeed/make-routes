export default (function () {

  let paths;
  let _routes;

  function makePaths(hash, path = '', hashKey = false) {
    let result = {};
    let new_path = '';
    if (hashKey) {
      new_path = path ? `${path}/${hashKey}` : hashKey;
    }


    function addCollection(key) {
      let collectionPath = `${new_path}/:${hashKey}_id`;
      let collection = hash[key];
      for (let collectionKey in collection) {
        let to = false;
        if (check(collection[collectionKey]).isFunction()) {
          to = collection[collectionKey]
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

      path = action ? `/${path}/${action}` : `/${path}`;
      return {path: path, to: to};
    }

    for (let key in hash) {
      let current = hash[key];
      if (check(current).isFunction()) {
        result[key] = setResult(new_path, key, current);
      } else if (check(current).isObject()) {
        let path = current.path ? routeToPath(current) : key;
        if (current.to) {
          result[key] = setResult(new_path, path, current.to);
        } else if (check(key).isCollection()) {
          addCollection(key);
        } else {
          result[key] = makePaths(hash[key], new_path, path);
        }
      }
    }
    return result;
  }


  function makeRoutes(obj = paths, key = false) {
    for (let objKey in obj) {
      let current = obj[objKey];
      let result = false;
      if (current.path) {
        result = {path: current.path, to: current.to};
        delete obj[objKey].path;
        delete obj[objKey].to;
      }

      let resultKey = key ? `${key}_${objKey}` : objKey;

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
      isFunction: function() {
        return typeof value === 'function';
      },
      isObject: function() {
        return value !== null && typeof value === 'object';
      },
      isEmpty: function() {
        return Object.keys(value).length === 0;
      },
      isCollection: function() {
        return value === 'collection'
      }
    }
  }


  function routeToPath(route){
    return route.path ? route.path.split('/')[1] : false;
  }

  const buildRoute = function (key, params) {
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
        return false
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
    init: function (hash) {
      buildRoutes(hash);
    },
    all: function () {
      return _routes;
    },
    route: function (key, params) {
      return buildRoute(key, params);
    }
  };
})();
