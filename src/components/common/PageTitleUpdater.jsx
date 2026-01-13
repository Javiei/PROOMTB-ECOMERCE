import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PageTitleUpdater = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = 'PROOMTB & ROAD | Tu tienda de bicicletas';

        if (path === '/') {
            title = 'Inicio | PROOMTB & ROAD'; // Home
        } else if (path.startsWith('/accesorios')) {
            title = 'Accesorios | PROOMTB & ROAD';
        } else if (path.startsWith('/ebikes')) {
            title = 'E-Bikes | PROOMTB & ROAD';
        } else if (path.startsWith('/admin')) {
            if (path.includes('/bikes')) title = 'Admin - Bicicletas | PROOMTB';
            else if (path.includes('/accessories')) title = 'Admin - Accesorios | PROOMTB';
            else if (path.includes('/dashboard')) title = 'Admin - Dashboard | PROOMTB';
            else title = 'Admin Panel | PROOMTB';
        } else if (path.startsWith('/series/')) {
            // Extract series name and format it
            const seriesSegments = path.split('/');
            const seriesName = seriesSegments[seriesSegments.length - 1]; // Get last segment
            const formattedName = seriesName.charAt(0).toUpperCase() + seriesName.slice(1);
            title = `${formattedName} Series | Raymon`;
        } else if (path.startsWith('/product/')) {
            title = 'Detalle de Producto | PROOMTB';
        } else if (path.startsWith('/profile')) {
            title = 'Mi Perfil | PROOMTB';
        }

        document.title = title;
    }, [location]);

    return null;
};

export default PageTitleUpdater;
