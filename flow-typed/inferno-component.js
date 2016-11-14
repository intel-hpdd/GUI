// @flow

declare class Inferno$Component<DefaultProps, Props, State> extends React$Component<DefaultProps, Props, State> {
  static defaultProps:DefaultProps;
  props:Props;
  state:State;
}


declare module 'inferno-component' {
  declare export default typeof Inferno$Component
}
