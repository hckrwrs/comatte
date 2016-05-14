var App = Vue.extend({});

var router = new VueRouter();

router.map({
  '/sign_in': {
    component: Vue.extend({
      template: '#sign_in',
      data: {
        name: ''
      },
      methods: {
        sign_in: function () {
          var name = this.name;
          $.ajax({
            url: create_url('/sessions/sign_in'),
            data: JSON.stringify({name: name}),
          }).done(function (data) {
            console.log(data);
            // TODO: userオブジェクトをセッションストアに格納
            router.go('/guchis');
          }).fail(function () {
            // ほとんどの場合ユーザーが存在しないのでサインアップへ
            router.go('/sign_up');
          });
        },
      }
    })
  },
  '/sign_up': {
    component: Vue.extend({
      template: '#sign_up',
      data: {

      },
      methods: {
        sign_up: function () {
          $.ajax({
            url: create_url('/sessions/sign_up'),
            data: JSON.stringify({
              name: this.name,
              icon_id: this.icon_id,
              sex_id: this.sex_id
            }),
          }).done(function (data) {
            console.log(data);
            // TODO: userオブジェクトをセッションストアに格納
            router.go('/guchis');
          }).fail(function () {
            // ほとんどの場合ユーザーが存在しないのでサインアップへ
            router.go('/sign_up');
          });
        }
      }
    })
  },
  '/guchis': {
    component: Vue.extend({
      template: '#guchis'
    }),
    data: {},
    methods: {
      fetch_guchis: function () {
        $.ajax({
          url: create_url('/guchis'),
          data: JSON.stringify({
            name: this.name,
            icon_id: this.icon_id,
            sex_id: this.sex_id
          }),
        }).done(function (data) {
          console.log(data);
          // TODO: userオブジェクトをセッションストアに格納
          router.go('/guchis');
        }).fail(function () {
          // ほとんどの場合ユーザーが存在しないのでサインアップへ
          router.go('/sign_up');
        });
      }
    }
    // auth: true
  },
  // '/guchis/:guchi_id': {
  '/guchi': {
    component: Vue.extend({
      template: '#guchi'
    }),
    // auth: true
  },
  // '/guchis/:guchi_id/replies': {
  '/replies': {
    component: Vue.extend({
      template: '#replies'
    }),
    // auth: true
  },
});

router.beforeEach(function (transition) {
  if (transition.to.auth && !authenticated) {
    transition.redirect('/sign_in');
  }
  else {
    transition.next();
  }
});

router.start(App, '#app');



var URL_BASE = 'http://127.0.0.1:3000';
function create_url(endpoint) {
  // TODO: ここを書き換えてURL作る
  // return '/api/guchi' + endpoint
  return URL_BASE + '/guchi/' + endpoint;
}

var MasterData = $.ajax({
  // /master_data は /guchi 下でないので、 create_url が使えない
  url: URL_BASE + '/master_data',
  method: 'POST',
});

// Save user object into localstorage
function getUser() {
  var user = localStorage.getItem('user');
  if (!user) {
    return null;
  }
  return JSON.parse(user);
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}
