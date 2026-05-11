import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Screens
import LandingPage from './screens/LandingPage';
import HowToUsePage from './screens/HowToUsePage';
import LibraryPage from './screens/LibraryPage';
import LoginPage from './screens/LoginPage';
import OTPScreen from './screens/OTPScreen';
import PrivacyPolicy from './screens/PrivacyPolicy';
import TermsOfService from './screens/TermsOfService';

// Member Screens
import UserHome from './screens/app/HomeScreen';
import UserExplore from './screens/app/ContentScreen';
import UserBooks from './screens/app/BookLibraryScreen';
import BookDetailScreen from './screens/app/BookDetailScreen';
import BookReader from './screens/app/BookScreen';
import UserProfile from './screens/app/ProfileScreen';
import LearningScreen from './screens/app/LearningScreen';
import AISakhiScreen from './screens/app/AISakhiScreen';
import SessionBookingScreen from './screens/app/SessionBookingScreen';
import MeditationScreen from './screens/app/MeditationScreen';
import WealthScreen from './screens/app/WealthScreen';
import TodoScreen from './screens/app/TodoScreen';
import FinanceScreen from './screens/app/FinanceScreen';
import AffirmationScreen from './screens/app/AffirmationScreen';
import MentalHealthScreen from './screens/app/MentalHealthScreen';
import RelationshipScreen from './screens/app/RelationshipScreen';
import GroomingScreen from './screens/app/GroomingScreen';
import SpiritualScreen from './screens/app/SpiritualScreen';
import MoodScreen from './screens/app/MoodScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import PeriodTrackerScreen from './screens/app/PeriodTrackerScreen';
import CommunityScreen from './screens/app/CommunityScreen';
import RewardsScreen from './screens/app/RewardsScreen';
import SubscriptionPlansScreen from './screens/app/SubscriptionPlansScreen';
import ReceiptsScreen from './screens/app/ReceiptsScreen';

// Academy Screens
import AcademyHome from './screens/academy/AcademyHome';
import CourseDetails from './screens/academy/CourseDetails';
import MyCourses from './screens/academy/MyCourses';
import Certification from './screens/academy/Certification';
import QuizPage from './screens/academy/QuizPage';

// Advisor Screens
import AdvisorDash from './screens/advisor/AdvisorDashboard';
import AdvisorApts from './screens/advisor/AdvisorAppointments';
import UserProfilesScreen from './screens/advisor/UserProfilesScreen';
import SlotManagementScreen from './screens/advisor/SlotManagementScreen';
import AdvisorEarningsScreen from './screens/advisor/AdvisorEarningsScreen';
import AdvisorChat from './screens/advisor/AdvisorChat';

// Admin Screens
import AdminDash from './screens/admin/AdminDashboard';
import UserMgmt from './screens/admin/UserManagement';
import ContentCMS from './screens/admin/ContentCMS';
import BookCMS from './screens/admin/BookCMS';
import AddBookCMS from './screens/admin/AddBookCMS';
import AdvisorCMS from './screens/admin/AdvisorCMS';
import GlobalAppointments from './screens/admin/GlobalAppointments';
import PaymentMgmt from './screens/admin/PaymentManagement';
import PlanMgmt from './screens/admin/PlanManagement';
import SystemAnalytics from './screens/admin/SystemAnalytics';
import CampaignCenter from './screens/admin/CampaignCenter';
import SakhiCMS from './screens/admin/SakhiCMS';
import AdvisorConsultations from './screens/advisor/AdvisorConsultations';

// Partner (Affiliate) Screens
import AffiliateDash from './screens/affiliate/AffiliateDashboard';
import LinkGenerator from './screens/affiliate/LinkGenerator';
import PartnerEarnings from './screens/affiliate/PartnerEarnings';
import MarketingAssets from './screens/affiliate/MarketingAssets';

