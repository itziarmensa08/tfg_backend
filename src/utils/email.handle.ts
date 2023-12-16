export function isEmail(input: string): any {
    if (input !== null) {
        const pattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
        return pattern.test(input);
    } 
}