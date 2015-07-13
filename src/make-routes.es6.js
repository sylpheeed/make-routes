export default (function () {

  let paths;
  let _routes;
  let _extra;

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
      let res = {path: path, to: to};
      if (_extra) {
        res._extra = _extra;
      }
      return res;
    }

    for (let key in hash) {
      _extra = false;
      let current = hash[key];
      let type = check(current);
      //Check if type is string or function, send it to final result if not then go deeper
      if (type.isFunction() || type.isString()) {
        result[key] = setResult(new_path, key, current);
      } else if (type.isObject()) {
        //Check for extra params;
        _extra = current._extra ? current._extra : false;
        let _path = current.path ? routeToPath(current) : key;
        type = check(key);
        if (current.to) {
          result[key] = setResult(new_path, _path, current.to);
        } else if (type.isMember()) {
          addMember(key);
        } else if (type.isCollection()) {
          addCollection(key);
        } else {
          result[key] = makePaths(hash[key], new_path, _path);
        }
      }
    }
    return result;
  }


  function makeRoutes(obj = paths, key = false) {
    for (let objKey in obj) {
      let current = obj[objKey];
      let result = false;
      let _extra = false;
      if (current.path) {
        result = {path: current.path, to: current.to};
        delete obj[objKey].path;
        delete obj[objKey].to;
      }

      let resultKey = key ? `${key}_${objKey}` : objKey;

      if (obj[objKey]._extra) {
        _extra = obj[objKey]._extra;
        delete obj[objKey]._extra;
      }

      if (check(obj[objKey]).isEmpty()) {
        paths[resultKey] = result;
        if (_extra) {
          paths[resultKey]._extra = _extra;
        }
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
      isString: function isFunction() {
        return typeof value === 'string';
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


  let helpers = {
    showRoutes: function () {
      let resultRoutes = {};
      for (let route in _routes) {
        resultRoutes[route] = _routes[route].path;
      }
      return resultRoutes;
    },
    each: function (callback, any) {
      for (let route in _routes) {
        callback(_routes[route], route);
      }
      if (any) {
        any();
      }
    }
  };

  return {
    init: function init(hash) {
      buildRoutes(hash);
      return this;
    },
    all: function all() {
      return _routes;
    },
    route: buildRoute,
    showRoutes: helpers.showRoutes,
    each: helpers.each
  };
})();
