export default (function () {

  let paths;
  let _routes;

  function makePaths(hash, path = '', hashKey = false) {
    let result = {};
    let new_path = '';
    if (hashKey) {
      new_path = path ? `${path}/${hashKey}` : hashKey;
    }


    function makeResult(path, obj) {
      for (var key in obj) {
        let to = false;
        if (check(obj[key]).isFunction()) {
          to = obj[key];
        } else if (obj[key].to) {
          to = obj[key].to;
          key = routeToPath(obj[key]) || key;
        }
        let argsArray = [].slice.call(arguments, 2);
        result[key] = setResult.apply(this, [path, key, to].concat(argsArray));
      }
    }

    function addMember(key) {
      let memberPath = '' + new_path + '/:' + hashKey + '_id';
      let member = hash[key];
      makeResult(memberPath, member);
    }

    function addCollection(key) {
      let collectionPath = new_path;
      let collection = hash[key];
      makeResult(collectionPath, collection, true);
    }

    function setResult(path, action, to, collection = false) {

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
        } else if (check(key).isMember()) {
          addMember(key);
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
      isMember: function() {
        return value === 'member';
      },
      isCollection: function() {
        return value === 'collection';
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
    showRoutes: function() {
      let resultRoutes = {};
      for (var route in _routes) {
        resultRoutes[route] = _routes[route].path;
      }
      return resultRoutes;
    },
    route: function (key, params) {
      return buildRoute(key, params);
    }
  };
})();
