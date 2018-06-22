// @flow

import Inferno from 'inferno';
import getStore from '../store/get-store.js';
import { setDateTypeToUtc, setDateTypeToLocal } from './date-type-actions.js';

type DateTypeProps = {
  isUtc: boolean
};

const handleChange = evt => {
  if (evt.target.id === 'utc') getStore.dispatch(setDateTypeToUtc());
  else getStore.dispatch(setDateTypeToLocal());
};

const Utc = ({ isUtc }: DateTypeProps) => {
  if (isUtc)
    return (
      <label class="radio">
        <input type="radio" name="datetype" id="utc" value="UTC" onChange={handleChange} checked="checked" />
        UTC
      </label>
    );
  else
    return (
      <label class="radio">
        <input type="radio" name="datetype" id="utc" value="UTC" onChange={handleChange} />
        UTC
      </label>
    );
};

const Local = ({ isUtc }: DateTypeProps) => {
  if (!isUtc)
    return (
      <label class="radio">
        <input type="radio" name="datetype" id="local" value="Local" onChange={handleChange} checked="checked" />
        Local
      </label>
    );
  else
    return (
      <label class="radio">
        <input type="radio" name="datetype" id="local" value="Local" onChange={handleChange} />
        Local
      </label>
    );
};

export const DateType = ({ isUtc }: DateTypeProps) => {
  return (
    <div class="well well-sm date-type">
      <Utc isUtc={isUtc} />
      <Local isUtc={isUtc} />
    </div>
  );
};

export const dateComponent = {
  binding: {},
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    this.$onInit = () => {
      getStore.select('dateType').each(date => {
        Inferno.render(<DateType isUtc={date.isUtc} />, el);
      });
    };

    this.$onDestroy = () => {
      Inferno.render(null, el);
    };
  }
};
