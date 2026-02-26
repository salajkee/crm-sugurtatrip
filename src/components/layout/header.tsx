import { useHeaderStore } from '@/store/useHeaderStore';
import { SidebarTrigger } from '../ui/sidebar';

export function Header() {
	const { title, actions } = useHeaderStore();

	return (
		<header className="flex items-center gap-2 px-4 border-b h-16">
			<SidebarTrigger />
			<div className="flex flex-1 justify-between items-center">
				<h1 className="font-semibold text-2xl">{title}</h1>

				{actions && (
					<div className="flex items-center gap-2">{actions}</div>
				)}
			</div>
		</header>
	);
}
