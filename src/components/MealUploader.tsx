
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMealHistory } from '../contexts/MealHistoryContext';
import { analyzeMeal } from '../lib/ai';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Utensils, ImagePlus, Loader2 } from 'lucide-react';
import MealCard from './MealCard';

const MealUploader: React.FC = () => {
  const { currentUser } = useAuth();
  const { addMeal } = useMealHistory();
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  
  const handleMealTypeChange = (value: string) => {
    setSelectedMealType(value as 'breakfast' | 'lunch' | 'dinner' | 'snack');
  };
  
  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };
  
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };
  
  const handleFileSelection = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      toast.error('Please upload an image file');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Maximum size is 5MB.');
      return;
    }
    
    setSelectedFile(file);
    setImagePreview(URL.createObjectURL(file));
    setAnalysisResult(null); // Reset any previous analysis
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleAnalyzeMeal = async () => {
    if (!selectedFile) {
      toast.error('Please upload an image of your meal first');
      return;
    }
    
    if (!currentUser?.profile) {
      toast.error('Please complete your profile setup first');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await analyzeMeal(currentUser.profile, selectedMealType, selectedFile);
      setAnalysisResult(result);
      addMeal(result);
      toast.success('Meal analyzed successfully!');
    } catch (error) {
      console.error('Error analyzing meal:', error);
      toast.error('Failed to analyze meal');
    } finally {
      setIsLoading(false);
    }
  };
  
  const resetUploader = () => {
    setSelectedFile(null);
    setImagePreview(null);
    setAnalysisResult(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
  };
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold">Upload Meal</h2>
            <p className="text-muted-foreground">
              Take a photo of your meal for instant nutritional analysis
            </p>
          </div>
          
          <div className="w-full md:w-auto">
            <Select 
              value={selectedMealType} 
              onValueChange={handleMealTypeChange}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select meal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">
                  <div className="flex items-center gap-2">
                    <span>🍳</span> Breakfast
                  </div>
                </SelectItem>
                <SelectItem value="lunch">
                  <div className="flex items-center gap-2">
                    <span>🥗</span> Lunch
                  </div>
                </SelectItem>
                <SelectItem value="dinner">
                  <div className="flex items-center gap-2">
                    <span>🍽️</span> Dinner
                  </div>
                </SelectItem>
                <SelectItem value="snack">
                  <div className="flex items-center gap-2">
                    <span>🍌</span> Snack
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {!analysisResult ? (
          <Card>
            <CardContent className="pt-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center h-64 transition-colors ${
                  isDragging ? 'border-primary bg-muted/50' : 'border-muted-foreground/25'
                } cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleFileDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Meal preview"
                      className="w-full h-full object-contain rounded-md"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute bottom-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetUploader();
                      }}
                    >
                      Change Image
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 bg-muted rounded-full p-3">
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="mb-1 font-medium">Drag photo here or click to upload</p>
                    <p className="text-sm text-muted-foreground">
                      Supports: JPG, PNG, WEBP (max 5MB)
                    </p>
                  </>
                )}
                <input
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>
              
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnalyzeMeal();
                  }}
                  disabled={!selectedFile || isLoading}
                  className="w-full flex items-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Analyzing Meal...
                    </>
                  ) : (
                    <>
                      <Utensils className="h-4 w-4" />
                      Analyze Meal
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <MealCard meal={analysisResult} />
            
            <div className="flex justify-end gap-4">
              <Button 
                variant="outline" 
                onClick={resetUploader}
              >
                Upload Another Meal
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealUploader;
