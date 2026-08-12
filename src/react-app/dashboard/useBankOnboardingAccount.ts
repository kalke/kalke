import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
	bankMeta,
	bankOnboarding,
	type BankMeta,
	type BankOnboardingHolder,
} from "../api";
import { digitsOnly, isAdult, isEmail } from "./bankValidation";
import { bankOnboardingPath } from "./bankOnboardingStatus";

export type Step = 0 | 1 | 2 | 3 | 4 | 5;

export type WizardState = {
	full_name: string;
	birth_date: string;
	document_number: string;
	cep: string;
	street: string;
	number: string;
	complement: string;
	neighborhood: string;
	city: string;
	state: string;
	email: string;
	phone: string;
	terms_accepted: boolean;
};

export const emptyWizard: WizardState = {
	full_name: "",
	birth_date: "",
	document_number: "",
	cep: "",
	street: "",
	number: "",
	complement: "",
	neighborhood: "",
	city: "",
	state: "",
	email: "",
	phone: "",
	terms_accepted: false,
};

type PersistedWizard = {
	form: WizardState;
	step: Step;
};

const STORAGE_PREFIX = "kalke-bank-onboarding-v1";

const HOLDER_FIELDS = [
	"full_name",
	"document_number",
	"cep",
	"street",
	"number",
	"complement",
	"neighborhood",
	"city",
	"state",
	"email",
	"phone",
] as const satisfies ReadonlyArray<keyof WizardState>;

export function storageKey(accountId: string): string {
	return accountId ? `${STORAGE_PREFIX}:${accountId}` : STORAGE_PREFIX;
}

function loadPersisted(key: string): PersistedWizard | null {
	try {
		const raw = sessionStorage.getItem(key);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as Partial<PersistedWizard> &
			Partial<WizardState>;
		if (parsed && typeof parsed === "object" && "form" in parsed) {
			const stepNum = Number((parsed as PersistedWizard).step);
			const step = (
				Number.isInteger(stepNum) && stepNum >= 0 && stepNum <= 5 ? stepNum : 0
			) as Step;
			return {
				form: { ...emptyWizard, ...(parsed as PersistedWizard).form },
				step,
			};
		}
		return { form: { ...emptyWizard, ...(parsed as WizardState) }, step: 0 };
	} catch {
		return null;
	}
}

function validateFieldsForStep(form: WizardState, s: Step): string | null {
	if (s === 1) {
		if (form.full_name.trim().length < 2) return "name";
		if (!form.birth_date) return "dob";
		if (!isAdult(form.birth_date)) return "age";
		if (digitsOnly(form.document_number).length < 11) return "doc";
	}
	if (s === 2) {
		if (digitsOnly(form.cep).length !== 8) return "cep";
		if (!form.street.trim() || !form.number.trim()) return "address";
	}
	if (s === 3) {
		if (!isEmail(form.email)) return "email";
		if (digitsOnly(form.phone).length < 10) return "phone";
	}
	if (s === 4 && !form.terms_accepted) return "terms";
	return null;
}

function inferStepFromForm(form: WizardState, hasIdDoc: boolean): Step {
	if (validateFieldsForStep(form, 4) == null && form.terms_accepted) return 5;
	if (validateFieldsForStep(form, 3) == null) return 4;
	if (validateFieldsForStep(form, 2) == null) return 3;
	if (validateFieldsForStep(form, 1) == null) return 2;
	if (hasIdDoc || form.full_name.trim().length >= 2) return 1;
	return 0;
}

function holderPrefill(
	holder: BankOnboardingHolder | null | undefined,
	form: WizardState,
): Partial<WizardState> {
	if (!holder) return {};
	const patch: Partial<WizardState> = {};
	for (const key of HOLDER_FIELDS) {
		const incoming = holder[key];
		if (!form[key].trim() && incoming) patch[key] = incoming;
	}
	if (!form.birth_date && holder.birth_date) {
		patch.birth_date = holder.birth_date.slice(0, 10);
	}
	return patch;
}

export function persistWizard(
	accountId: string,
	form: WizardState,
	step: Step,
): void {
	sessionStorage.setItem(
		storageKey(accountId),
		JSON.stringify({ form, step } satisfies PersistedWizard),
	);
}

export function useBankOnboardingAccount(accountId: string) {
	const persistKey = storageKey(accountId);
	const [step, setStep] = useState<Step>(
		() => loadPersisted(persistKey)?.step ?? 0,
	);
	const [form, setForm] = useState<WizardState>(
		() => loadPersisted(persistKey)?.form ?? emptyWizard,
	);
	const [meta, setMeta] = useState<BankMeta | null>(null);
	const navigate = useNavigate();

	useEffect(() => {
		persistWizard(accountId, form, step);
	}, [accountId, form, step]);

	useEffect(() => {
		let cancelled = false;
		const formAtOpen = form;
		(async () => {
			try {
				const [m, status] = await Promise.all([
					bankMeta().catch(() => null),
					bankOnboarding(accountId || undefined).catch(() => null),
				]);
				if (cancelled) return;
				if (m) setMeta(m);
				const hasIdDoc = Boolean(
					status?.documents?.some((d) => d.doc_type === "identity_document"),
				);
				const patch = holderPrefill(status?.holder, formAtOpen);
				const next = Object.keys(patch).length
					? { ...formAtOpen, ...patch }
					: formAtOpen;
				setForm(next);
				setStep((s) => Math.max(s, inferStepFromForm(next, hasIdDoc)) as Step);
			} catch {
				/* optional */
			}
		})();
		return () => {
			cancelled = true;
		};
		// Instance is keyed by accountId; first-render form is the persist snapshot.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [accountId]);

	function patch(partial: Partial<WizardState>) {
		setForm((prev) => ({ ...prev, ...partial }));
	}

	function bindAccountUrl(target: string | undefined, nextForm: WizardState, nextStep: Step) {
		if (!target || target === accountId) return;
		persistWizard(target, nextForm, nextStep);
		navigate(bankOnboardingPath(target), { replace: true });
	}

	return {
		persistKey,
		form,
		setForm,
		step,
		setStep,
		patch,
		meta,
		bindAccountUrl,
	};
}
