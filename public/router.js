var App = Vue.extend({})

var router = new VueRouter()

router.map({
  '/sign_in': {
    component: Vue.extend({
      el: '#sign_in'
    })
  },
  '/sign_up': {
    component: Vue.extend({
      el: '#sign_up'
    })
  },
  '/guchis': {
    component: Vue.extend({
      el: '#guchis'
    }),
    auth: true
  },
  '/guchis/:guchi_id': {
    component: Vue.extend({
      el: '#guchi'
    }),
    auth: true
  },
  '/guchis/:guchi_id/replies': {
    component: Vue.extend({
      el: '#replies'
    }),
    auth: true
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
