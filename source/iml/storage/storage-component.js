// @flow

//
// Copyright (c) 2017 Intel Corporation. All rights reserved.
// Use of this source code is governed by a MIT-style
// license that can be found in the LICENSE file.

import Inferno from 'inferno';
import connectToStore from '../connect-to-store';

/* 
export const ListPlugins = ({ xs }) => { 
  const listAll = this.xs.map(function(x) { 
    return <h1> Made it Peter! </h1>; 
  }); 
 
  return ( 
    <ul> 
      {listAll} 
    </ul> 
  ); 
}; 
 
*/

/* 
export const ListPlugins = ({ xs }) => { 
  const ListItems = xs.map(function(x) { 
    return ( 
      <li> 
        {x.label} 
      </li> 
    ); 
  }); 
 
  return ( 
    <ul> 
      {ListItems} 
    </ul> 
  ); 
}; 
*/

/* 
const FilterPluginList = filterList( 
 +  () => 
 +    <input 
 +      autofocus 
 +      class="form-control" 
 +      name="username" 
 +      autocomplete="off" 
 +      placeholder="Username" 
 +      ref={input => { usernameInput = input; }} 
 +    /> 
 +); 
*/

export const ListPlugins = ({ xs }) => {
  const ListItems = xs.map(function(x) {
    return (
      <tr>
        <td>
          {x.plugin_name}
        </td>

        <td>
          {x.label}
        </td>

        <td>
          {x.class_name}
        </td>

        <td>
          {x.id}
        </td>
      </tr>
    );
  });

  return (
    <div>
      <table class="table server-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Minutes</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {ListItems}
        </tbody>
      </table>
    </div>
  );
};

export const NoPluginData = ({ xs }) => {
  if (xs.length === 0)
    return (
      <div class="well text-center no-plugins">
        <h1>No storage plugins are currently installed.</h1>
        <p>
          When storage plugins are installed, use this tab to configure and view
          storage resources such as controllers.
        </p>
      </div>
    );
};

export const PluginData = ({ xs }) => {
  if (xs.length > 0)
    return (
      <div class="plugins">
        <h4 class="section-header">Storage Resources</h4>

        <select name="filter">
          <option value="val1">HostTime</option>
          <option value="val2">HostTimePresent</option>
          <option value="val3">HostTimeReference</option>
        </select>
      </div>
    );
};

/* 
export const PluginData = ({ xs }) => { 
  if (xs.length > 0) 
    return ( 
      <div class="well text-center no-plugins"> 
        <h1>Storage plugins are currently installed.</h1> 
        <p> 
          When storage plugins are installed, 
          use this tab to configure and view storage resources such as 
          controllers. 
        </p> 
        <h2> {JSON.stringify(xs)}</h2> 
      </div> 
    ); 
}; 
*/

export const StorageComponent = connectToStore('storage', ({ storage }) =>
  <div class="container container-full storage container">
    <NoPluginData xs={storage} />
    <PluginData xs={storage} />
    <ListPlugins xs={storage} />
  </div>
);

export default {
  // bindings: { storage$: '<' },
  controller: function($element: HTMLElement[]) {
    'ngInject';
    Inferno.render(<StorageComponent />, $element[0]);
  }
};
