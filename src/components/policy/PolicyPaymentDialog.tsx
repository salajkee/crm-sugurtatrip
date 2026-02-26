import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import type { PolicyCreateResponse } from '@/types/policy';
import clickLogo from '@/assets/click-logo.svg';
import paymeLogo from '@/assets/payme-logo.svg';

interface PolicyPaymentDialogProps {
	policy: PolicyCreateResponse | null;
	isOpen: boolean;
	onClose: () => void;
}

export default function PolicyPaymentDialog({
	policy,
	isOpen,
	onClose,
}: PolicyPaymentDialogProps) {
	const clickLink = policy?.data?.payment?.click;
	const paymeLink = policy?.data?.payment?.payme;

	const hasLinks = clickLink || paymeLink;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-[400px]">
				<DialogHeader>
					<DialogTitle>Оплата полиса #{policy?.id}</DialogTitle>
				</DialogHeader>

				{hasLinks ? (
					<div className="flex flex-col gap-3 py-4">
						<p className="text-muted-foreground text-sm text-center">
							Выберите способ оплаты
						</p>
						<div className="flex justify-center gap-4">
							{clickLink && (
								<a
									href={clickLink}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										size="lg"
										variant="outline"
										className="gap-2 min-w-[150px] h-12"
									>
										<img
											src={clickLogo}
											alt="Click"
											className="h-5"
										/>
									</Button>
								</a>
							)}
							{paymeLink && (
								<a
									href={paymeLink}
									target="_blank"
									rel="noopener noreferrer"
								>
									<Button
										size="lg"
										variant="outline"
										className="gap-2 min-w-[150px] h-12"
									>
										<img
											src={paymeLogo}
											alt="Payme"
											className="h-5"
										/>
									</Button>
								</a>
							)}
						</div>
					</div>
				) : (
					<p className="py-4 text-muted-foreground text-sm text-center">
						Ссылки на оплату недоступны
					</p>
				)}
			</DialogContent>
		</Dialog>
	);
}
