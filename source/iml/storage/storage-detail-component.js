// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import Component from 'inferno-component';

import type { HighlandStreamT } from 'highland';
import type {
  StorageResource,
  TimeseriesChart,
  HistogramChart,
  Stats
} from './storage-types.js';

import { values } from '@iml/obj';
import { asValue } from '../as-value/as-value.js';
import { StorageAttribute } from './resource-table.js';

import AlertIndicator from '../alert-indicator/alert-indicator.js';
import socketStream from '../socket/socket-stream.js';
import Spinner from '../spinner.js';
import StorageResourceHistogram from './storage-resource-histogram.js';
import StorageResourceTimeSeries from './storage-resource-time-series.js';
import global from '../global.js';

const buildCharts = (
  x: StorageResource
): (TimeseriesChart | HistogramChart)[] =>
  x.charts.map(c => {
    const series: Stats[] = c.series.map(s => x.stats[s]).filter(Boolean);
    const type: 'histogram' | 'timeseries' = series
      .map(x => x.type)
      .reduce((x, y) => (x === 'histogram' ? 'histogram' : y));

    return ({
      title: c.title,
      type,
      series
    }: any);
  });

const TextField = ({
  label,
  name,
  optional,
  value,
  processing,
  onInput
}: {
  label: string,
  name: string,
  optional: boolean,
  value: string,
  processing: boolean,
  onInput: Function
}) =>
  <div class="detail-row">
    <div>
      {label}
    </div>
    <div>
      <input
        required={!optional}
        type="text"
        class="form-control"
        onInput={onInput}
        name={name}
        id={name}
        disabled={processing ? true : false}
        value={value}
      />
    </div>
  </div>;

const DeleteButton = ({
  deletable,
  onDelete,
  processing
}: {
  deletable: boolean,
  onDelete: number => void,
  processing: boolean
}) => {
  if (deletable)
    return (
      <button
        id="deleteButton"
        type="button"
        class="btn btn-danger"
        onClick={onDelete}
        disabled={processing ? true : false}
      >
        Delete <Spinner display={processing} />
      </button>
    );
};

const SaveButton = ({
  processing,
  canSave
}: {
  processing: boolean,
  canSave: boolean
}) => {
  return (
    <button
      id="saveButton"
      type="submit"
      class="btn btn-default"
      disabled={processing || !canSave ? true : false}
    >
      Save <Spinner display={processing} />
    </button>
  );
};

type StorageDetailState = {
  oldAlias: string,
  alias: string,
  processing: boolean
};
type StorageDetailProps = {
  resource: StorageResource,
  alertIndicatorB: () => HighlandStreamT<any>
};
class StorageDetailForm extends Component {
  state: StorageDetailState;
  props: StorageDetailProps;
  constructor(props: StorageDetailProps) {
    super(props);

    this.state = {
      oldAlias: '',
      alias: '',
      processing: false
    };
  }

  onInput = (id, ev) => {
    this.setState({
      alias: ev.target.value
    });
  };

  handleSubmit = (id: number, ev: Event) => {
    Event.prototype.preventDefault.call(ev);
    Event.prototype.stopImmediatePropagation.call(ev);

    this.setState({
      processing: true
    });

    socketStream(
      `/storage_resource/${id}`,
      {
        method: 'put',
        json: {
          alias: this.state.alias
        }
      },
      true
    ).pull(() => {
      this.setState({
        processing: false,
        oldAlias: this.state.alias
      });
    });
  };

  onDelete = (id: number) => {
    this.setState({
      processing: true
    });

    socketStream(
      `/storage_resource/${id}`,
      {
        method: 'delete'
      },
      true
    ).pull(() => {
      this.setState({
        processing: false
      });

      global.location.href = '/ui/configure/storage';
    });
  };

  componentWillMount() {
    this.setState({
      oldAlias: this.props.resource.alias,
      alias: this.props.resource.alias
    });
  }

  render() {
    return (
      <form
        autocomplete="off"
        onSubmit={this.handleSubmit.bind(this, this.props.resource.id)}
      >
        <div class="detail-panel form-group">
          <h4 class="section-header">
            {this.props.resource.class_name} Detail
          </h4>
          <TextField
            label="Alias"
            name="alias"
            optional={false}
            value={this.state.alias}
            processing={this.state.processing}
            onInput={this.onInput.bind(this, this.props.resource.id)}
          />
          {values(this.props.resource.attributes).map(x =>
            <div class="detail-row">
              <div>
                {x.label}:
              </div>
              <div>
                <StorageAttribute attribute={x} />
              </div>
            </div>
          )}
          <div class="detail-row">
            <div>Alerts:</div>
            <div>
              <AlertIndicator
                viewer={this.props.alertIndicatorB}
                size="medium"
                recordId={this.props.resource.id}
              />
            </div>
          </div>
          <div class="detail-row">
            <div>
              <DeleteButton
                deletable={this.props.resource.deletable}
                onDelete={this.onDelete.bind(this, this.props.resource.id)}
                processing={this.state.processing}
              />
            </div>
            <div>
              <SaveButton
                processing={this.state.processing}
                canSave={this.state.oldAlias !== this.state.alias}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export const StorageDetail = asValue(
  'resource',
  ({
    resource,
    alertIndicatorB
  }: {
    resource: StorageResource,
    alertIndicatorB: () => HighlandStreamT<any>
  }) => {
    return (
      <div class="container container-full container">
        <StorageDetailForm
          resource={resource}
          alertIndicatorB={alertIndicatorB}
        />
        <div>
          {buildCharts(resource).map(c =>
            <div>
              <h4 class="text-center" style={{ 'margin-top': '50px' }}>
                {c.title}
              </h4>
              {c.type === 'histogram'
                ? <StorageResourceHistogram chart={c} />
                : <StorageResourceTimeSeries
                    chart={c}
                    resourceUri={resource.resource_uri}
                  />}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default {
  bindings: { storageResource$: '<', alertIndicatorB: '<' },
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    this.$onInit = () => {
      Inferno.render(
        <StorageDetail
          stream={this.storageResource$}
          alertIndicatorB={this.alertIndicatorB}
        />,
        el
      );
    };

    this.$onDestroy = () => {
      this.storageResource$.destroy();
      this.alertIndicatorB.endBroadcast();
      Inferno.render(null, el);
    };
  }
};
