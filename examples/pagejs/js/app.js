(function () {

  //============= React components ================
  var Root = React.createClass({
    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('h2', null, "This is our root directory")
        )
      );
    }
  });

  var UserIndex = React.createClass({

    users: function () {
      var array = [];
      for (var i = 0; i < 10; i++) {
        array.push(
          React.createElement('div', null,
            React.createElement('a', {href: MakeRoutes.route('user_show', {id: i})}, "User " + i)
          )
        );
      }
      return array;
    },

    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('h2', null, "User Index"),
          React.createElement('div', null, this.users()),
          React.createElement('h3', null, 'Actions'),
          React.createElement('div',
            null,
            React.createElement('a', {href: MakeRoutes.route('user_new')}, 'create new user')),
          React.createElement('div',
            null,
            React.createElement('a', {href: MakeRoutes.route('user_search')}, 'search user'))
        )
      )
    }
  });

  var UserShow = React.createClass({
    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('h2', null, "Show User " + this.props.id),
          React.createElement('div', null, "Hello, user number " + this.props.id + "!"),
          React.createElement('div',
            null,
            React.createElement('a', {href: MakeRoutes.route('user_edit', {id: this.props.id})}, "Edit")),
          React.createElement('div',
            null,
            React.createElement('a', {href: MakeRoutes.route('user_albums', {user_id: this.props.id})}, "Albums"))
        )

      );
    }
  });

  var UserEdit = React.createClass({
    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('h2', null, "Edit User " + this.props.id),
          React.createElement('div', null, "Wow, you try to edit user number " + this.props.id + "!")
        )
      );
    }
  });

  var UserNew = React.createClass({
    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('h2', null, "Create user"),
          React.createElement('div', null, "Create new user?")
        )
      );
    }
  });

  var UserSearch = React.createClass({
    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('h2', null, "Search User"),
          React.createElement('div', null, "Let's try to find new users?")
        )
      )
    }
  });


  var UserAlbums = React.createClass({
    render: function () {
      return (
        React.createElement('div', null,
          React.createElement('h2', null, "Albums User " + this.props.user_id),
          React.createElement('div', null, "And here we look at the albums of user number " + this.props.user_id + "!")
        )
      );
    }
  });

  var user = {
    index: UserIndex,
    show: UserShow,
    edit: UserEdit,
    new: UserNew,
    search: UserSearch,
    albums: UserAlbums
  };

  //============= Routing ================


  MakeRoutes.init({
    default: {
      path: '/', to: Root
    },
    user: {
      index: user.index,
      edit: user.edit,
      new: user.new,
      search: user.search,
      show: user.show,
      member: {
        albums: user.albums
      }
    }
  });

  var routes = MakeRoutes.all();
  var container = document.getElementById('content');

  //============= Working with page.js ================

  for (var route in routes) {
    var to = routes[route].to;
    page(routes[route].path, function (to, ctx) {
        setTimeout(function (to, ctx) {
          React.render(
            React.createElement(to, ctx.params),
            container
          );
        }.bind(this, to, ctx), 0);
      }.bind(this, to)
    );
  }

  page('*', function (ctx, next) {
    React.render(
      React.createElement('div', null,
        "Page not found"
      ),
      container
    );
  });

  page();

})
();
