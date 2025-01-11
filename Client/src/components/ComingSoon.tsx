import { BookOpen, GraduationCap, School, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ComingSoon = () => {
    return (
        <div className="min-h-screen font-DmSans flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
            <Card className="w-full max-w-2xl bg-white/50 ">
                <CardContent className=" p-6 pt-6">
                    <div className="text-center space-y-6">
                        {/* Animated Icons */}
                        <div className="flex justify-center space-x-8">
                            <BookOpen className="w-12 h-12 text-blue-600 animate-bounce" />
                            <School className="w-12 h-12 text-blue-900 animate-bounce delay-150" />
                            <GraduationCap className="w-12 h-12 text-blue-600 animate-bounce delay-300" />
                        </div>

                        {/* Main Content */}
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-6xl font-bold text-blue-900 tracking-tight">
                                Coming Soon
                            </h1>
                            <p className="text-xl text-blue-800/80 max-w-md mx-auto">
                                We're working hard to bring you something amazing!
                            </p>
                        </div>

                        {/* Loading Animation */}
                        <div className="flex items-center justify-center space-x-2">
                            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                            <span className="text-sm text-blue-600">In Progress...</span>
                        </div>

                        {/* Action Button */}
                        <div className="pt-4">
                            <Button
                                variant="outline"
                                className="bg-white hover:bg-blue-50"
                            >
                                <Link to="/academics/dashboard">Go Back</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default ComingSoon;