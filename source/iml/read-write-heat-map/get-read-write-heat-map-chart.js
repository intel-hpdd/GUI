//
// INTEL CONFIDENTIAL
//
// Copyright 2013-2016 Intel Corporation All Rights Reserved.
//
// The source code contained or described herein and all documents related
// to the source code ("Material") are owned by Intel Corporation or its
// suppliers or licensors. Title to the Material remains with Intel Corporation
// or its suppliers and licensors. The Material contains trade secrets and
// proprietary and confidential information of Intel or its suppliers and
// licensors. The Material is protected by worldwide copyright and trade secret
// laws and treaty provisions. No part of the Material may be used, copied,
// reproduced, modified, published, uploaded, posted, transmitted, distributed,
// or disclosed in any way without Intel's prior express written permission.
//
// No license under any patent, copyright, trade secret or other intellectual
// property right is granted to or conferred upon you by disclosure or delivery
// of the Materials, either expressly, by implication, inducement, estoppel or
// otherwise. Any license under such intellectual property rights must be
// express and approved by Intel in writing.

// @flow

import flatMapChanges from 'intel-flat-map-changes';
import getReadWriteHeatMapStream from './get-read-write-heat-map-stream.js';
import formatBytes from '../number-formatters/format-bytes.js';
import formatNumber from '../number-formatters/format-number.js';
import durationPayload from '../duration-picker/duration-payload.js';
import getStore from '../store/get-store.js';
import durationSubmitHandler from '../duration-picker/duration-submit-handler.js';
import chartCompiler from '../chart-compiler/chart-compiler.js';

import {
  flow,
  lensProp,
  view
} from 'intel-fp';

import {
  values
} from 'intel-obj';

import {
  getConf
} from '../chart-transformers/chart-transformers.js';


import {
  DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS,
  UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS
} from '../read-write-heat-map/read-write-heat-map-chart-reducer.js';

// $FlowIgnore: HTML templates that flow does not recognize.
import readWriteHeatMapTemplate from './assets/html/read-write-heat-map.html!text';

import type {
  $scopeT
} from 'angular';

import type {
  localApplyT
} from '../extend-scope-module.js';

import type {
  readWriteHeatMapTypesT,
  heatMapDurationPayloadT,
  heatMapPayloadHashT
} from './read-write-heat-map-module.js';

import type {
  filesystemQueryT,
  targetQueryT
} from '../dashboard/dashboard-module.js';

import type {
  data$FnT
} from '../chart-transformers/chart-transformers-module.js';

export default ($state, localApply:localApplyT,
                data$Fn:data$FnT, readWriteHeatMapTypes:readWriteHeatMapTypesT) => {
  'ngInject';

  const dataLens = view(lensProp('data'));
  const maxMillisecondsDiff = 30000;

  return function getReadWriteHeatMapChart (overrides:filesystemQueryT | targetQueryT, page:string) {
    getStore.dispatch({
      type: DEFAULT_READ_WRITE_HEAT_MAP_CHART_ITEMS,
      payload: durationPayload({
        dataType: 'stats_read_bytes',
        page
      })
    });

    const config1$ = getStore.select('readWriteHeatMapCharts');

    const initStream = config1$
      .through(getConf(page))
      .through(
        flatMapChanges(
          data$Fn(overrides, (x:heatMapDurationPayloadT) => getReadWriteHeatMapStream(x.dataType))
        )
      );

    return chartCompiler(readWriteHeatMapTemplate, initStream,
      ($scope:$scopeT, stream:HighlandStreamT<heatMapPayloadHashT>) => {

        const conf = {
          stream,
          TYPES: values(readWriteHeatMapTypes),
          configType: '',
          page: '',
          dataType: '',
          startDate: '',
          endDate: '',
          size: 1,
          unit: '',
          toReadableType (type) {
            var readable = type
              .split('_')
              .splice(1)
              .join(' ')
              .replace('bytes', 'Byte/s')
              .replace('iops', 'IOPS');

            return readable.charAt(0).toUpperCase() + readable.slice(1);
          },
          onSubmit: durationSubmitHandler(UPDATE_READ_WRITE_HEAT_MAP_CHART_ITEMS, {page}),
          options: {
            setup (d3Chart) {
              d3Chart.margin({
                left: 70,
                bottom: 50,
                right: 50
              });

              d3Chart.dispatch.on('click', function onClick (points) {
                var sDate = new Date(points.current.ts);
                const eDate = ( points.next ? new Date(points.next.ts) : new Date() );
                const dateDiff = eDate.getTime() - sDate.getTime();

                if (dateDiff < maxMillisecondsDiff) {
                  const millisecondsToAdd = maxMillisecondsDiff - dateDiff;
                  sDate = new Date(sDate.valueOf() - millisecondsToAdd);
                }

                const startDate = sDate.toISOString();
                const endDate = eDate.toISOString();

                $scope.$apply(function applyLocationChange () {
                  $state.go('app.jobstats', {
                    id: points.current.id,
                    startDate,
                    endDate
                  });
                });
              });
              d3Chart.formatter(getFormatter(conf.dataType));
              d3Chart.zValue(flow(dataLens, view(lensProp(conf.dataType))));

              d3Chart.xAxis().ticks(3);
            },
            beforeUpdate: function beforeUpdate (d3Chart) {
              d3Chart.formatter(getFormatter(conf.dataType));
              d3Chart.zValue(flow(dataLens, view(lensProp(conf.dataType))));
              d3Chart.xAxisDetail(conf.toReadableType(conf.dataType));
            }
          }
        };

        const config2$ = getStore.select('readWriteHeatMapCharts');
        config2$
         .through(getConf(page))
         .each((x:heatMapDurationPayloadT) => {
           Object.assign(conf, x);
           localApply($scope);
         });

        $scope.$on('$destroy', () => {
          stream.destroy();
          config1$.destroy();
          config2$.destroy();
        });

        return conf;
      });
  };

  function getFormatter (type) {
    var dataType = type.split('_').pop();

    if (dataType === 'bytes')
      return function (z) {
        return formatBytes(z, 3) + '/s';
      };
    else if (dataType === 'iops')
      return function (z) {
        return formatNumber(z, 2, true) + ' IOPS';
      };
  }
};
