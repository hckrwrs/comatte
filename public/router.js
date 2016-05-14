var App = Vue.extend({})

var router = new VueRouter()

router.map({
  '/sign_in': {
    component: Vue.extend({})
  },
  '/sign_up': {
    component: Vue.extend({})
  },
  '/guchis': {
    component: Vue.extend({}),
    auth: true
  },
  '/guchis/:guchi_id': {
    component: Vue.extend({}),
    auth: true
  },
  '/guchis/:guchi_id/replies': {
    component: Vue.extend({}),
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
