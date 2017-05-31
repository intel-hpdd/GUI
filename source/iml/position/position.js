//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import _ from 'intel-lodash-mixins';

const asCalc = dimension => `calc(50% - ${dimension}px`;

function Position ($window) {
  'ngInject';

  this.$window = $window;

  this.DIRECTIONS = {
    TOP: 'top',
    BOTTOM: 'bottom',
    RIGHT: 'right',
    LEFT: 'left'
  };

  this.defaults = {};

  this.defaults[this.DIRECTIONS.TOP] = {
    position: function (tooltipPositioner) {
      return {
        top: (tooltipPositioner.height * -1) + 'px',
        left: asCalc(tooltipPositioner.width / 2),
        'min-width': tooltipPositioner.width + 'px'
      };
    },
    overflows: function (windowPositioner, tooltipPositioner) {
      return tooltipPositioner.top < windowPositioner.top;
    }
  };

  this.defaults[this.DIRECTIONS.RIGHT] = {
    position: function (tooltipPositioner) {
      return {
        top: asCalc(tooltipPositioner.height / 2),
        left: '100%',
        'min-width': tooltipPositioner.width + 'px'
      };
    },
    overflows: function (windowPositioner, tooltipPositioner) {
      return tooltipPositioner.right > windowPositioner.right;
    }
  };

  this.defaults[this.DIRECTIONS.LEFT] = {
    position: function (tooltipPositioner) {
      return {
        top: asCalc(tooltipPositioner.height / 2),
        left: (tooltipPositioner.width * -1) + 'px',
        'min-width': tooltipPositioner.width + 'px'
      };
    },
    overflows: function (windowPositioner, tooltipPositioner) {
      return tooltipPositioner.left < windowPositioner.left;
    }
  };

  this.defaults[this.DIRECTIONS.BOTTOM] = {
    position: function (tooltipPositioner) {
      return {
        top: '100%',
        left: asCalc(tooltipPositioner.width / 2),
        'min-width': tooltipPositioner.width + 'px'
      };
    },
    overflows: function (windowPositioner, tooltipPositioner) {
      return tooltipPositioner.bottom > windowPositioner.bottom;
    }
  };
}

Position.prototype.positioner = function (element) {
  if (typeof element.getBoundingClientRect === 'function')
    return positionerFactory(function () {
      return element.getBoundingClientRect();
    }, this.DIRECTIONS);
  else if (element === this.$window)
    return positionerFactory(function () {
      return {
        top: 0,
        left: 0,
        right: element.innerWidth,
        bottom: element.innerHeight,
        height: element.innerHeight,
        width: element.innerWidth
      };
    }, this.DIRECTIONS);
};

Position.prototype.position = function (direction, tooltipPositioner) {
  return this.defaults[direction].position(tooltipPositioner);
};

Position.prototype.overflows = function (direction, windowPositioner, tooltipPositioner) {
  return this.defaults[direction].overflows(windowPositioner, tooltipPositioner);
};

function positionerFactory (positionFinder, DIRECTIONS) {
  var props = _.values(DIRECTIONS).concat('height', 'width');

  var propertiesObject = props.reduce(function (obj, prop) {
    obj[prop] = {
      enumerable: true,
      get: function () {
        return positionFinder()[prop];
      }
    };

    return obj;
  }, {});

  return Object.create(Object.prototype, propertiesObject);
}

export default Position;
