import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  User,
  Clock,
  Users,
  Car,
  FileText,
  Phone,
  Mail,
  Globe,
  MapPinned,
  Star,
  Check,
  X,
} from "lucide-react";
import { COMPANY_INFO } from "@/lib/constants";
import type { Itinerary } from "@/types/itinerary";

interface ItineraryPreviewProps {
  itinerary: Itinerary;
}

export const ItineraryPreview = ({ itinerary }: ItineraryPreviewProps) => {
  return (
    <div className="bg-navyBrand text-white rounded-lg overflow-hidden shadow-2xl [&_section]:bg-transparent">

      {/* Cover Section */}
      <section className="relative py-20 px-8 text-center bg-navyBrand">
        <div className="relative">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="Company Logo"
              className="w-80 h-40 object-contain"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold mb-9 text-primary">
            Greetings from Adventure Holidays
          </h1>

          {/* Sub text */}
          <p className="text-lg text-white ">
            it is our heartfelt pleasure to present this quotation to
          </p>

          {/* Client Name */}
          <div className="inline-block px-10 py-1">
            <p
              className="client-name text-4xl font-extrabold text-white "
              style={{
                fontFamily: "Montserrat",
                fontVariant: "small-caps",
              }}
            >
              {itinerary.clientName}
            </p>

          </div>


          {/* Closing paragraph */}
          <p className="max-w-3xl mx-auto text-white text-lg leading-relaxed">
            we would be truly honoured to craft a journey filled with comfort, care
            and unforgettable moments, tailored especially for you.
          </p>
        </div>
      </section>


      {/* Journey Overview */}
      <section className="py-12 px-8 bg-ah-navy-light">
        <h2 className="text-2xl font-bold text-center mb-10 text-primary">
          JOURNEY OVERVIEW
        </h2>

        <div className="space-y-8">

          {/* Consultant */}
          {/* Consultant */}
          <div className="relative border border-primary rounded-lg p-6">
            <span className="absolute -top-3 left-4 bg-navyBrand px-2 text-sm font-semibold text-primary">
              CONSULTANT
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="flex items-start gap-3">
                <User className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-gray-400">Name</p>
                  <p className="font-semibold">{itinerary.consultantName || "Consultant details not added"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-gray-400">Phone</p>
                  <p className="font-semibold">{itinerary.consultantNumber || "Not provided"}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="relative border border-primary rounded-lg p-6">
            <span className="absolute -top-3 left-4 bg-navyBrand px-2 text-sm font-semibold text-primary">
              TRIP DETAILS
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Destination - Full Width */}
              <div className="md:col-span-2 flex items-start p-3 gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-gray-400">Destination</p>
                  <p className="font-semibold">{itinerary.destination}</p>
                </div>
              </div>

              <div className="flex items-start p-3 gap-3">
                <Clock className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-gray-400">Duration</p>
                  <p className="font-semibold">{itinerary.duration}</p>
                </div>
              </div>

              <div className="flex items-start p-3 gap-3">
                <Calendar className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-gray-400">Date of Travel</p>
                  <p className="font-semibold">
                    {format(itinerary.travelDate, "dd MMM yyyy")}
                  </p>
                </div>
              </div>

              <div className="flex items-start p-3 gap-3">
                <Users className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-gray-400">Group Size</p>
                  <p className="font-semibold">{itinerary.groupSize}</p>
                </div>
              </div>

              <div className="flex items-start p-3 gap-3">
                <Car className="w-4 h-4 text-primary mt-1" />
                <div>
                  <p className="text-xs text-gray-400">Transport</p>
                  <p className="font-semibold">
                    {itinerary.transportDetails}
                  </p>
                </div>
              </div>

            </div>
          </div>



          {/* Costing */}
          <div className="relative border border-primary rounded-lg p-6">
            <span className="absolute -top-3 left-4 bg-navyBrand px-2 text-sm font-semibold text-primary">
              COSTING
            </span>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {itinerary.pricingSlots.map((slot) => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center border border-primary/40 rounded-md p-3"
                >
                  <div>
                    <p className="font-medium">{slot.label}</p>
                    <p className="text-xs text-primary">
                      <span className="font-bold text-3xl "> ₹{slot.price.toLocaleString("en-IN")} </span> / {slot.unit}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>

        </div>
      </section>


      {/* The Experience */}
      <section className="py-12 px-8 bg-ah-navy-light">
        <h2 className="text-2xl font-bold text-center mb-8 text-primary">
          THE EXPERIENCE
        </h2>
        <div className="space-y-6">
          {itinerary.dayPlans.map((day) => (
            <div key={day.id} className="bg-navyBrand rounded-lg p-6 border-2 border-[#00097e] ">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                  {String(day.dayNumber).padStart(2, "0")}
                </div>
                <div>
                  <h3 className="text-lg font-bold uppercase">{day.title}</h3>
                  {day.date && (
                    <p className="text-sm text-gray-400">
                      {format(day.date, "dd MMM yyyy")}
                    </p>
                  )}
                </div>
              </div>
              <ul className="space-y-2 ml-16">
                {day.activities.map((activity, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-primary mt-1">→</span>
                    <span>{activity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Inclusions, Exclusions & Notes */}
      <section className="py-12 px-8 grid md:grid-cols-2 gap-8">

        {/* Notes */}
        {itinerary.notes && (
          <div className="md:col-span-2 bg-navyBrand/50  rounded-lg mb-5">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-2 uppercase">
              NOTES :
              {/* <FileText className="w-5 h-5 text-primary" /> */}
            </h3>
            <ul className="space-y-2 ml-8">
              {itinerary.notes.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  🗒️
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Inclusions */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            INCLUSIONS :
          </h3>
          <ul className="ml-8 space-y-2">
            {itinerary.inclusions.map((item, idx) => (
              <li key={idx} className="flex">
                <Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                <p className="ml-2 break-words w-full">{item}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Exclusions */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            EXCLUSIONS :
          </h3>
          <ul className="ml-8 space-y-2">
            {itinerary.exclusions.map((item, idx) => (
              <li key={idx} className="flex">
                <X className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                <p className="ml-2 break-words w-full">{item}</p>
              </li>
            ))}
          </ul>
        </div>



      </section>




      {/* Consultant Details */}
      {/* <section className="py-12 px-8 bg-ah-navy-light text-center">
        <div className="inline-block">
          <div className="w-20 h-20 rounded-full bg-gray-600 mx-auto mb-4 flex items-center justify-center">
            <Users className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-bold">{itinerary.consultantName}</h3>
          <p className="text-gray-400 mb-4">Your Travel Consultant</p>
          <div className="flex items-center justify-center gap-2">
            <Phone className="w-4 h-4 text-primary" />
            <span>{itinerary.consultantNumber}</span>
          </div>
        </div>
      </section> */}

      {/* Terms & Cancellation */}
      <section className="py-12 px-8 flex flex-col gap-16">
        <div>
          <h3 className="text-2xl font-bold mb-6 ">TERMS & CONDITIONS</h3>
          <div className="text-sm text-gray-300 ml-8">
            {itinerary.termsConditions.split("\n").map((line, idx) => (
              <p
                key={idx}
                className="mb-8 pl-4 border-l-4 border-gray-400" // increased from mb-4 to mb-6
              >
                {line}
              </p>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-6">CANCELLATION POLICY</h3>
          <div className="text-sm text-gray-300 ml-8" >
            {itinerary.cancellationPolicy.split("\n").map((line, idx) => (
              <p
                key={idx}
                className="mb-8 pl-4 border-l-4 border-gray-400" // increased from mb-4 to mb-6
              >
                {line}
              </p>
            ))}
          </div>
        </div>
      </section>




      {/* Social Proof - Google Rating with side-by-side number and text */}
      <section className="py-12 px-8 bg-ah-navy-light text-center">
        <div className="inline-block">
          {/* Stars centered above */}
          <div className="flex justify-center gap-2 mb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-8 h-8 fill-primary text-primary" />
            ))}
          </div>

          {/* Number and Google Rating text side by side */}
          <div className="flex justify-center items-center gap-4 mb-6">
            {/* Rating number */}
            <p className="text-9xl font-extrabold text-primary leading-none">
              {COMPANY_INFO.googleRating}
            </p>

            {/* GOOGLE / RATING stacked */}
            <div className="flex flex-col justify-center text-gold font-extrabold text-5xl text-primary leading-none">
              <span>GOOGLE</span>
              <span>RATING</span>
            </div>
          </div>

          <p className="text-white font-semibold text-lg max-w-md mx-auto leading-tight">
            Loved by 500+ travelers
            <span className="block">
              who trusted us with their journeys
            </span>
          </p>

        </div>
      </section>



      {/* About Us */}
      <section className="py-12 px-8">
        {/* Heading & paragraph aligned to left, full container width */}
        <h2 className="text-2xl font-bold mb-4 text-primary text-left">
          ABOUT US
        </h2>
        <p className="text-gray-300 text-left mb-8">
          {COMPANY_INFO.name} is a travel agency offering domestic and international tour packages, designed to plan, manage and deliver complex travel experiences at scale with institutional - grade precision
        </p>

        {/* Full width image */}
        <div className="w-full mb-12">
          <img src="/About.png" alt="About us" className="w-full h-auto object-cover" />
        </div>

        {/* Info blocks below image, width same as image */}
        <div className="w-full max-w-full flex flex-col md:flex-row gap-8">
          <div className="flex-1 border-l border-gray-600 pl-8">
            <p className="text-7xl font-bold text-primary font-bebas">{COMPANY_INFO.happyTravelers}</p>
            <p className="text-lg text-white ">Travelers holding memories crafted by us</p>
          </div>
          <div className="flex-1 border-l border-gray-600 pl-8">
            <p className="text-7xl font-bold text-primary font-bebas">{COMPANY_INFO.destinations}</p>
            <p className="text-lg text-white mb-6">Journeys executed with institutional - grade precision</p>
          </div>
        </div>
      </section>



      {/* /* {/* CTA 
      <section className="py-12 px-8 bg-ah-navy-light text-center">
        <p className="text-2xl font-light mb-2">
          need a <span className="font-bold text-primary">PERSONALISED</span> TOUR PACKAGE?
        </p>
        <p className="text-gray-400 mb-4">↓</p>
        <p className="text-xl">
          we are <span className="text-primary font-bold">HERE</span> to hear your vibe
        </p>
      </section> */}

      {/* Footer */}
      <footer className="py-8 px-8 bg-navyBrand">
        <div className="max-w-6xl mx-auto text-center mb-8">
          <h2 className="text-3xl font-bold text-white">
            Ways to <span className="text-primary">Reach us</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto mt-2">
            Have a question, a plan, or just an idea? Reach out to us anytime — we're here to listen, guide, and make things happen together.
          </p>
        </div>

        <div className="max-w-6xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Phone Card */}
          <div className="flex items-center gap-4 border border-primary rounded-lg p-4">
            <Phone className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p className="font-semibold text-white">{COMPANY_INFO.phone}</p>
            </div>
          </div>

          {/* Email Card */}
          <div className="flex items-center gap-4 border border-primary rounded-lg p-4">
            <Mail className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              <p className="font-semibold text-white">{COMPANY_INFO.email}</p>
            </div>
          </div>

          {/* Office Address Card */}
          <div className="flex items-center gap-4 border border-primary rounded-lg p-4">
            <MapPinned className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-gray-400">Office</p>
              <p className="font-semibold text-white max-w-xs">
                {COMPANY_INFO.address}
              </p>
            </div>
          </div>

          {/* Website Card */}
          <div className="flex items-center gap-4 border border-primary rounded-lg p-4">
            <Globe className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-gray-400">Website</p>
              <p className="font-semibold text-white">{COMPANY_INFO.website}</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <p className="mt-8 text-center text-gray-400 text-sm">
          © Adventure Holidays. All rights reserved.
        </p>
      </footer>


    </div>
  );
};
