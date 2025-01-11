import React, { useState, useRef } from 'react';
import { Upload, Download, BookOpen } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { academicServices } from '@/services';
import { toastDesign } from '@/components/GlobalVariables';

const SubjectManager = () => {
    const [activeTab, setActiveTab] = useState('add');
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setFileName(file.name);
            await toast.promise(
                academicServices.ImportSubjectData(file),
                {
                    loading: "Data Uploading",
                    success: (response) => {
                        setFileName("*Upload file in excel format");
                        event.target.value = "";
                        return `${response.data.message}`;
                    },
                    error: (error) => {
                        setFileName("*Upload file in excel format");
                        if (event.target) event.target.value = '';
                        return `${error.response.data.message}`;
                    }
                },
                toastDesign
            )
        }
    };

    const handleDownloadSample = async () => {
        try {
            const response = await fetch('https://res.cloudinary.com/dij4vwbs6/raw/upload/v1735887701/Subject_Data_Sheet_o4xkgn.xlsx');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Subject Data Sheet.xlsx';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success("File Download Successfully", toastDesign);
        } catch (error) {
            toast.error(`Error: ${error}`);
        }
    };

    return (
        <div className="p-6 max-w-4xl mx-auto ">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <BookOpen className="h-6 w-6" />
                        <div>
                            <CardTitle>Subject Management</CardTitle>
                            <CardDescription>
                                Add or update subjects using Excel format sheets
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className='p-6'>
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="add">Add Subject</TabsTrigger>
                            <TabsTrigger value="update">Update Subject</TabsTrigger>
                        </TabsList>

                        <TabsContent value="add">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-4">Upload Subject Data</h3>
                                        {fileName && (
                                            <Alert className="mb-4">
                                                <AlertDescription>
                                                    Selected file: {fileName}
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            accept=".xlsx,.xls"
                                            className="hidden"
                                        />
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="w-full max-w-xs"
                                        >
                                            <Upload className="mr-2 h-4 w-4" />
                                            Upload File
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="text-center">
                                        <h3 className="font-semibold mb-4">Download Template</h3>
                                        <Button
                                            onClick={handleDownloadSample}
                                            variant="outline"
                                            className="w-full max-w-xs"
                                        >
                                            <Download className="mr-2 h-4 w-4" />
                                            Download Sample Excel
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="update">
                            <div className="text-center py-12">
                                <h3 className="text-xl font-semibold text-muted-foreground">
                                    Coming Soon
                                </h3>
                                <p className="text-sm text-muted-foreground mt-2">
                                    This feature is under development
                                </p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
};

export default SubjectManager;