export function checkUserInput(input: string): boolean {
    return /^[a-zA-Z0-9_\.]+$/.test(input); // lower case letters + upper case letters + nùmbers + underscore + dot
}
