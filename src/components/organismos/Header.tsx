import { User } from "lucide-react"; 

const Header = ({ userName = "Usuario" }) => { 
  return (
    <header className={`shadow-md h-16 relative z-10 transition-all duration-300 border-b border-blue-100`}>
        <div className={`flex items-center justify-between h-full px-6 bg-white transition-all duration-300`}>
          <div className="flex-1 max-w-md hidden md:block">
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <div className={`h-8 w-px bg-gray-200 hidden md:block`} />
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className={`w-10 h-10 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-white shadow-md transition-all duration-300 group-hover:shadow-lg`}>
                <User
                  size={20}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-col hidden md:block">
                <span className="text-gray-800 text-sm font-medium group-hover:text-emerald-600 transition-colors duration-200">
                  {userName}
                </span>
                <span className={`text-xs text-gray-500`}> Administrador</span>
              </div>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header