import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useOperatorStore } from '@/store/useOperatorStore';
import { Plus } from 'lucide-react';
import AgenciesTable from '@/components/agencies/AgenciesTable';
import AgencyAddDialog from '@/components/agencies/AgencyAddDialog';

const TravelAgencies = () => {
	const { setTitle, setActions, reset } = useHeaderStore();
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const { createOperator } = useOperatorStore();

	useEffect(() => {
		setTitle('Турагентства');
		setActions(
			<Button onClick={() => setIsDialogOpen(true)}>
				<Plus className="mr-2 w-4 h-4" />
				Добавить
			</Button>,
		);

		return () => reset();
	}, [setTitle, setActions, reset]);

	const handleSave = async (data: any) => {
		try {
			await createOperator(data);
			setIsDialogOpen(false);
		} catch {
			// ошибка доступна через error из store
		}
	};

	return (
		<>
			<AgenciesTable />
			<AgencyAddDialog
				isOpen={isDialogOpen}
				onClose={() => setIsDialogOpen(false)}
				onSave={handleSave}
			/>
		</>
	);
};

export default TravelAgencies;
