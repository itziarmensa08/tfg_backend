/* export function isEmail(input: string): any {
    if (input !== null) {
        const pattern = /\b[A-Za-z0-9._%+-]+@flightlinebcn\.com\b/;
        return pattern.test(input);
    } 
} */

export function isEmail(input: string): boolean {
    if (input !== null) {
        const pattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        return pattern.test(input);
    } 
    return false;
}