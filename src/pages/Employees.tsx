import EmployeesTable from '@/components/employee/EmployeesTable';
import EmployeeAddDialog from '@/components/employee/EmployeeAddDialog';
import { Button } from '@/components/ui/button';
import { useHeaderStore } from '@/store/useHeaderStore';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useEmployeeStore } from '@/store/useEmployeeStore';

const Employees = () => {
	const { setTitle, setActions, reset } = useHeaderStore();
	const { createEmployee } = useEmployeeStore();
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

	const handleSaveAdd = async (data: any) => {
		try {
			await createEmployee(data);
			setIsAddDialogOpen(false);
		} catch {
			// ошибка доступна через error из store
		}
	};

	useEffect(() => {
		setTitle('Сотрудники');
		setActions(
			<Button onClick={() => setIsAddDialogOpen(true)}>
				<Plus className="mr-2 w-4 h-4" />
				Добавить
			</Button>,
		);

		return () => reset();
	}, [setTitle, setActions, reset]);

	return (
		<>
			<EmployeesTable />
			<EmployeeAddDialog
				isOpen={isAddDialogOpen}
				onClose={() => setIsAddDialogOpen(false)}
				onSave={handleSaveAdd}
			/>
		</>
	);
};

export default Employees;
