// components/BusinessDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useBusinesses } from "../hooks/useBusinesses";
import { useBookmarks } from "../hooks/useBookmarks";
import { useTheme } from "../hooks/useTheme";
import { useReviews } from "../hooks/useReviews";
import { BusinessDetail } from "./BusinessDetail";

export const BusinessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isDarkMode } = useTheme();
  const { businesses } = useBusinesses();
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const business = businesses.find((b) => b.id === id);

  // Fetch reviews for this business
  const { reviews, isLoading: reviewsLoading } = useReviews(business?.uen);

  if (!business) {
    return (
      <div
        className="min-h-screen p-4 md:pl-6"
        style={{ backgroundColor: isDarkMode ? "#3a3a3a" : "#f9fafb" }}
      >
        <div className="max-w-7xl mx-auto text-center py-12">
          <h2
            className="text-2xl mb-4"
            style={{ color: isDarkMode ? "#ffffff" : "#000000" }}
          >
            Business not found
          </h2>
          <button
            onClick={() => navigate("/businesses")}
            className="text-primary hover:underline"
          >
            ← Back to businesses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen p-4 md:pl-6"
      style={{ backgroundColor: isDarkMode ? "#3a3a3a" : "#f9fafb" }}
    >
      <BusinessDetail
        business={business}
        reviews={reviews}
        isBookmarked={isBookmarked(business.id)}
        onBookmarkToggle={toggleBookmark}
        onBack={() => navigate("/businesses")}
        onWriteReview={(business) => {
          navigate(`/review/${business.uen}`);
        }}
      />
    </div>
  );
};