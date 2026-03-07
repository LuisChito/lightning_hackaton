import { createBrowserRouter } from 'react-router-dom'
import MainLayout from '../../components/layout/MainLayout'
import WelcomePage from '../../pages/welcome/main'
import HomePage from '../../pages/home/main'
import NodosPage from '../../pages/nodos/main'
import CanalesPage from '../../pages/canales/main'
import PagosPage from '../../pages/pagos/main'

export const router = createBrowserRouter([
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ index: true, element: <WelcomePage /> },
			{
				path: 'game',
				element: <HomePage />,
			},
			{
				path: 'nodos',
				element: <NodosPage />,
			},
			{
				path: 'canales',
				element: <CanalesPage />,
			},
			{
				path: 'pagos',
				element: <PagosPage />,
			},
		],
	},
])

