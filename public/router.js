var App = Vue.extend({});

var router = new VueRouter();


var URL_BASE = 'http://seishun-api.pocke.me';
//var URL_BASE = 'http://192.168.100.246:3000';
function create_url(endpoint) {
  // TODO: ここを書き換えてURL作る
  // return '/api/guchi' + endpoint
  return URL_BASE + '/guchi' + endpoint;
}

var MasterData = $.ajax({
  // /master_data は /guchi 下でないので、 create_url が使えない
  url: URL_BASE + '/master_data',
  method: 'POST',
});

Vue.component("g-header", {
  template: "#g-header",
  props: ['title', 'path'],
});

router.map({
  '/': {
    component: Vue.extend({
      created: function () {
        router.go('/guchis');
      }
    })
  },
  '/sign_in': {
    component: Vue.extend({
      template: '#sign_in',
      data: function () {
        return {
          name: ''
        };
      },
      methods: {
        sign_in: function () {
          var name = this.name;
          $.ajax({
            url: create_url('/sessions/sign_in'),
            data: JSON.stringify({name: name}),
          }).done(function (data) {
            setUser(data.data);
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
      data: function () {
        return {
          icons: [],
          sexes: [],
        };
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
            setUser(data.data);
            router.go('/guchis');
          });
        }
      },
      created: function () {
        var self = this;
        MasterData.done(function (data) {
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
          user: getUser(),
          guchis: [],
          guchi_text: "", // 愚痴る為のテキスト
        };
      },
      created: function () {
        set_polling(this.fetch_guchis);
        this.fetch_guchis();
      },
      methods: {
        fetch_guchis: function () {
          var self = this;
          $.ajax({
            url: create_url('/guchis')
          }).done(function (data) {
            self.guchis = data;
          }).fail(function () {
            // XXX: セッション切れてる？
          });
        },
        guchiru: function () {
          var self = this;
          $.ajax({
            url: create_url('/guchis/create'),
            data: JSON.stringify({
              content: self.guchi_text,
            }),
          }).done(function (data, status, xhr) {
            self.guchis.unshift(data);
          });
          this.guchi_text = "";
        },
      },
    }),
    auth: true
  },
  '/guchis/:guchi_id': {
    name: 'guchi',
    auth: true,
    component: Vue.extend({
      template: '#guchi',
      data: function () {
        return {
          guchi: {},
          timeago: '',
        };
      },
      created: function () {
        set_polling(this.fetch_guchi);
        this.fetch_guchi();
      },
      methods: {
        fetch_guchi: function () {
          var guchi_id = this.$route.params.guchi_id;
          var self = this;
          timeago = 
          $.ajax({
            url: create_url('/guchis/' + guchi_id)
          }).done(function (data) {
            self.guchi = data.data;
            self.guchi.replies.forEach(function (rep) {
              $.ajax({
                url: create_url('/deai_users/' + rep.deai_user_id),
              }).done(function (data, status, xhr) {
                Vue.set(rep, 'deai_user', data.data);
              });
            });
          });
        }
      }
    }),
  },
  '/guchis/:guchi_id/replies/:deai_user_id': {
    name: 'replies',
    component: Vue.extend({
      template: '#replies',
      data: function () {
        return {
          replies: [],
          reply_content: '',
          guchi_id: '',
          deai_user:[],
        }
      },
      created: function () {
        var self = this;
        $.ajax({
          url: create_url('/deai_users/' + this.$route.params.deai_user_id),
        }).done(function (data, status, xhr) {
          self.deai_user = data.data;
        });
        set_polling(this.fetch_replies);
        this.fetch_replies();
      },
      methods: {
        fetch_replies: function () {
          var guchi_id = this.$route.params.guchi_id;
          this.guchi_id = guchi_id;
          var deai_user_id = this.$route.params.deai_user_id
          var self = this;
          console.log(this);
          $.ajax({
            url: create_url('/replies'),
            data: JSON.stringify({
              guchi_id: guchi_id,
              deai_user_id: deai_user_id
            })
          }).done(function (data) {
            self.replies = data;
          });
        },
        reply: function () {
          var reply_content = this.reply_content;
          var guchi_id = this.$route.params.guchi_id;
          var deai_user_id = this.$route.params.deai_user_id
          var self = this;

          $.ajax({
            url: create_url('/replies/create'),
            data: JSON.stringify({
              guchi_id: guchi_id,
              deai_user_id: deai_user_id,
              content: reply_content
            }),
          }).done(function (data) {
            self.fetch_replies();
            self.reply_content = '';
          })
        }
      }
    }),
    auth: true
  },
});

router.beforeEach(function (transition) {
  var authenticated = getUser();
  if (transition.to.auth && !authenticated) {
    transition.redirect('/sign_in');
  }
  else {
    transition.next();
  }
});

router.start(App, '#app');



// interval_id をstop/start
var current_interval_event = null;
function set_polling(to_be_intervaled) {
  if (current_interval_event) {
    clearInterval(current_interval_event);
  }
  if (to_be_intervaled) {
    current_interval_event = setInterval(function () {
      to_be_intervaled();
    }, 2000);
  }
}


// Save user object into localstorage
function getUser() {
  var user = localStorage.getItem('user');
  if (!user) {
    return null;
  }
  try {
    return JSON.parse(user);
  } catch (e) {
    return null;
  }
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}
