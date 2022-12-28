import { ZodErrorMap, ZodIssueOptionalMessage } from "zod";

export const errorMap : ZodErrorMap = (issue, ctx) => {
    const userError = getUserErrorFromIssue(issue);
    return {
        message: userError
    }       
}

const getUserErrorFromIssue = (issue: ZodIssueOptionalMessage) => {
    switch (issue.code) {
        case "invalid_type":
            if (issue.received === "undefined") {
                return `Missing field '${issue.path.join(".")}'`;
            }

            return `Invalid type for ${issue.path.join(".")}: ${issue.expected} expected, ${issue.received} received`;
        case "too_small":
            return `Value for '${issue.path.join(".")}' is too small: ${issue.minimum} expected`;
        case "too_big":
            return `Value for '${issue.path.join(".")}' is too big: ${issue.maximum} expected`;
        case "invalid_enum_value":
            return `Invalid value for '${issue.path.join(".")}': One of ${issue.options.join(",")} expected`;
    }
    return issue.message || "Unknown error";
}