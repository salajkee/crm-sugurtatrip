import PolicyTable from '@/components/policy/PolicyTable';
import { useHeaderStore } from '@/store/useHeaderStore';
import { useEffect } from 'react';

const PolicyRegistry = () => {
	const { setTitle, reset } = useHeaderStore();

	useEffect(() => {
		setTitle('Реестр полисов');

		return () => reset();
	}, [setTitle, reset]);

	return <PolicyTable />;
};

export default PolicyRegistry;
