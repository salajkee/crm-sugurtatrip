import { cn } from '@/utils/utils';

interface Step {
	id: number;
	name: string;
}

interface StepperProps {
	steps: Step[];
	currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
	return (
		<div className="flex justify-between items-center m-auto mb-8 w-[900px]">
			{steps.map((step, index) => (
				<div
					key={step.id}
					className="relative flex flex-1 items-center"
				>
					<div
						className={cn(
							'flex-col flex-1 items-center',
							step.id === 2
								? 'flex items-center'
								: step.id === 3
									? 'flex items-end'
									: '',
						)}
					>
						<div
							className={cn(
								'flex justify-center items-center rounded-full w-12 h-12 transition-colors',
								currentStep >= step.id
									? 'bg-primary text-white'
									: 'bg-gray-300 text-gray-600',
							)}
						>
							{step.id}
						</div>
						<span
							className={cn(
								'mt-2 font-medium text-sm',
								currentStep >= step.id
									? 'text-foreground'
									: 'text-muted-foreground',
							)}
						>
							{step.name}
						</span>
					</div>

					{index < steps.length - 1 && (
						<div
							className={cn(
								'absolute flex-1 -mt-8 h-0.5 transition-colors',
								currentStep > step.id
									? 'bg-primary'
									: 'bg-gray-300',
								step.id === 1
									? 'w-[314px] left-[80px]'
									: step.id === 2
										? 'w-[314px] left-[206px]'
										: '',
							)}
						/>
					)}
				</div>
			))}
		</div>
	);
}
