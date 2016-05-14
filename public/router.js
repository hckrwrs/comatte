var App = Vue.extend({})

var router = new VueRouter()

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
            url: '/api/guchi/sessions/sign_in',
            data: JSON.stringify({name: name}),
          }).done(function (data) {
            console.log(data);
            // TODO: userオブジェクトをセッションストアに格納
            router.redirect('/guchis');
          }).fail(function () {
            // ほとんどの場合ユーザーが存在しない
            router.go('/sign_up');
          });
        },
      }
    })
  },
  '/sign_up': {
    component: Vue.extend({
      template: '#sign_up'
    })
  },
  '/guchis': {
    component: Vue.extend({
      template: '#guchis'
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
