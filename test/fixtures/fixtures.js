import angular from 'angular';
import _ from '@iml/lodash-mixins';

export default angular
  .module('fixtures', [])
  .run(function(fixtures) {
    'ngInject';
    fixtures
      .registerFixture('session', {
        read_enabled: true,
        resource_uri: '/api/session/',
        user: {
          accepted_eula: false,
          alert_subscriptions: [],
          email: 'debug@debug.co.eh',
          eula_state: 'eula',
          first_name: '',
          full_name: '',
          groups: [
            { id: '1', name: 'superusers', resource_uri: '/api/group/1/' }
          ],
          id: '1',
          is_superuser: true,
          last_name: '',
          new_password1: null,
          new_password2: null,
          password1: null,
          password2: null,
          resource_uri: '/api/user/1/',
          username: 'debug'
        }
      })
      .registerFixture('session', 200, {
        read_enabled: true,
        resource_uri: '/api/session/',
        user: null
      })
      .registerFixture('session', 400, {
        password: ['This field is mandatory'],
        username: ['This field is mandatory']
      })
      .registerFixture('session', {
        read_enabled: true,
        resource_uri: '/api/session/',
        user: {
          accepted_eula: false,
          alert_subscriptions: [],
          email: 'admin@debug.co.eh',
          eula_state: 'denied',
          first_name: '',
          full_name: '',
          groups: [
            {
              id: '2',
              name: 'filesystem_administrators',
              resource_uri: '/api/group/2/'
            }
          ],
          id: '2',
          is_superuser: false,
          last_name: '',
          new_password1: null,
          new_password2: null,
          password1: null,
          password2: null,
          resource_uri: '/api/user/2/',
          username: 'admin'
        }
      });
  })
  .service('fixtures', function() {
    const fixtures = {};

    this.registerFixture = function registerFixture(
      name,
      status,
      data,
      headers
    ) {
      if (_.isPlainObject(status)) {
        data = status;
        status = 200;
      }

      const fixture = {
        status: status,
        data: data,
        toArray: function() {
          const out = [this.status, this.data];

          if (this.headers) out.push(this.headers);

          return out;
        }
      };

      if (headers) fixture.headers = headers;

      const group = (fixtures[name] = fixtures[name] || []);

      group.push(fixture);

      return this;
    };

    this.asName = function(name) {
      return {
        getFixtures: this.getFixtures.bind(this, name),
        getFixture: this.getFixture.bind(this, name)
      };
    };

    this.getFixtures = function(name, filter) {
      const group = fixtures[name] || [];

      return group.filter(filter);
    };

    this.getFixture = function(name, filter) {
      const group = fixtures[name] || [];

      const fixture = group.filter(filter)[0];

      if (!fixture)
        throw new Error(`No matching fixtures found under ${name}!`);

      return _.cloneDeep(fixture);
    };
  }).name;
