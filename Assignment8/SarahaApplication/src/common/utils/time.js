export function toMs(time, unit) {
    switch (unit) {
        case 'seconds':
            return time * 1000;
        case 'minutes':
            return time * 60 * 1000;
        case 'hours':
            return time * 60 * 60 * 1000;
        default:
            throw new Error('Invalid unit');
    }
}

export function toseconds(time, unit) {
    switch (unit) {
        case 'milliseconds':
            return time / 1000;
        case 'minutes':
            return time * 60 ;
        case 'hours':
            return time * 60 * 60;
        default:
            throw new Error('Invalid unit');
    }
}

