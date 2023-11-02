export class ResponseObject<T> {
    private status: number;
    private message: string;
    private data: T;
  
    constructor(status: number, message: string, data: T) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}