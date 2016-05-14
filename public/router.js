var App = Vue.extend({});

var router = new VueRouter();


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

router.map({
  '/sign_in': {
    component: Vue.extend({
      template: '#sign_in',
      data: function () {
        return {
          name: ''
        }
      },
      methods: {
        sign_in: function () {
          var name = this.name;
          $.ajax({
            url: create_url('/sessions/sign_in'),
            data: JSON.stringify({name: name}),
          }).done(function (data) {
            setUser(data);
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
<<<<<<< HEAD
      data: function() {return {
        icons: [],
        sexes: [],
      };},
=======
      data: function () {},
>>>>>>> 7656a40113192a8eb5d651e5694e62738cb0ad96
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
            setUser(data);
            router.go('/guchis');
          }).fail(function () {
            // ほとんどの場合ユーザーが存在しないのでサインアップへ
            router.go('/sign_up');
          });
        }
      },
      created: function(){
        var self = this;
        MasterData.done(function(data){
          console.log(data)
          self.icons = data.data.icons;
          self.sexes = data.data.sexes;
        });
      }
    })
  },
  '/guchis': {
    component: Vue.extend({
      template: '#guchis',
      data: function () {
        return {
          guchis: [{content: 'hogehoge'}]
        }
      },
      created: function () {
        this.fetch_guchis();
      },
      methods: {
        fetch_guchis: function () {
          var self = this;
          $.ajax({
            url: create_url('/guchis')
          }).done(function (data) {
            self.guchis = data;
            // this.$set('guchis', data);
          }).fail(function () {
            // XXX: セッション切れてる？
          });
        }
      }
    }),
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
