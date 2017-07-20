// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import Tooltip from '../tooltip.js';

import { asViewer } from '../as-viewer/as-viewer';
import {
  PopoverContainer,
  Popover,
  PopoverTitle,
  PopoverContent
} from '../popover.js';

const getMessage = alerts => {
  let message = `${alerts.length} Issues`;

  if (alerts.length === 0) message = 'No Issues';
  else if (alerts.length === 1) message = alerts[0].message;

  return message;
};

const AlertIndicator = asViewer(
  'alerts',
  ({
    alerts: xs,
    size,
    recordId
  }: {
    alerts: Object[],
    size?: 'small' | 'medium',
    recordId: string
  }) => {
    const alerts = xs.filter(x => x.affected.find(y => y === recordId));

    return (
      <span class="record-state">
        <PopoverContainer>
          <span
            class="icon-wrap tooltip-container tooltip-hover"
            popoverButton={true}
          >
            <i
              className={`fa activate-popover ${alerts.length > 0
                ? 'fa-exclamation-circle'
                : 'fa-check-circle'}`}
            />
            <Tooltip
              size={alerts.length === 0 ? 'small' : 'medium'}
              direction="top"
              message={getMessage(alerts)}
            />
          </span>
          {alerts.length
            ? <Popover popover={true} direction="bottom">
                <PopoverTitle>Alerts</PopoverTitle>
                <PopoverContent>
                  <ul>
                    {alerts.map(x =>
                      <li key={x.id}>
                        {x.message}
                      </li>
                    )}
                  </ul>
                </PopoverContent>
              </Popover>
            : ''}
        </PopoverContainer>

        {size === 'medium'
          ? <span style="padding-left:10px;" class="state-label">
              {getMessage(alerts)}
            </span>
          : ''}
      </span>
    );
  }
);

export default AlertIndicator;

export const alertIndicatorNg = {
  bindings: { recordId: '<', displayType: '<', alertStream: '<' },
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    this.$onInit = () => {
      Inferno.render(
        <AlertIndicator
          viewer={this.alertStream}
          size={this.displayType}
          recordId={this.recordId}
        />,
        el
      );
    };

    this.$onDestroy = () => {
      Inferno.render(null, el);
    };
  }
};
