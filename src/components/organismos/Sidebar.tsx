import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Home, Users, Shield, Layout, BookOpen, GraduationCap, Menu, LogOut,
  Building, Landmark, ChevronRight, AppWindow, Route, Lock, UserCheck,
  User, School, Briefcase, BookCopy } from "lucide-react";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [, setShowLogoutAlert] = useState(false);
  const location = useLocation();

  const confirmLogout = () => {
    setShowLogoutAlert(true);
  };

  // Función para verificar si algún elemento de un grupo está activo
  const isGroupActive = (items: any[] | undefined) => {
    return items
      ? items.some((item) => location.pathname === item.path)
      : false;
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupName)
        ? prev.filter((g) => g !== groupName)
        : [...prev, groupName]
    );
  };

  const menuGroups = [
    {
      icon: <Home size={20} />,
      label: "Inicio",
      path: "/dashboard",
      standalone: true,
    },
    {
      icon: <AppWindow size={20} />,
      label: "Sistema",
      items: [
        { icon: <AppWindow size={20} />, label: "Aplicativos", path: "/aplicativos" },
        { icon: <Shield size={20} />, label: "Roles", path: "/roles" },
        { icon: <BookCopy size={20} />, label: "Módulos", path: "/modulos" },
        { icon: <Route size={20} />, label: "Rutas", path: "/rutas" },
        { icon: <Lock size={20} />, label: "Permisos", path: "/permisos" },
      ],
    },
    {
      icon: <Users size={20} />,
      label: "Usuarios",
      items: [
        { icon: <User size={20} />, label: "Usuarios", path: "/usuarios" },
        { icon: <UserCheck size={20} />, label: "Accesos", path: "/accesos" },
        { icon: <Users size={20} />, label: "Personas", path: "/personas" },
      ],
    },
    {
      icon: <BookOpen size={20} />,
      label: "Formación",
      items: [
        { icon: <BookOpen size={20} />, label: "Cursos", path: "/cursos" },
        { icon: <GraduationCap size={20} />, label: "Matrículas", path: "/matriculas" },
        { icon: <School size={20} />, label: "Centro Formación", path: "/centro-formacion" },
        { icon: <Briefcase size={20} />, label: "Programas", path: "/programas" },
      ],
    },
    {
      icon: <Building size={20} />,
      label: "Infraestructura",
      items: [
        { icon: <Layout size={20} />, label: "Áreas", path: "/areas" },
        { icon: <Building size={20} />, label: "Sedes", path: "/sedes" },
        { icon: <Landmark size={20} />, label: "Ambientes", path: "/ambientes" },
      ],
    },
  ];

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-white to-blue-50 text-gray-800 shadow-lg border-r border-blue-100`}>
      <div className={`flex items-center justify-between p-4 border-blue-100 border-b bg-white shadow-sm`}>
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <h2 className={`font-bold text-xl bg-gradient-to-r from-emerald-600 to-blue-600 text-transparent bg-clip-text`}>SENA</h2>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-md hover:bg-blue-100 text-gray-700 transition-all duration-200 hover:shadow-sm`}
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {menuGroups.map((group, index) => (
          <div key={index} className="mb-1">
            {group.standalone ? (
              <a
                href={group.path}
                className={`flex items-center px-4 py-3 ${(group.path === location.pathname) 
                  ? `bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md` 
                  : `hover:bg-blue-100 text-gray-700 hover:text-emerald-600`
                } hover:pl-5 transition-all duration-300 rounded-lg cursor-pointer font-medium border border-blue-100 my-1 hover:shadow-md`}
              >
                <div className="mr-3">{group.icon}</div>
                {!collapsed && <span>{group.label}</span>}
              </a>
            ) : (
              <div className="mb-1">
                <div
                  onClick={() => !collapsed && toggleGroup(group.label)}
                  className={`flex items-center px-4 py-3 ${isGroupActive(group.items) 
                    ? `bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md` 
                    : `hover:bg-blue-100 text-gray-700 hover:text-emerald-600`
                  } hover:pl-5 transition-all duration-300 rounded-lg cursor-pointer font-medium border border-blue-100 my-1 hover:shadow-md`}
                >
                  <div className="mr-3">{group.icon}</div>
                  {!collapsed && (
                    <>
                      <span className="flex-grow">{group.label}</span>
                      <ChevronRight
                        size={20}
                        className={`transition-transform duration-300 ${
                          expandedGroups.includes(group.label)
                            ? "rotate-90"
                            : ""
                        }`}
                      />
                    </>
                  )}
                </div>

                <div
                  className={`pl-4 transition-all duration-300 ease-in-out overflow-hidden ${expandedGroups.includes(group.label) ? "max-h-96" : "max-h-0"}`}
                >
                  {group.items?.map((item, itemIndex) => (
                    <div key={itemIndex} className="w-full">
                      <a
                        href={item.path}
                        className={`flex items-center px-4 py-2 my-1 ${item.path === location.pathname 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-sm' 
                          : 'hover:bg-blue-100 text-gray-600 hover:text-emerald-600'
                        } transition-all duration-300 rounded-lg cursor-pointer font-medium border border-blue-100 hover:shadow-sm`}
                      >
                        <div className="mr-3">{item.icon}</div>
                        <span>{item.label}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={`mt-auto border-t border-blue-100 bg-white transition-colors duration-300`}>
        <div className="px-3 py-3">
          <button
            onClick={confirmLogout}
            className={`flex items-center px-3 py-2 text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-300 cursor-pointer w-full text-left rounded-lg font-medium hover:shadow-sm m-1 border border-transparent hover:border-red-100`}
          >
            <div className="mr-3">
              <LogOut size={20} />
            </div>
            {!collapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
