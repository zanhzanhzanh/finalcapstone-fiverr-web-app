export function uuidToBuffer(value: string): Buffer {
    return Buffer.from(value.replace(/-/g, ''), 'hex');
}

export function toISOTime(object: object, property: string): void {
    object[property] =  new Date(object[property]).toISOString();
}