const App = () => {
  return (
    <Routes>
      {/* ── Public ── */}
      <Route element={<LandingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/how-to-use" element={<HowToUsePage />} />
        <Route path="/library" element={<LibraryPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/otp" element={<OTPScreen />} />
      <Route path="/welcome" element={<OnboardingScreen />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />

      {/* ── 👤 Member Dashboard ── */}
      <Route path="/app" element={<DashboardLayout role="member" />}>
        <Route index element={<UserHome />} />
        <Route path="explore" element={<UserExplore />} />
        <Route path="learning" element={<LearningScreen />} />
        <Route path="books" element={<UserBooks />} />
        <Route path="books/:id" element={<BookDetailScreen />} />
        <Route path="books/:id/read" element={<BookReader />} />
        <Route path="ai-sakhi" element={<AISakhiScreen />} />
        <Route path="sessions" element={<SessionBookingScreen />} />
        <Route path="meditation" element={<MeditationScreen />} />
        <Route path="wealth" element={<WealthScreen />} />
        <Route path="todo" element={<TodoScreen />} />
        <Route path="finance" element={<FinanceScreen />} />
        <Route path="affirmation" element={<AffirmationScreen />} />
        <Route path="mental-health" element={<MentalHealthScreen />} />
        <Route path="relationship" element={<RelationshipScreen />} />
        <Route path="grooming" element={<GroomingScreen />} />
        <Route path="spiritual" element={<SpiritualScreen />} />
        <Route path="mood/:moodType" element={<MoodScreen />} />
        <Route path="profile" element={<UserProfile />} />
        <Route path="period" element={<PeriodTrackerScreen />} />
        <Route path="community" element={<CommunityScreen />} />
        <Route path="rewards" element={<RewardsScreen />} />
        <Route path="plans" element={<SubscriptionPlansScreen />} />
        <Route path="receipts" element={<ReceiptsScreen />} />
      </Route>

      {/* ── 🎓 Academy Module ── */}
      <Route path="/academy" element={<DashboardLayout role="member" />}>
        <Route index element={<AcademyHome />} />
        <Route path="course/:id" element={<CourseDetails />} />
        <Route path="my-courses" element={<MyCourses />} />
        <Route path="certificate/:id" element={<Certification />} />
        <Route path="quiz/:id" element={<QuizPage />} />
      </Route>

      {/* ── 🧑‍⚕️ Advisor Dashboard ── */}
      <Route path="/advisor" element={<DashboardLayout role="advisor" />}>
        <Route index element={<AdvisorDash />} />
        <Route path="appointments" element={<AdvisorApts />} />
        <Route path="users" element={<UserProfilesScreen />} />
        <Route path="availability" element={<SlotManagementScreen />} />
        <Route path="consultations" element={<AdvisorConsultations />} />
        <Route path="earnings" element={<AdvisorEarningsScreen />} />
        <Route path="chat" element={<AdvisorChat />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* ── 🛠️ Admin Panel ── */}
      <Route path="/admin" element={<DashboardLayout role="admin" />}>
        <Route index element={<AdminDash />} />
        <Route path="users" element={<UserMgmt />} />
        <Route path="content" element={<ContentCMS />} />
        <Route path="books" element={<BookCMS />} />
        <Route path="books/add" element={<AddBookCMS />} />
        <Route path="advisors" element={<AdvisorCMS />} />
        <Route path="appointments" element={<GlobalAppointments />} />
        <Route path="plans" element={<PlanMgmt />} />
        <Route path="payments" element={<PaymentMgmt />} />
        <Route path="analytics" element={<SystemAnalytics />} />
        <Route path="sakhi-cms" element={<SakhiCMS />} />
        <Route path="notifications" element={<CampaignCenter />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* ── 💰 Partner Dashboard ── */}
      <Route path="/affiliate" element={<DashboardLayout role="partner" />}>
        <Route index element={<AffiliateDash />} />
        <Route path="links" element={<LinkGenerator />} />
        <Route path="earnings" element={<PartnerEarnings />} />
        <Route path="assets" element={<MarketingAssets />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
