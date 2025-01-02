import { BookOpen, GraduationCap, School } from "lucide-react"

const ComingSoon = () => {
    return (
        <div className=" font-poppins flex flex-col items-center justify-center bg-white p-4">
            <div className="text-center max-w-2xl mx-auto">
                <div className="flex justify-center space-x-4 md:space-x-8 mb-4 md:mb-8">
                    <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-orange-500 animate-bounce" />
                    <School className="w-8 h-8 md:w-12 md:h-12 text-blue-900 animate-bounce delay-100" />
                    <GraduationCap className="w-8 h-8 md:w-12 md:h-12 text-orange-500 animate-bounce delay-200" />
                </div>

                <h1 className="text-blue-900 font-bold text-4xl md:text-5xl mb-2 md:mb-4">
                    Coming Soon
                </h1>

                <h2 className="text-xl md:text-xl font-semibold text-blue-900 mb-4 md:mb-8 px-4">
                    We're working hard to bring you something amazing!
                </h2>
            </div>
        </div>

    )
}

export default ComingSoon