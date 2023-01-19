import { describe, expect, test } from "@jest/globals";
import { ApplicationErrorMessages } from "../src/constants/enums";
import { ApplicationError } from "../src/errors/application.error";
import { handleErrors } from "../src/middleware/error.middleware";

describe("error middleware", () => {
    test("error middleware should catch Error", async () => {
        expect(() => {
            throw new Error();
        }).toThrowError(Error);
        expect(() => {
            handleErrors(() => {
                throw new Error();
            });
        }).not.toThrowError(Error);
    });

    test("error middleware should catch ApplicationError", async () => {
        expect(() => {
            throw new ApplicationError("test", false);
        }).toThrowError(ApplicationError);

        expect(() => {
            handleErrors(() => {
                throw new ApplicationError(
                    ApplicationErrorMessages.MISSING_USERSTORY,
                    false
                );
            });
        }).not.toThrowError(ApplicationError);
    });
});
