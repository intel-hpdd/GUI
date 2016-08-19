// @flow

declare module 'angular-ui-router' {
  declare class UIRouter {
    globals:UIRouterGlobals;
  }
  declare type UIRouterT = UIRouterT;

  declare class UIRouterGlobals {
    $current:StateT;
    current:StateDeclarationT;
    params:StateParamsT;
    successfulTransitions:Array<TransitionT>;
    transition:TransitionT;
    transitionHistory:Array<TransitionT>;
  }
  declare type UIRouterGlobalsT = UIRouterGlobals;

  declare type HookMatchCriterionT = string | Function | boolean;
  declare type HookMatchCriteriaT = {
    to?:HookMatchCriterionT,
    from?:HookMatchCriterionT,
    exiting?:HookMatchCriterionT,
    retained?:HookMatchCriterionT,
    entering?:HookMatchCriterionT
  };
  declare type InjectableT = Function | Array<any>;
  declare type HookRegOptionsT = {
    bind:any,
    priority:number
  };
  declare type HookRegistrationT =
    (matchCriteria:HookMatchCriteriaT, callback:InjectableT, options?:HookRegOptionsT) => Function;

  declare class State {
    abstract:boolean;
    data:any;
    includes:Object;
    name:string;
    navigable:StateT;
    params:Object;
    parent:StateT;
    path:Array<StateT>;
    resolve:Object;
    resolvePolicy:any;
    self:StateDeclarationT;
    url:UrlMatcherT;
    views:Object;
    fqn():string;
    is(ref:StateT | StateDeclarationT | string):boolean;
    parameter(id:string, opts?:any):ParamT;
    parameters(opts?:any):Array<ParamT>;
    root():StateT;
    toString():string;
  }
  declare type StateT = State;

  declare class StateParams {
    $inherit(newParams:any, $current:any, $to:any):any;
    resetState?:boolean;
  }

  declare type StateParamsT = StateParams;

  declare type ResolvablesT = {[key:string]: ResolvableT};

  declare type Options1T = {
    omitOwnLocals:Array<string>;
    resolvePolicy:string;
  }

  declare class Resolvable {
    data:any;
    deps:Array<string>;
    name:string;
    promise:Promise<any>;
    resolveFn:Function;
    get(resolveContext:ResolveContextT, options:Options1T):Promise<any>;
    resolveResolvable(resolveContext:ResolveContextT, options?:Options1T):any;
    toString():string;
    makeResolvables(resolves:Object):ResolvablesT;
  }
  declare type ResolvableT = Resolvable;

  declare class ResolveContext {
    addResolvables(resolvables:ResolvablesT, state:StateT):void;
    getOwnResolvables(state:StateT):ResolvablesT;
    getResolvables(state?:StateT, options?:any):ResolvablesT;
    getResolvablesForFn(fn:InjectableT):Object;
    invokeLater(fn:InjectableT, locals?:any, options?:Options1T):Promise<any>;
    invokeNow(fn:InjectableT, locals:any, options?:any):any;
    isolateRootTo(state:StateT):ResolveContextT;
    resolvePath(options?:Options1T):Promise<any>;
    resolvePathElement(state:StateT, options?:Options1T):Promise<any>;
  }
  declare type ResolveContextT = ResolveContext;

  declare type ViewConfigT = {
    loaded:boolean;
    node:NodeT;
    load():Promise<ViewConfigT>;
  }

  declare class ResolveInjector {
    getLocals(injectedFn:any):Object;
    invokeLater(injectedFn:any, locals:any):Promise<any>;
    invokeNow(injectedFn:any, locals:any):any;
  }
  declare type ResolveInjectorT = ResolveInjector;

  declare class Node {
    paramSchema:Array<ParamT>;
    paramValues:Object;
    resolveContext:ResolveContextT;
    resolveInjector:ResolveInjectorT;
    resolves:ResolvablesT;
    state:StateT;
    views:ViewConfigT;
    applyRawParams(params:RawParamsT):NodeT;
    equals(node:NodeT, keys?:Array<any>):boolean;
    parameter(name:string):ParamT;
    clone(node:NodeT):NodeT;
    matching(first:Array<NodeT>, second:Array<NodeT>):Array<NodeT>;
  }
  declare type NodeT = Node;

