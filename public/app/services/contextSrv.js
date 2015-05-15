define([
  'angular',
  'lodash',
  'store',
  'config',
],
function (angular, _, store, config) {
  'use strict';

  var module = angular.module('grafana.services');

  module.service('contextSrv', function($rootScope, $timeout, $location, alertSrv) {
    var self = this;

    function User() {
      if (window.grafanaBootData.user) {
        _.extend(this, window.grafanaBootData.user);
      }
    }

    this.version = config.buildInfo.version;
    this.lightTheme = false;
    this.user = new User();
    this.isSignedIn = this.user.isSignedIn;
    this.isGrafanaAdmin = this.user.isGrafanaAdmin;
    this.sidemenu = store.getBool('grafana.sidemenu');

    // events
    $rootScope.$on('toggle-sidemenu', function() {
      self.toggleSideMenu();
    });

    this.hasRole = function(role) {
      return this.user.orgRole === role;
    };

    this.setSideMenuState = function(state) {
      this.sidemenu = state;
      store.set('grafana.sidemenu', state);
    };

    this.toggleSideMenu = function() {
      this.setSideMenuState(!this.sidemenu);

      $timeout(function() {
        $rootScope.$broadcast("render");
      }, 50);
    };

    this.getSidemenuDefault = function() {
      return this.hasRole('Admin');
    };

      this.checkPermissions = function() {
          if (this.isViewer) {
              alertSrv.set('Don\'t have permission', 'You are "Viewer" user role and don\'t have permission to this page', 'warning', 7001);
              $location.path('');
              return;
          }
      };

    this.version = config.buildInfo.version;
    this.lightTheme = false;
    this.user = new User();
    this.isSignedIn = this.user.isSignedIn;
    this.isGrafanaAdmin = this.user.isGrafanaAdmin;
    this.sidemenu = store.getBool('grafana.sidemenu', this.getSidemenuDefault());

    if (this.isSignedIn && !store.exists('grafana.sidemenu')) {
      // If the sidemenu has never been set before, set it to false.
      // This will result in this.sidemenu and the localStorage grafana.sidemenu
      // to be out of sync if the user has an admin role.  But this is
      // intentional and results in the user seeing the sidemenu only on
      // their first login.
      store.set('grafana.sidemenu', false);
    }

    this.isEditor = this.hasRole('Editor') || this.hasRole('Admin');
    this.isViewer = this.hasRole('Viewer');
  });

});
