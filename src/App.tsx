/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { BottomNav } from './components/BottomNav';
import { Header } from './components/Header';
import { Catalogo3DScreen } from './screens/Catalogo3DScreen';
import { FinanzasScreen } from './screens/FinanzasScreen';
import { InventarioScreen } from './screens/InventarioScreen';
import { LogisticaScreen } from './screens/LogisticaScreen';
import { OptimizadorScreen } from './screens/OptimizadorScreen';
import { PedidosScreen } from './screens/PedidosScreen';
import { ScreenId } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('optimizador-2d');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeScreen]);

  return (
    <div className="bg-surface font-sans text-body-md text-on-surface min-h-screen flex flex-col antialiased selection:bg-primary-container selection:text-on-primary">
      <Header activeScreen={activeScreen} onNavigate={setActiveScreen} />

      <main className="flex-1 flex flex-col relative w-full pt-20 pb-28 bg-surface">
        {activeScreen === 'optimizador-2d' && <OptimizadorScreen />}
        {activeScreen === 'pedidos' && <PedidosScreen />}
        {activeScreen === 'inventario' && <InventarioScreen />}
        {activeScreen === 'catalogo-3d' && <Catalogo3DScreen />}
        {activeScreen === 'finanzas' && <FinanzasScreen />}
        {activeScreen === 'fletes-y-gps' && <LogisticaScreen />}
      </main>

      <BottomNav activeScreen={activeScreen} onNavigate={setActiveScreen} />
    </div>
  );
}
