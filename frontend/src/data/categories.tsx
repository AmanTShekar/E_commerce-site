import React from 'react';
import { 
  Smartphone, Monitor, Headphones, Layout, 
  MousePointer, Gamepad2, Lamp, Sofa, Watch, Coffee, Zap
} from 'lucide-react';

export const categories = [
  { icon: <Smartphone size={24} />, label: 'Mobiles', count: '1.2k' },
  { icon: <Monitor size={24} />, label: 'Laptops', count: '840' },
  { icon: <Headphones size={24} />, label: 'Audio', count: '1.5k' },
  { icon: <Zap size={24} />, label: 'Flash Sale', count: 'Live' },
  { icon: <Layout size={24} />, label: 'Hardware', count: '920' },
  { icon: <MousePointer size={24} />, label: 'Accessories', count: '2.1k' },
  { icon: <Gamepad2 size={24} />, label: 'Gaming', count: '600' },
  { icon: <Lamp size={24} />, label: 'Lighting', count: '450' },
  { icon: <Sofa size={24} />, label: 'Furniture', count: '320' },
  { icon: <Watch size={24} />, label: 'Wearables', count: '1.1k' },
  { icon: <Coffee size={24} />, label: 'Appliances', count: '240' },
];
