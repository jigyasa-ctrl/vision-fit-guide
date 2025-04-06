
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserSetupForm from '../components/UserSetupForm';
import Layout from '../components/Layout';

const ProfileSetup = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user already has a complete profile, redirect to dashboard
    if (currentUser?.profile?.dailyCalories) {
      navigate('/dashboard');
    }
  }, [currentUser, navigate]);
  
  return (
    <Layout>
      <div className="container py-8">
        <div className="max-w-2xl mx-auto">
          <UserSetupForm />
        </div>
      </div>
    </Layout>
  );
};

export default ProfileSetup;
