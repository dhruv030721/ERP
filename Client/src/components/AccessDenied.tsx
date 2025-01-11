import { AlertTriangle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const AccessDenied = () => {
    return (
        <div className="flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full p-6 max-w-md space-y-5">
                <CardContent className="pt-6 font-semibold">
                    <Alert variant="destructive" className="mb-6">
                        <AlertTriangle className="h-5 w-5" />
                        <AlertTitle className="ml-2 font-semibold">Access Denied</AlertTitle>
                        <AlertDescription>
                            You don't have permission to access this module.
                        </AlertDescription>
                    </Alert>

                    <div className="text-center space-y-4">
                        <div className="p-3 bg-red-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
                            <AlertTriangle className="h-8 w-8 text-red-600" />
                        </div>

                        <h2 className="text-2xl font-semibold tracking-tight">
                            Permission Required
                        </h2>

                        <p className="text-gray-500">
                            Please contact your administrator if you believe this is a mistake.
                        </p>
                    </div>
                </CardContent>

                <CardFooter className="flex justify-center gap-4">
                    <Button variant="outline">
                        <Link to='/academics/dashboard'>Go Back</Link>
                    </Button>
                    <Button>
                        Contact Support
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default AccessDenied;