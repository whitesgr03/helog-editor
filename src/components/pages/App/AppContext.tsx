import {
	createContext,
	useContext,
	ReactNode,
	useReducer,
	useMemo,
} from 'react';

export interface State {
	alert: {
		message: string;
		error: boolean;
		delay: number;
	}[];
	modal: { component: ReactNode; clickBgToClose?: boolean };
}

export interface AppDataAPI {
	onAlert: (_alert: State['alert']) => void;
	onModal: (_modal: State['modal']) => void;
}

type Actions =
	| { type: 'updatedAlert'; alert: State['alert'] }
	| { type: 'updatedModal'; modal: State['modal'] };

export const AlertContext = createContext([] as State['alert']);
export const ModalContext = createContext({} as State['modal']);
export const AppDataAPIContext = createContext({} as AppDataAPI);

export const reducer = (state: State, action: Actions): State => {
	switch (action.type) {
		case 'updatedAlert':
			return {
				...state,
				alert:
					action.alert.length === 0 || state.alert.length >= 2
						? action.alert
						: state.alert.concat(action.alert),
			};
		case 'updatedModal':
			document.body.removeAttribute('style');
			action.modal.component && (document.body.style.overflow = 'hidden');
			return { ...state, modal: { ...state.modal, ...action.modal } };
	}
};

export const initialData: State = {
	alert: [],
	modal: { component: null, clickBgToClose: true },
};

export const useAlert = () => useContext(AlertContext);
export const useModal = () => useContext(ModalContext);
export const useAppDataAPI = () => useContext(AppDataAPIContext);

export const AppProvider = ({ children }: { children: React.ReactElement }) => {
	const [state, dispatch] = useReducer(reducer, initialData);

	const api = useMemo(
		() => ({
			onAlert: (alert: State['alert']) => {
				dispatch({
					type: 'updatedAlert',
					alert,
				});
			},
			onModal: (modal: State['modal']) => {
				dispatch({
					type: 'updatedModal',
					modal,
				});
			},
		}),
		[],
	);

	return (
		<AppDataAPIContext.Provider value={api}>
			<ModalContext.Provider value={state.modal}>
				<AlertContext.Provider value={state.alert}>
					{children}
				</AlertContext.Provider>
			</ModalContext.Provider>
		</AppDataAPIContext.Provider>
	);
};
