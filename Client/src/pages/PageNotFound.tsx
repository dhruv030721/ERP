import { BookOpen, GraduationCap, Home, School } from "lucide-react"
import { Header } from "../components/index"
import { useNavigate } from "react-router-dom";

const PageNotFound = () => {

    const navigate = useNavigate();

    return (
        <div>
            <Header />
            <div className="h-screen font-poppins flex flex-col items-center justify-center bg-white p-4">
                <div className="text-center max-w-2xl mx-auto">
                    <div className="flex justify-center space-x-4 md:space-x-8 mb-4 md:mb-8">
                        <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-orange-500 animate-bounce" />
                        <School className="w-8 h-8 md:w-12 md:h-12 text-blue-900 animate-bounce delay-100" />
                        <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-orange-500 animate-bounce delay-200" />
                    </div>

                    <h1 className="text-blue-900 font-bold text-6xl md:text-9xl mb-2 md:mb-4">404</h1>

                    <h2 className="text-xl md:text-3xl font-semibold text-blue-900 mb-4 md:mb-8 px-4">
                        Oops! Looks like this lesson is missing
                    </h2>

                    <button
                        onClick={() => navigate('/')}
                        className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm md:text-base"
                    >
                        <Home className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Back to Learning Dashboard
                    </button>
                </div>
            </div>
        </div>
    );

}

export default PageNotFound;
