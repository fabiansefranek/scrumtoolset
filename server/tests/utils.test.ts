import { describe, expect, test } from "@jest/globals";
import { checkUserInput, generateWordSlug } from "../src/utils";

describe("utils", () => {
    test("checks user input utility", () => {
        expect(checkUserInput("hello")).toBe(true);
        expect(checkUserInput("hello_world")).toBe(true);
        expect(checkUserInput("hello.world")).toBe(true);
        expect(checkUserInput("helloworld1")).toBe(true);
        expect(checkUserInput("hello world")).toBe(false);
        expect(checkUserInput("hello-world")).toBe(false);
        expect(checkUserInput("hello/world")).toBe(false);
        expect(checkUserInput("hello.world!")).toBe(false);
        expect(checkUserInput("hellö")).toBe(false);
        expect(checkUserInput("")).toBe(false);
        expect(checkUserInput(">")).toBe(false);
    });

    test("checks world slug generator", () => {
        const slug: string = generateWordSlug(3, "-");
        expect(slug.split("-").length).toBe(3);
        expect(slug.split("-").length).not.toBe(4);
    });
});
