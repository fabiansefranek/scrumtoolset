export function checkUserInput(input: string): boolean {
    return /^[a-zA-Z0-9_.]+$/.test(input); // lower case letters + upper case letters + nùmbers + underscore + dot
}

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
