// @flow

//
// Copyright (c) 2018 DDN. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import type { Field, StorageResourceClass } from './storage-types.js';
import type { State } from './storage-reducer.js';

import Inferno from 'inferno';
import Component from 'inferno-component';

import { asViewer } from '../as-viewer/as-viewer';
import TableFilter from './table-filter.js';
import socketStream from '../socket/socket-stream.js';
import { UI_ROOT } from '../environment.js';

const PageAlert = ({ children, className }) => {
  if (!children) return;

  return <div className={`alert span4 offset4 ${className}`}>{children}</div>;
};

const FormItem = ({ field, value, onInput }: { field: Field, value: string, onInput: Function }) => (
  <div class="form-group">
    <label for={field.name}>{field.label}</label>
    <input
      required={!field.optional}
      value={value}
      onInput={onInput}
      type={field.class === 'Password' ? 'password' : 'text'}
      class="form-control"
      id={field.name}
    />
  </div>
);

type AddFormState = {
  form: {
    [number]: {
      [string]: string
    }
  },
  loading: boolean,
  saveFailed: ?boolean
};

type AddFormProps = {
  resourceClass: StorageResourceClass
};

class AddStorageForm extends Component {
  state: AddFormState;
  props: AddFormProps;
  constructor(props: AddFormProps) {
    super(props);

    this.state = {
      form: {
        [props.resourceClass.id]: {}
      },
      loading: false,
      saveFailed: null
    };
  }
  onInput(id: number, name: string, ev: SyntheticInputEvent) {
    this.setState({
      form: {
        ...this.state.form,
        [id]: {
          ...this.state.form[id],
          [name]: ev.target.value
        }
      }
    });
  }
  handleSubmit(id: number, ev: Event) {
    Event.prototype.preventDefault.call(ev);
    Event.prototype.stopImmediatePropagation.call(ev);
    this.setState({ loading: true, saveFailed: null });

    socketStream(
      '/storage_resource',
      {
        method: 'post',
        json: {
          attrs: this.state.form[id],
          plugin_name: this.props.resourceClass.plugin_name,
          class_name: this.props.resourceClass.class_name
        }
      },
      true
    ).pull(err => {
      this.setState({
        loading: false,
        saveFailed: err ? true : false,
        form: {
          ...this.state.form,
          [id]: err ? this.state.form[id] : {}
        }
      });
    });
  }
  componentWillReceiveProps({ resourceClass }) {
    if (this.state.form[resourceClass.id] == null)
      this.setState({
        loading: false,
        saveFailed: null,
        form: {
          ...this.state.form,
          [resourceClass.id]: {}
        }
      });
  }

  render() {
    const id = this.props.resourceClass.id;

    return (
      <form autocomplete="off" onSubmit={this.handleSubmit.bind(this, id)}>
        <PageAlert className={this.state.saveFailed ? 'alert-danger' : 'alert-success'}>
          {(() => {
            switch (this.state.saveFailed) {
              case true:
                return 'An unexpected error occured. Please update form and resubmit.';
              case false:
                return 'Record Created.';
              default:
                return null;
            }
          })()}
        </PageAlert>
        {this.props.resourceClass.fields.map(x => (
          <FormItem
            field={x}
            key={x.name}
            value={this.state.form[id][x.name]}
            onInput={this.onInput.bind(this, id, x.name)}
          />
        ))}
        <button disabled={this.state.loading} type="submit" class="btn btn-success">
          Save
          <i className={`fa ${this.state.loading ? 'fa-spinner fa-spin' : 'fa-check-circle'}`} />
        </button>
      </form>
    );
  }
}

export const AddStorageComponent = asViewer(
  'storage',
  ({
    storage: {
      resourceClasses,
      config: { selectIndex }
    }
  }: {
    storage: State
  }) => {
    if (!resourceClasses || selectIndex == null || !resourceClasses[selectIndex]) return;

    return (
      <div class="container container-full storage container">
        <h4 class="section-header">Add Storage Device</h4>
        <TableFilter classes={resourceClasses} idx={selectIndex} />
        <AddStorageForm resourceClass={resourceClasses[selectIndex]} />
        <div style={{ margin: '25px 0' }}>
          <a href={`${UI_ROOT}configure/storage`}>&larr; Return to storage configuration page</a>
        </div>
      </div>
    );
  }
);

export default {
  bindings: { storageB: '<' },
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    this.$onInit = () => {
      Inferno.render(<AddStorageComponent viewer={this.storageB} />, el);
    };

    this.$onDestroy = () => {
      Inferno.render(null, el);

      this.storageB.endBroadcast();
    };
  }
};
