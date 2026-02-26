import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface StepperState {
	currentStep: number;
	completedSteps: number[];

	setCurrentStep: (step: number) => void;
	nextStep: () => void;
	prevStep: () => void;
	markStepComplete: (step: number) => void;
	canGoToStep: (step: number) => boolean;
	reset: () => void;
}

const initialState = {
	currentStep: 1,
	completedSteps: [],
};

export const useStepperStore = create<StepperState>()(
	persist(
		(set, get) => ({
			...initialState,

			setCurrentStep: step => {
				const { canGoToStep } = get();
				if (canGoToStep(step)) {
					set({ currentStep: step });
				}
			},

			nextStep: () => {
				const { currentStep, completedSteps } = get();
				set({
					currentStep: currentStep + 1,
					completedSteps: completedSteps.includes(currentStep)
						? completedSteps
						: [...completedSteps, currentStep],
				});
			},

			prevStep: () => {
				const { currentStep } = get();
				if (currentStep > 1) {
					set({ currentStep: currentStep - 1 });
				}
			},

			markStepComplete: step => {
				const { completedSteps } = get();
				if (!completedSteps.includes(step)) {
					set({ completedSteps: [...completedSteps, step] });
				}
			},

			canGoToStep: step => {
				const { completedSteps } = get();
				if (step === 1) return true;
				return completedSteps.includes(step - 1);
			},

			reset: () => set(initialState),
		}),
		{
			name: 'stepper-storage',
		},
	),
);
