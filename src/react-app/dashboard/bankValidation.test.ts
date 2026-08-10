import { describe, expect, it } from "vitest";
import {
	ageYears,
	digitsOnly,
	isAdult,
	isEmail,
	maskCep,
	maskPhone,
} from "./bankValidation";

describe("bankValidation", () => {
	it("strips non-digits", () => {
		expect(digitsOnly("(11) 98765-4321")).toBe("11987654321");
	});

	it("computes age and adult gate", () => {
		const today = new Date(2026, 7, 10); // Aug 10, 2026
		expect(ageYears("2000-01-01", today)).toBe(26);
		expect(ageYears("2015-01-01", today)).toBe(11);
		expect(isAdult("2000-01-01")).toBe(true);
	});

	it("masks phone and CEP", () => {
		expect(maskPhone("11987654321")).toBe("(11) 98765-4321");
		expect(maskPhone("1133334444")).toBe("(11) 3333-4444");
		expect(maskCep("01310100")).toBe("01310-100");
	});

	it("validates email shape", () => {
		expect(isEmail("a@b.co")).toBe(true);
		expect(isEmail("nope")).toBe(false);
	});
});
