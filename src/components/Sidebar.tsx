'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { BookCheck, CheckCheck, PowerOff, User2 } from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const taskItems = [
    { label: 'Tarefas', href: '/tasks', icon: <BookCheck /> },
    { label: 'Concluídas', href: '/completed', icon: <CheckCheck /> },
  ];

  const configItems = [
    { label: 'Perfil', href: '/profile', icon: <User2 /> },
  ];

  const documentItems = [
    { label: 'Documentos', href: '/documents', icon: <BookCheck /> },
  ]

  async function handleLogout() {
    await signOut({ redirect: false });
    router.push('/login');
  }

  return (
    <aside className="fixed top-0 left-0 md:w-60 w-10 bg-gray-900 text-white min-h-screen h-full flex flex-col md:p-4 p-1">
      <h2 className="text-xl font-bold mb-6 md:block text-orange-500 hidden">Ges<b className='text-white'>ditho</b></h2>

      <nav className="flex flex-col gap-3 flex-grow">
        <h6 className='text-sm text-gray-500 md:block hidden'>TAREFAS</h6>
        {taskItems.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded flex items-center md:justify-start justify-center gap-2 ${
              pathname === href ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <i>
              {icon}
            </i>
            <h3 className='md:block hidden'>
              {label}
            </h3>
          </Link>
        ))}

        <h6 className='text-sm text-gray-500 md:block hidden'>DOCUMENTOS</h6>
        {documentItems.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded flex items-center md:justify-start justify-center gap-2 ${
              pathname === href ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <i>
              {icon}
            </i>
            <h3 className='md:block hidden'>
              {label}
            </h3>
          </Link>
        ))}

        <h6 className='text-sm text-gray-500 md:block hidden'>CONFIGURAÇÕES</h6>
        {configItems.map(({ label, href, icon }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-2 rounded flex items-center md:justify-start justify-center gap-2 ${
              pathname === href ? 'bg-gray-700' : 'hover:bg-gray-700'
            }`}
          >
            <i>
              {icon}
            </i>
            <h3 className='md:block hidden'>
              {label}
            </h3>
          </Link>
        ))}
      </nav>

      <button
        onClick={handleLogout}
        className="mt-auto bg-red-600 hover:bg-red-700 rounded md:px-3 md:py-2 p-1 flex items-center gap-2 md:justify-start justify-center"
      >
        <PowerOff size={30}/>
        <h2 className='md:block hidden'>
          Sair
        </h2>
      </button>
    </aside>
  );
}
