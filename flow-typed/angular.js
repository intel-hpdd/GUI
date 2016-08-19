// @flow

declare module angular {
  declare class $scope {
    $new():$scope;
    $digest():void;
    $apply(exp?:(string | (s:$scope) => any)):void;
    $on(evt:string, listener:(
      event:{
        targetScope:$scope,
        currentScope:$scope,
        name:string,
        stopPropagation:() => void,
        preventDefault:() => void,
        defaultPrevented:boolean
      }
    ) => void):void;
  }
  declare type $scopeT = $scope;
  declare class $location {
    path(p?:string):($location | string);
    search(search?:string, val?:string):Object;
  }
  declare type $locationT = $location;
  declare class Module {
    provider(name:string, providerType:Function):Module;
    factory(name:string, providerFunction:Function):Module;
    controller(name:string, constructor:Function):Module;
    service(name:string, constructor:Function):Module;
    config(configFn:Function):Module;
    run(initializationFn:Function):Module;
    directive(name:string, directiveFactory:Function):Module;
    component(name:string, options:Object):Module;
    filter(name:string, filterFactory:Function):Module;
    value(name:string, object:any):Module;
    constant(name:string, object:any):Module;
    name:string;
  }
  declare type $compileT = (el:(string | HTMLElement)) => (scope:$scope) => HTMLElement[];
  declare module.exports: {
    module(name:string, dependencies: string[]):Module;
    bootstrap(element:(HTMLElement | Document), modules:string[], config:Object):void;
    merge(...rest:Object[]):Object;
    element(el:(string | HTMLElement)): {
      clone: () => HTMLElement
    };
  }
}
