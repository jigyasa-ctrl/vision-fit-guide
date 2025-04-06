
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import MealUploader from '../components/MealUploader';

const UploadPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user doesn't have a complete profile, redirect to setup
    if (currentUser && (!currentUser.profile || !currentUser.profile.dailyCalories)) {
      navigate('/profile/setup');
    }
  }, [currentUser, navigate]);
  
  return (
    <Layout>
      <div className="container py-8">
        <MealUploader />
      </div>
    </Layout>
  );
};

export default UploadPage;
