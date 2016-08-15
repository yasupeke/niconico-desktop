
export module MainAction {
    export const OPEN = 'open';
    export const OPEN_SUCCESS = 'openSuccess';
    export const OPEN_ERROR = 'openError';
    export const CLOSE = 'close';
    export const CLOSE_SUCCESS = 'closeSuccess';
    export const CHANGE_ALPHA = 'setAlpha';
    export const CHANGE_HOST = 'changeHost';
    export const CHANGE_HOST_SUCCESS = 'changeHostSuccess';
    export const CHANGE_HOST_ERROR = 'changeHostError';
}

export module ReceiverAction {
    export const JOIN_SUCCESS = 'joinSuccess';
    export const CLOSE = 'close';
    export const CLOSE_END = 'closeEnd';
    export const CHANGE_ALPHA = 'setAlpha';
}