  declare type MatchingNodesT = {
    entering:Array<NodeT>;
    exiting:Array<NodeT>;
    from:Array<NodeT>;
    retained:Array<NodeT>;
    to:Array<NodeT>;
  }

  declare type TreeChangesT = {
    entering:Array<NodeT>;
    exiting:Array<NodeT>;
    from:Array<NodeT>;
    retained:Array<NodeT>;
    to:Array<NodeT>;
  }

  declare type EventHookT = {
    bind:any;
    callback:InjectableT;
    matches(treeChanges:TreeChangesT):MatchingNodesT;
    priority:number;
  }

  declare type HookGetterT = (hookName:string) => Array<EventHookT>;

  declare type StateOrNameT = string | StateDeclarationT | StateT;

  declare class ViewService {
    activateViewConfig(viewConfig:ViewConfigT):void;
    active():Array<any>;
    available():Array<any>;
    rootContext(context:any):any;
    sync():void;
  }
  declare type ViewServiceT = ViewService;

  declare class TransitionService {
    $view:ViewServiceT;
    onBefore:HookRegistrationT;
    onEnter:HookRegistrationT;
    onError:HookRegistrationT;
    onExit:HookRegistrationT;
    onFinish:HookRegistrationT;
    onRetain:HookRegistrationT;
    onStart:HookRegistrationT;
    onSuccess:HookRegistrationT;
    getResolveTokens():Array<any>;
    getResolveValue(token:any|Array<any>):any|Array<any>;
    create(fromPath:Array<NodeT>, targetState:TargetStateT):TransitionT;
    defaultErrorHandler(handler:Function):Function;
  }
  declare type TransitionServiceT = TransitionService;

  declare type TransitionOptionsT = {
    current:() => TransitionT;
    custom:any;
    inherit:boolean;
    location:boolean | string;
    notify:boolean;
    previous:TransitionT;
    relative:string | StateDeclarationT | StateT;
    reload:boolean | string | StateDeclarationT | StateT;
    reloatState:StateT;
  }

  declare type ParamsOrArrayT = RawParamsT | Array<RawParamsT>;

  declare class TargetState {
    $state():StateT;
    error():string;
    exists():boolean;
    identifier():StateOrNameT;
    name():string | StateDeclarationT | StateT;
    options():TransitionOptionsT;
    params():ParamsOrArrayT;
    state():StateDeclarationT;
    valid():boolean;
  }
  declare type TargetStateT = TargetState;

  declare class Transition {
    $id:number;
    getHooks:HookGetterT;
    onBefore:HookRegistrationT;
    onEnter:HookRegistrationT;
    onError:HookRegistrationT;
    onExit:HookRegistrationT;
    onFinish:HookRegistrationT;
    onRetain:HookRegistrationT;
    onStart:HookRegistrationT;
    onSuccess:HookRegistrationT;
    promise:Promise<any>;
    success:boolean;
    $from():StateT;
    $to():StateT;
    addResolves(resolves:Object, state?:StateOrNameT):void;
    dynamic():boolean;
    entering():Array<StateDeclarationT>;
    error():string;
    exiting:Array<StateDeclarationT>;
    from():StateDeclarationT;
    getResolveTokens():Array<any>;
    getResolveValue(token:string[]):any[];
    getResolveValue(token:string):any;
    ignored:boolean;
    is(compare:TransitionT | Object):boolean;
    isActive():boolean;
    options():TransitionOptionsT;
    params(pathname?:string):Object;
    previous():TransitionT;
    redirect(targetState:TargetStateT):TransitionT;
    resolves():Object;
    retained:Array<StateDeclarationT>;
    run():Promise<any>;
    to():StateDeclarationT;
    toString():string;
    treeChanges():TreeChangesT;
    valid():boolean;
    views(pathname?:string, state?:StateT):Array<ViewConfigT>;
  }
  declare type TransitionT = Transition;

