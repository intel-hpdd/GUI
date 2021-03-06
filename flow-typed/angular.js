// @flow

declare module angular {
  declare class $scope {
    $new(): $scope;
    $digest(): void;
    $apply(exp?: string | ((s: $scope) => any)): void;
    $on(
      evt: string,
      listener: (event: {
        targetScope: $scope,
        currentScope: $scope,
        name: string,
        stopPropagation: () => void,
        preventDefault: () => void,
        defaultPrevented: boolean
      }) => void
    ): void;
    $watch(exp: string, listener: (Object) => mixed, objectEquality?: boolean): () => mixed;
  }
  declare type $scopeT = $scope;
  declare class $location {
    path(p?: string): $location | string;
    search(search?: string, val?: string | number): Object;
  }
  declare type jqliteElement = {
    get: (id: number) => HTMLElement,
    [key: number]: HTMLElement
  };
  declare type $locationT = $location;
  declare type animationCallbackT = (element: jqliteElement, phase: "start" | "close") => void;
  declare class $animation {
    leave(
      element: HTMLElement,
      options?: {
        addClass: string,
        from: Object,
        removeClass: string,
        to: Object
      }
    ): Promise<void>;
    on(event: string, container: HTMLElement, callback: animationCallbackT): void;
    off(event: string, container?: HTMLElement, callback?: animationCallbackT): void;
  }
  declare type $animationT = $animation;

  declare class injector {
    has(name: "$state"): boolean;
    get(
      name: "$state"
    ): {
      go: (name: string) => void
    };
  }
  declare type injectorT = injector;
  declare class Module {
    provider(name: string, providerType: Function): Module;
    factory(name: string, providerFunction: Function): Module;
    factory(name: string, providerList: [string, Function]): Module;
    controller(name: string, constructor: Function): Module;
    service(name: string, constructor: Function): Module;
    config(configFn: Function): Module;
    config(configList: Array<mixed>): Module;
    run(initializationFn: Function): Module;
    directive(name: string, directiveFactory: Function): Module;
    component(name: string, options: Object): Module;
    filter(name: string, filterFactory: Function): Module;
    value(name: string, object: any): Module;
    constant(name: string, object: any): Module;
    name: string;
  }
  declare type $compileT = (el: string | HTMLElement) => (scope: $scope) => HTMLElement[];
  declare type elementExtrasT = {
    controller(name: string): Function,
    injector(): injectorT,
    scope(): $scopeT,
    isolateScope(): $scopeT,
    inheritedData(): Object
  };
  declare module.exports: {
    module(name: string, dependencies: string[]): Module,
    bootstrap(element: HTMLElement | Document, modules: string[], config: Object): void,
    merge(...rest: Object[]): Object,
    element(el: string | Element): HTMLElement[] & elementExtrasT,
    injector(): injector,
    isObject(value: any): boolean
  };
}
