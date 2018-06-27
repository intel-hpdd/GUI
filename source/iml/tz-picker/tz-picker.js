// @flow

import Inferno from 'inferno';
import getStore from '../store/get-store.js';
import { setTimeZoneToUtc, setTimeZoneToLocal } from './tz-picker-actions.js';

export type TzPickerProps = {
  isUtc: boolean
};

const handleChange = evt => {
  if (evt.target.id === 'utc') getStore.dispatch(setTimeZoneToUtc());
  else getStore.dispatch(setTimeZoneToLocal());
};

const TzLabel = ({ id }) => {
  if (id === 'utc') return <span>UTC</span>;
  else return <span>Local</span>;
};

const TzPickerElement = ({ isChecked, id }) => {
  if (isChecked)
    return (
      <div class="radio">
        <label class="radio">
          <input type="radio" name="tzPicker" id={id} onChange={handleChange} checked="checked" />
          <TzLabel id={id} />
        </label>
      </div>
    );
  else
    return (
      <div class="radio">
        <label class="radio">
          <input type="radio" name="tzPicker" id={id} onChange={handleChange} />
          <TzLabel id={id} />
        </label>
      </div>
    );
};

export const TzPicker = ({ isUtc }: TzPickerProps) => {
  return (
    <div class="well well-sm tz-picker">
      <TzPickerElement isChecked={isUtc === true} id="utc" />
      <TzPickerElement isChecked={isUtc === false} id="local" />
    </div>
  );
};

export const tzPickerComponent = {
  binding: {},
  controller: function($element: HTMLElement[]) {
    'ngInject';

    const el = $element[0];

    this.$onInit = () => {
      getStore.select('tzPicker').each(tz => {
        Inferno.render(<TzPicker isUtc={tz.isUtc} />, el);
      });
    };

    this.$onDestroy = () => {
      Inferno.render(null, el);
    };
  }
};
