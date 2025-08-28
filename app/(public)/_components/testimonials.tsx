import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React from "react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mbenya. Z",
    role: "Long-time Client",
    content:
      "I've worked with TK for years, from my student leadership days at Fort Hare to personal family events and professional collaborations. His quality, patience, and professionalism are unmatched. Highly recommended!",
    rating: 5,
  },
  {
    id: 2,
    name: "Lihle Nkosi",
    role: "Event Coordinator, InnovateX",
    content:
      "TK Photography was a pleasure to work with for our annual tech conference. Their team was professional, creative, and captured the energy of the event perfectly. The photos were delivered ahead of schedule and exceeded our expectations. We highly recommend them for any corporate event.",
    rating: 5,
  },

  {
    id: 3,
    name: "Bulumnko",
    role: "Event Client",
    content:
      "Great photographer, on time and understanding of event/venue problems while on site. Often, price is achievable through consultation with the company but most importantly, quality of the pictures is outstanding and provides on site/same time delivery at times.",
    rating: 5,
  },
];

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${
            i < rating ? "text-yellow-400 fill-current" : "text-stone-300"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-light text-stone-800 mb-4">
            What Clients Say
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Hear from those who have trusted me to capture their most precious
            moments
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="group border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-stone-50 hover:bg-white"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <Avatar className="w-12 h-12 mr-4">
                    <AvatarImage
                      src={testimonial.avatar}
                      alt={testimonial.name}
                    />
                    <AvatarFallback className="bg-stone-200 text-stone-700 font-medium">
                      {testimonial.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-stone-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-stone-600">{testimonial.role}</p>
                  </div>
                </div>

                <StarRating rating={testimonial.rating} />

                <blockquote className="mt-4 text-stone-700 leading-relaxed">
                  "{testimonial.content}"
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-stone-600 mb-4">
            Ready to create your own memorable experience?
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-6 py-3 text-stone-700 hover:text-stone-900 font-medium transition-colors duration-200"
          >
            Get in touch
            <svg
              className="w-4 h-4 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
