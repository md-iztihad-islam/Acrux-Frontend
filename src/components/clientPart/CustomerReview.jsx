import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const reviews = [
  {
    id: 1,
    name: "Rahim Ahmed",
    rating: 5,
    text: "শীতের সময়ে আমার গোড়ালি ফাটার সমস্যা ছিল। এই ক্রিমটি ব্যবহার করেছি মাত্র ৩ দিন, ফলাফল চমৎকার!",
    location: "Dhaka",
    product: "ELAIMEI ফুট ক্রিম"
  },
  {
    id: 2,
    name: "Sultana Begum",
    rating: 5,
    text: "বছরের পর বছর ফাটা গোড়ালির সমস্যা ছিল। এই স্টিকটি ব্যবহার করা খুব সহজ এবং কার্যকর।",
    location: "Chittagong",
    product: "হিল রিপেয়ার স্টিক"
  },
  {
    id: 3,
    name: "Kamal Hossain",
    rating: 5,
    text: "৬০% ইউরিয়া ক্রিমটি আমার শুষ্ক ত্বকের জন্য দারুণ কাজ করে। পায়ের ত্বক এখন অনেক নরম।",
    location: "Sylhet",
    product: "৬০% ইউরিয়া ক্রিম"
  },
  {
    id: 4,
    name: "Nazma Akter",
    rating: 5,
    text: "পার্সে নিয়ে যাওয়া খুব সহজ। অফিসেও ব্যবহার করতে পারি যখনই পায়ের ত্বক শুষ্ক লাগে।",
    location: "Rajshahi",
    product: "পোর্টেবল ফুট স্টিক"
  },
  {
    id: 5,
    name: "Jamilur Rahman",
    rating: 5,
    text: "প্রাকৃতিক উপাদানে তৈরি হওয়ায় ত্বকে কোন জ্বালাপোড়া করে না। আলোভেরা ও নারকেল তেলের উপকারিতা পাচ্ছি।",
    location: "Khulna",
    product: "প্রাকৃতিক ফুট কেয়ার"
  },
  {
    id: 6,
    name: "Farhana Yasmin",
    rating: 5,
    text: "ডায়াবেটিস আছে, পায়ের যত্ন খুব জরুরি। এই প্রডাক্টটি আমার জন্য নিরাপদ ও কার্যকর প্রমাণিত হয়েছে।",
    location: "Comilla",
    product: "ELAIMEI হিল ক্রিম"
  },
];

const CustomerReviews = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section className="py-16 px-4 bg-card/30">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-4xl font-serif text-center text-gradient-gold mb-12">
          আমাদের গ্রাহকদের মন্তব্য
        </h2>

        {/* Mobile: Single card with navigation */}
        <div className="md:hidden relative">
          <div className="glass-card rounded-xl p-6 mx-4">
            <div className="mb-2">
              <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                {reviews[currentIndex].product}
              </span>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(reviews[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-foreground mb-4 text-sm leading-relaxed">
              "{reviews[currentIndex].text}"
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-gold">{reviews[currentIndex].name}</p>
                <p className="text-xs text-muted-foreground">{reviews[currentIndex].location}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={prev} className="h-8 w-8">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={next} className="h-8 w-8">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-4">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === currentIndex ? "bg-gold w-6" : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Desktop: Grid layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="glass-card rounded-xl p-6 hover:shadow-gold transition-all duration-500"
            >
              <div className="mb-2">
                <span className="text-xs bg-gold/10 text-gold px-2 py-1 rounded-full">
                  {review.product}
                </span>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-foreground mb-4 text-sm leading-relaxed">
                "{review.text}"
              </p>
              <div>
                <p className="font-semibold text-gold">{review.name}</p>
                <p className="text-xs text-muted-foreground">{review.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;