import { useEffect } from 'react';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { PolicySelectionStep } from '@/components/wizard/PolicySelectionStep';
import { TouristDataStep } from '@/components/wizard/TouristDataStep';
import { ConfirmationStep } from '@/components/wizard/ConfirmationStep';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useStepperStore } from '@/store/useStepperStore';
import { useTouristDataStore } from '@/store/useTouristDataStore';

const CreatePolicy = () => {
	const currentStep = useStepperStore(state => state.currentStep);
	const setCurrentStep = useStepperStore(state => state.setCurrentStep);
	const triggerValidation = useTouristDataStore(
		state => state.triggerValidation,
	);
	const nextStep = useStepperStore(state => state.nextStep);

	const { setTitle, reset } = useHeaderStore();

	useEffect(() => {
		setTitle('Создать полис');
		return () => reset();
	}, [setTitle, reset]);

	const steps = [
		{ id: 1, name: 'Выбор полиса' },
		{ id: 2, name: 'Данные туристов' },
		{ id: 3, name: 'Оплата' },
	];

	const handleBack = () => {
		if (currentStep > 1) setCurrentStep(currentStep - 1);
	};

	const handleNext = async () => {
		if (currentStep === 2 && triggerValidation) {
			const isValid = await triggerValidation();
			if (!isValid) return;
		}
		nextStep();
	};

	return (
		<div className="mx-auto max-w-7xl">
			<Stepper steps={steps} currentStep={currentStep} />

			<div className="bg-card mt-6 p-8 border rounded-lg">
				{currentStep === 1 && <PolicySelectionStep />}
				{currentStep === 2 && <TouristDataStep />}
				{currentStep === 3 && <ConfirmationStep />}

				{currentStep === 2 && (
					<div className="flex justify-between mt-8">
						<Button onClick={handleBack} variant="outline">
							Назад
						</Button>
						<Button onClick={handleNext}>Далее</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default CreatePolicy;
