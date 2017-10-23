declare type $action = {
 +type: string,
 payload: any,
}

declare type $dispatch = (action: $action) => any