  declare type HrefOptionsT = {
    absolute:boolean;
    inherit:boolean;
    lossy:boolean;
    relative:StateOrNameT;
  }

  declare class StateService {
    $current:StateT;
    current:StateDeclarationT;
    params:StateParamsT;
    transition:TransitionT;
    router:UIRouterT;
    //get():Array<StateDeclarationT>;
    get(stateOrName:StateOrNameT):StateDeclarationT;
    //get(stateOrName:StateOrNameT, base:StateOrNameT):StateDeclarationT;
    go(to:StateOrNameT, params?:RawParamsT, options?:TransitionOptionsT):Promise<StateT>;
    href(stateOrName:StateOrNameT, params?:RawParamsT, options?:HrefOptionsT):string;
    includes(stateOrName:StateOrNameT, params?:RawParamsT, options?:TransitionOptionsT):boolean;
    is(stateOrName:StateOrNameT, params?:RawParamsT, options?:TransitionOptionsT):boolean;
    reload(reloadState?:StateOrNameT):Promise<StateT>;
    target(identifier:StateOrNameT, params:ParamsOrArrayT, options?:TransitionOptionsT):TargetStateT;
    transitionT(to:StateOrNameT, toParams?:RawParamsT, options?:TransitionOptionsT):Promise<StateT>;
  }
  declare type StateServiceT = StateService;

  declare class StateDeclaration {
    abstract:boolean;
    data:any;
    name:string;
    onEnter:HookRegistrationT;
    onExit:HookRegistrationT;
    onRetain:HookRegistrationT;
    params:Object;
    parent:string;
    reloadOnSearch:boolean;
    resolve:Object;
    router:UIRouterT;
    resolvePolicy:string | Object;
    url:string;
    views:Object;
  }
  declare type StateDeclarationT = StateDeclaration;

  declare type DefTypeT = 'config' | 'path' | 'search';

  declare class Type {
    name:string;
    pattern:RegExp;
    raw:boolean;
    $asArray(mode:any, isSearch:any):any;
    $normalize(val:any):any;
    $subPattern():string;
    decode(val:string, key?:string):any;
    encode(val:any, key?:string):string | Array<string>;
    equals(a:any, b:any):boolean;
    is(val:any, key?:string):boolean;
    toString():string;
  }
  declare type TypeT = Type;

  declare type RawParamsT = {[key:string]:any};

  declare class Param {
    array:boolean;
    config:any;
    dynamic:boolean;
    id:string;
    isOptional:boolean;
    location:DefTypeT;
    replace:any;
    squash:boolean | string;
    type:TypeT;
    isDefaultValue(value:any):boolean;
    isSearch():boolean;
    toString():string;
    validates(value:any):boolean;
    value(value?:any):any;
    changed(params:Array<ParamT>, values1?:Object, values2?:Object):Array<ParamT>;
    equals(params:Array<ParamT>, values1?:Object, values2?:Object):boolean;
    fromConfig(id:string, type:TypeT, config:any):ParamT;
    fromPath(id:string, type:TypeT, config:any):ParamT;
    fromSearch(id:string, type:TypeT, config:any):ParamT;
    validates(params:Array<ParamT>, values?:Object):boolean;
    values(params:Array<ParamT>, values?:Object):RawParamsT;
  }
  declare type ParamT = Param;

  declare class UrlMatcher {
    config:any;
    pattern:string;
    prefix:string;
    nameValidator:RegExp;
    append(url:UrlMatcherT):UrlMatcherT;
    exec(path:string, search?:any, hash?:string, options?:any):Object;
    format(values?:Object):string;
    isRoot():boolean;
    parameter(id:string, opts?:any):ParamT;
    parameters(opts?:any):Array<ParamT>;
    toString():string;
    validates(params:any):boolean;
    encodeDashes(str:any):string;
    pathSegmentsAndParams(matcher:UrlMatcherT):any;
    queryParams(matcher:UrlMatcherT):Array<ParamT>;
  }
  declare type UrlMatcherT = UrlMatcher;
  declare module.exports:string;
}
