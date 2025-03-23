class List{ // linked list
    constructor(){
        var [first, ...rest] = arguments;
        this.value = first;
        rest.length > 0 ? this.next = new List(...rest) : this.next = null;
    }
    push(){
        this.next == null ? this.next = new List(...arguments) : this.next.push(...arguments);
    }
    pop(){
        this.next.next == null ? this.next = null : this.next.pop();
    }
    length(){
        return this.next == null ? 1 : this.next.length() + 1;
    }
}