export function isEmail(input: string): any {
    if (input !== null) {
        const pattern = /\b[A-Za-z0-9._%+-]+@flightlinebcn\.com\b/;
        return pattern.test(input);
    } 
}