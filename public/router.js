var App = Vue.extend({})

var router = new VueRouter()

router.map({
  '/sign_in': {
    component: Vue.extend({
      template: '#sign_in'
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
