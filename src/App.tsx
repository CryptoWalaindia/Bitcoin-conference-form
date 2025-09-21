import React, { useMemo, useState, useEffect } from "react";
import logoSvg from "../2.png";
import { submitRegistration, type RegistrationData } from "./lib/supabase";

// Single-file React page for a clean, modern registration form with interactive background
// Tailwind CSS is assumed to be available. Default export renders the whole page.

// Success Screen Component
function SuccessScreen() {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Animated Background Elements */}
      <BackgroundElements />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <header className="relative z-10 px-4 pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <img 
            src="/1.jpg" 
            alt="Bitcoin Conference India Header" 
            className="w-full h-auto object-contain filter drop-shadow-lg rounded-2xl"
          />
        </div>
      </header>

      <main className="relative z-10 px-4 pb-24">
        <div className="max-w-6xl mx-auto">
          {/* Mobile: Ticket above, Content below | Desktop: Side by side layout */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
            {/* Ticket Image */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center lg:justify-start">
              <img 
                src="/ticket.png" 
                alt="Bitcoin Conference India Ticket" 
                className="w-64 md:w-auto md:max-w-lg h-auto object-contain filter drop-shadow-lg lg:ml-2 md:ml-4 lg:ml-6 -mt-4 md:-mt-8 lg:-mt-12 xl:-mt-16"
              />
            </div>
            
            {/* Success Content */}
            <div className="flex-1 w-full lg:mt-8 lg:-ml-16 lg:md:-ml-24 lg:lg:-ml-32">
              <div className="text-center lg:text-left px-6 py-8">
                {/* Success Message */}
                <div className="mb-8">
                  <div className="text-xl md:text-2xl lg:text-3xl text-neutral-200 leading-relaxed font-bold">
                    <p className="mb-2">
                      Your registration has been
                    </p>
                    <p className="mb-2">
                      submitted successfully.
                    </p>
                    <p className="mb-2">
                      You now have a <span className="text-orange-400">free General admission ticket</span>
                    </p>
                    <p className="mb-4">
                      to the <span className="text-orange-400">Bitcoin Conference in India</span>.
                    </p>
                    <p className="text-sm md:text-base text-neutral-400 font-normal">
                      📧 A confirmation email with your QR code ticket has been sent to your email address.
                    </p>
                    <p className="text-xs md:text-sm text-neutral-500 font-normal mt-2">
                      Please check your inbox (and spam folder) for your digital ticket with QR code.
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <div className="mb-8">
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    Register Another Person
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Bitcoin Symbols - Positioned safely within viewport */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <div className="absolute top-32 left-16 text-5xl text-orange-500/20 font-bold animate-float">₿</div>
        <div className="absolute top-56 right-16 text-4xl text-yellow-500/20 font-bold animate-bounce" style={{ animationDelay: '1s' }}>₿</div>
        <div className="absolute bottom-40 left-16 text-6xl text-green-500/20 font-bold animate-pulse" style={{ animationDelay: '2s' }}>₿</div>
        <div className="absolute bottom-56 right-16 text-3xl text-blue-500/20 font-bold animate-float" style={{ animationDelay: '3s' }}>₿</div>
      </div>
    </div>
  );
}



export default function BitcoinConferenceIndiaForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    countryCode: "+91", // Default to India
    phone: "",
    email: "",
    age: "",
    gender: "",
    country: "",
    purpose: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Calculate form completion percentage (phone is optional)
  const completionPercentage = useMemo(() => {
    const requiredFields = [form.firstName, form.lastName, form.email, form.age, form.gender, form.country, form.purpose];
    const filledFields = requiredFields.filter((field: string) => field.trim() !== "").length;
    const agreeToTermsCompleted = form.agreeToTerms ? 1 : 0;
    return Math.round(((filledFields + agreeToTermsCompleted) / (requiredFields.length + 1)) * 100);
  }, [form]);

  const countries = useMemo(
    () => [
      "Afghanistan", "Albania", "Algeria", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
      "Bahrain", "Bangladesh", "Belarus", "Belgium", "Bolivia", "Bosnia and Herzegovina", "Brazil", "Bulgaria",
      "Cambodia", "Canada", "Chile", "China", "Colombia", "Croatia", "Czech Republic",
      "Denmark", "Ecuador", "Egypt", "Estonia", "Ethiopia", "Finland", "France", "Georgia", "Germany", "Ghana", "Greece",
      "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
      "Japan", "Jordan", "Kazakhstan", "Kenya", "Kuwait", "Latvia", "Lebanon", "Lithuania", "Luxembourg",
      "Malaysia", "Mexico", "Morocco", "Nepal", "Netherlands", "New Zealand", "Nigeria", "Norway",
      "Pakistan", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia",
      "Saudi Arabia", "Singapore", "Slovakia", "Slovenia", "South Africa", "South Korea", "Spain", "Sri Lanka", "Sweden", "Switzerland",
      "Taiwan", "Thailand", "Turkey", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Venezuela", "Vietnam"
    ],
    []
  );

  const countryCodes = useMemo(
    () => [
      { code: "+91", country: "India", flag: "🇮🇳" },
      { code: "+1", country: "United States", flag: "🇺🇸" },
      { code: "+1", country: "Canada", flag: "🇨🇦" },
      { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
      { code: "+49", country: "Germany", flag: "🇩🇪" },
      { code: "+33", country: "France", flag: "🇫🇷" },
      { code: "+39", country: "Italy", flag: "🇮🇹" },
      { code: "+34", country: "Spain", flag: "🇪🇸" },
      { code: "+31", country: "Netherlands", flag: "🇳🇱" },
      { code: "+41", country: "Switzerland", flag: "🇨🇭" },
      { code: "+43", country: "Austria", flag: "🇦🇹" },
      { code: "+46", country: "Sweden", flag: "🇸🇪" },
      { code: "+47", country: "Norway", flag: "🇳🇴" },
      { code: "+45", country: "Denmark", flag: "🇩🇰" },
      { code: "+358", country: "Finland", flag: "🇫🇮" },
      { code: "+61", country: "Australia", flag: "🇦🇺" },
      { code: "+64", country: "New Zealand", flag: "🇳🇿" },
      { code: "+81", country: "Japan", flag: "🇯🇵" },
      { code: "+82", country: "South Korea", flag: "🇰🇷" },
      { code: "+86", country: "China", flag: "🇨🇳" },
      { code: "+65", country: "Singapore", flag: "🇸🇬" },
      { code: "+60", country: "Malaysia", flag: "🇲🇾" },
      { code: "+66", country: "Thailand", flag: "🇹🇭" },
      { code: "+62", country: "Indonesia", flag: "🇮🇩" },
      { code: "+63", country: "Philippines", flag: "🇵🇭" },
      { code: "+84", country: "Vietnam", flag: "🇻🇳" },
      { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
      { code: "+886", country: "Taiwan", flag: "🇹🇼" },
      { code: "+971", country: "UAE", flag: "🇦🇪" },
      { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
      { code: "+972", country: "Israel", flag: "🇮🇱" },
      { code: "+90", country: "Turkey", flag: "🇹🇷" },
      { code: "+7", country: "Russia", flag: "🇷🇺" },
      { code: "+55", country: "Brazil", flag: "🇧🇷" },
      { code: "+52", country: "Mexico", flag: "🇲🇽" },
      { code: "+54", country: "Argentina", flag: "🇦🇷" },
      { code: "+56", country: "Chile", flag: "🇨🇱" },
      { code: "+57", country: "Colombia", flag: "🇨🇴" },
      { code: "+51", country: "Peru", flag: "🇵🇪" },
      { code: "+27", country: "South Africa", flag: "🇿🇦" },
      { code: "+234", country: "Nigeria", flag: "🇳🇬" },
      { code: "+254", country: "Kenya", flag: "🇰🇪" },
      { code: "+20", country: "Egypt", flag: "🇪🇬" },
    ],
    []
  );

  function updateField(key: string, value: string | boolean) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e: Record<string, string | undefined> = {};

    if (!form.firstName.trim()) e.firstName = "Please enter your first name";
    if (!form.lastName.trim()) e.lastName = "Please enter your last name";

    // Phone is optional, but if provided, validate format (6 to 15 digits for international compatibility)
    if (form.phone.trim() && !/^\d{6,15}$/.test(form.phone.trim())) {
      e.phone = "Enter a valid phone number (6 to 15 digits)";
    }

    // Browser does some email validation, this is a light extra check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      e.email = "Enter a valid email";
    }

    if (!form.age.trim()) {
      e.age = "Please enter your age";
    } else {
      const ageNum = parseInt(form.age.trim());
      if (isNaN(ageNum) || ageNum < 1 || ageNum > 99) {
        e.age = "Please enter a valid age (1-99)";
      }
    }

    if (!form.gender) e.gender = "Please select your gender";

    if (!form.country) e.country = "Please select your country";

    if (!form.purpose.trim()) e.purpose = "Tell us your purpose of visit";

    if (!form.agreeToTerms) e.agreeToTerms = "Please agree to the terms and conditions";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;

    try {
      setSubmitting(true);
      
      // Prepare data for Supabase
      const registrationData: RegistrationData = {
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        email: form.email.trim().toLowerCase(),
        age: parseInt(form.age.trim()),
        gender: form.gender as 'Male' | 'Female' | 'Others',
        state: form.country,
        purpose: form.purpose.trim(),
      };

      // Only include phone if provided (combine country code with phone number)
      if (form.phone.trim()) {
        registrationData.phone = `${form.countryCode} ${form.phone.trim()}`;
      }

      // Submit to Supabase with fallbacks
      const result = await submitRegistration(registrationData);

      setSubmitted(true);
      
      // Handle different submission methods
      if (result.method === 'supabase') {
        setServerMessage("Registration successful! Thank you for registering for Bitcoin Conference India.");
      } else if (result.method === 'formspree') {
        setServerMessage("Registration submitted successfully via email! You'll receive a confirmation shortly. Thank you for registering!");
      } else if (result.method === 'webhook') {
        setServerMessage("Registration submitted successfully! Thank you for registering for Bitcoin Conference India.");
      } else if (result.method === 'google-forms') {
        setServerMessage("Registration submitted successfully! Thank you for registering for Bitcoin Conference India.");
      } else if (result.method === 'local-storage') {
        setServerMessage("Registration saved locally! Your data is secure and will be submitted when connection is restored.");
      } else {
        setServerMessage((result as any).message || "Registration successful! Thank you for registering for Bitcoin Conference India.");
      }
      
      // Clear the form
      setForm({ firstName: "", lastName: "", countryCode: "+91", phone: "", email: "", age: "", gender: "", country: "", purpose: "", agreeToTerms: false });
    } catch (err: any) {
      setServerMessage(err.message || "Could not submit right now. Please try again.");
      console.error("Error submitting form:", err);
    } finally {
      setSubmitting(false);
    }
  }

  // Show success screen if form is submitted
  if (submitted) {
    return <SuccessScreen />;
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950 text-white">
      {/* Animated Background Elements */}
      <BackgroundElements />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <header className="relative z-10 px-4 pt-8 pb-4">
        <div className="max-w-4xl mx-auto">
          <img 
            src="/1.jpg" 
            alt="Bitcoin Conference India Header" 
            className="w-full h-auto object-contain filter drop-shadow-lg rounded-2xl"
          />
        </div>
      </header>

      <main className="relative z-10 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Compelling announcement banner */}
          <div className="mb-6 p-6 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl text-center">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-orange-300 mb-2">Register Now & Get Your</h3>
              <div className="flex items-center justify-center gap-3">
                <div className="text-2xl font-extrabold text-white bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Free General Pass
                </div>
                <div className="text-lg text-orange-200">Worth $50</div>
              </div>
            </div>
            
            {/* Benefits */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="text-green-400 text-lg">🎫</span>
                <span className="font-semibold text-white text-sm sm:text-base">General Admission to Bitcoin India 2026</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-300">
                <span className="text-purple-400 text-lg">🏢</span>
                <span className="font-semibold text-white">2 Days Access to Exhibition Hall</span>
              </div>
            </div>
          </div>
          
          <div className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl hover:shadow-orange-500/10 transition-all duration-500 hover:border-orange-500/20 animate-fade-in overflow-hidden">
            {/* Subtle logo watermark */}
            <div className="logo-container absolute top-4 right-4 w-16 h-16 opacity-5 pointer-events-none">
              <img 
                src={logoSvg} 
                alt="" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="relative p-6 sm:p-10 z-10">
              <div className="animate-slide-up">

                
                {/* Enhanced Progress Bar with motivational text */}
                <div className="mt-4 mb-2">
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
                    <span className="flex items-center gap-1">
                      <span>🎯</span>
                      <span>Your Progress</span>
                    </span>
                    <span className="font-semibold text-orange-400">{completionPercentage}% Complete</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 rounded-full transition-all duration-500 ease-out shadow-lg relative"
                      style={{ width: `${completionPercentage}%` }}
                    >
                      {completionPercentage > 10 && (
                        <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  {completionPercentage < 100 && (
                    <p className="text-xs text-neutral-500 mt-1 text-center">
                      {completionPercentage < 50 ? "You're doing great! Keep going..." : "🎉 Almost there! Just a few more fields..."}
                    </p>
                  )}
                  {completionPercentage === 100 && (
                    <p className="text-xs text-green-400 mt-1 text-center animate-pulse">
                      ✨ Perfect! Ready to submit your registration!
                    </p>
                  )}
                </div>
              </div>

              <form onSubmit={onSubmit} noValidate className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* First Name */}
                <div className="group">
                  <label htmlFor="firstName" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    onFocus={() => setFocusedField("firstName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g., Satoshi"
                    className={twInput(errors.firstName, focusedField === "firstName" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div className="group">
                  <label htmlFor="lastName" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    onFocus={() => setFocusedField("lastName")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g., Nakamoto"
                    className={twInput(errors.lastName, focusedField === "lastName" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
                </div>

                {/* Phone */}
                <div className="group">
                  <label htmlFor="phone" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">
                    Phone number <span className="text-neutral-500 text-xs">(optional)</span>
                  </label>
                  <div className="flex gap-3">
                    {/* Country Code Dropdown - Small Pill */}
                    <select
                      value={form.countryCode}
                      onChange={(e) => updateField("countryCode", e.target.value)}
                      onFocus={() => setFocusedField("countryCode")}
                      onBlur={() => setFocusedField(null)}
                      className={`w-28 min-w-28 flex-shrink-0 text-sm px-4 py-3 rounded-xl border bg-neutral-800/50 backdrop-blur-sm text-neutral-100 placeholder-neutral-400 transition-all duration-300 hover:bg-neutral-700/50 focus:outline-none focus:bg-neutral-700/50 border-neutral-600/50 ${focusedField === "countryCode" ? "ring-2 ring-orange-500/60 border-orange-500/40" : ""}`}
                    >
                      {countryCodes.map((country) => (
                        <option key={`${country.code}-${country.country}`} value={country.code} className="text-neutral-900 bg-white">
                          {country.flag} {country.code}
                        </option>
                      ))}
                    </select>
                    
                    {/* Phone Number Input - Large Pill */}
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="\d{6,15}"
                      maxLength={15}
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value.replace(/[^\d]/g, ""))}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="1234567890"
                      className={twInput(errors.phone, `flex-1 ${focusedField === "phone" ? "ring-2 ring-orange-500/60 border-orange-500/40" : ""}`)}
                    />
                  </div>
                  {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone}</p>}
                </div>

                {/* Email */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="you@example.com"
                    className={twInput(errors.email, focusedField === "email" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                </div>

                {/* Age */}
                <div className="group">
                  <label htmlFor="age" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">Age</label>
                  <input
                    id="age"
                    name="age"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{1,2}"
                    maxLength={2}
                    value={form.age}
                    onChange={(e) => updateField("age", e.target.value.replace(/[^\d]/g, ""))}
                    onFocus={() => setFocusedField("age")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="e.g., 25"
                    className={twInput(errors.age, focusedField === "age" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  />
                  {errors.age && <p className="mt-1 text-sm text-red-400">{errors.age}</p>}
                </div>

                {/* Gender */}
                <div className="group">
                  <label htmlFor="gender" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={form.gender}
                    onChange={(e) => updateField("gender", e.target.value)}
                    onFocus={() => setFocusedField("gender")}
                    onBlur={() => setFocusedField(null)}
                    className={twInput(errors.gender, focusedField === "gender" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  >
                    <option value="" className="text-neutral-900 bg-white">Select</option>
                    <option value="Male" className="text-neutral-900 bg-white">Male</option>
                    <option value="Female" className="text-neutral-900 bg-white">Female</option>
                    <option value="Others" className="text-neutral-900 bg-white">Others</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-400">{errors.gender}</p>}
                </div>

                {/* Country */}
                <div className="group">
                  <label htmlFor="country" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">Country</label>
                  <select
                    id="country"
                    name="country"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    onFocus={() => setFocusedField("country")}
                    onBlur={() => setFocusedField(null)}
                    className={twInput(errors.country, focusedField === "country" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  >
                    <option value="" className="text-neutral-900 bg-white">Select your country</option>
                    {countries.map((country) => (
                      <option key={country} value={country} className="text-neutral-900 bg-white">{country}</option>
                    ))}
                  </select>
                  {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country}</p>}
                </div>

                {/* Purpose of visit */}
                <div className="sm:col-span-2 group">
                  <label htmlFor="purpose" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">Purpose of visit</label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    rows={4}
                    value={form.purpose}
                    onChange={(e) => updateField("purpose", e.target.value)}
                    onFocus={() => setFocusedField("purpose")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Attendee, speaker, sponsor, volunteer, media, or other"
                    className={twInput(errors.purpose, `min-h-[120px] ${focusedField === "purpose" ? "ring-2 ring-orange-500/60 border-orange-500/40" : ""}`)}
                  />
                  {errors.purpose && <p className="mt-1 text-sm text-red-400">{errors.purpose}</p>}
                </div>

                {/* Terms and Conditions Checkbox */}
                <div className="sm:col-span-2 group">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center h-5">
                      <input
                        id="agreeToTerms"
                        name="agreeToTerms"
                        type="checkbox"
                        checked={form.agreeToTerms}
                        onChange={(e) => updateField("agreeToTerms", e.target.checked)}
                        onFocus={() => setFocusedField("agreeToTerms")}
                        onBlur={() => setFocusedField(null)}
                        className={`w-4 h-4 text-orange-600 bg-neutral-800 border-neutral-600 rounded focus:ring-orange-500 focus:ring-2 transition-all duration-200 ${
                          focusedField === "agreeToTerms" ? "ring-2 ring-orange-500/60" : ""
                        } ${
                          errors.agreeToTerms ? "border-red-500" : ""
                        }`}
                      />
                    </div>
                    <div className="text-sm">
                      <label htmlFor="agreeToTerms" className="text-neutral-300 group-hover:text-orange-300 transition-colors duration-300 cursor-pointer">
                        I agree to the T&C and Receive Marketing Emails
                      </label>
                      {errors.agreeToTerms && <p className="mt-1 text-sm text-red-400">{errors.agreeToTerms}</p>}
                    </div>
                  </div>
                </div>

                {/* Enhanced Submit Section */}
                <div className="sm:col-span-2 mt-6">
                  {/* Urgency banner above submit */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl text-center">
                    <p className="text-sm text-orange-300 font-semibold flex items-center justify-center gap-2">
                      <span className="animate-pulse">⚡</span>
                      <span>Only a few seats left! Register now to secure your spot</span>
                      <span className="animate-pulse">⚡</span>
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={submitting || completionPercentage < 100}
                      className={`flex-1 inline-flex items-center justify-center rounded-xl px-6 py-4 text-base font-bold transition-all duration-300 shadow-2xl relative overflow-hidden group ${
                        completionPercentage === 100 
                          ? 'bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 hover:from-orange-400 hover:via-orange-500 hover:to-red-400 text-white shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60'
                      }`}
                    >
                      {/* Animated background */}
                      <span className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                      
                      {/* Pulsing effect when ready */}
                      {completionPercentage === 100 && !submitting && (
                        <span className="absolute inset-0 bg-white/10 animate-pulse"></span>
                      )}
                      
                      <span className="relative z-10 flex items-center gap-2">
                        {submitting && (
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                        {submitting ? (
                          "🚀 Securing Your Spot..."
                        ) : completionPercentage === 100 ? (
                          "🎉 CLAIM MY SEAT NOW!"
                        ) : (
                          `📝 Complete Form (${completionPercentage}%)`
                        )}
                      </span>
                    </button>
                    

                  </div>
                  
                  {/* Additional motivation text */}
                  {completionPercentage < 100 && (
                    <p className="text-xs text-neutral-500 mt-2 text-center">
                      💡 Fill all fields to unlock the registration button
                    </p>
                  )}
                </div>

                {serverMessage && !submitted && (
                  <div className="sm:col-span-2 mt-4 text-sm text-neutral-200">
                    {serverMessage}
                  </div>
                )}
              </form>
            </div>
          </div>

          <FooterNote />
        </div>
      </main>
      
      {/* Floating Help Button */}
      <FloatingHelpButton />
    </div>
  );
}

function FooterNote() {
  return (
    <div className="max-w-4xl mx-auto mt-8 mb-4">
      <div className="text-center">
        {/* Copyright text */}
        <p className="text-neutral-400 text-sm mb-4">
          © 2025 Bitcoinconferenceindia. All rights reserved.
        </p>
        
        {/* Social media icons */}
        <div className="flex items-center justify-center gap-4">
          <a 
            href="https://x.com/btcconfIND?t=A_WikWk9MxG2ZyOrh3CZTQ&s=08" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-white/40 hover:bg-black/60 transition-all duration-300 hover:scale-110"
          >
            <span className="text-white text-lg font-bold">𝕏</span>
          </a>
          <a 
            href="https://www.instagram.com/btcconfind?igsh=MTgyenZodHFvdDkzeA==" 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:border-white/40 hover:bg-black/60 transition-all duration-300 hover:scale-110"
          >
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}

function FloatingHelpButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Enhanced Help Tooltip */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-72 p-5 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl animate-slide-up">
          <div className="text-center mb-3">
            <div className="text-2xl mb-2">🎯</div>
            <h3 className="text-sm font-bold text-white mb-1">Quick Registration Help</h3>
            <p className="text-xs text-orange-300">Get your spot in 2 minutes!</p>
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="text-green-400">✓</span>
              <span>Fill all 8 fields completely</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="text-blue-400">📱</span>
              <span>Use valid phone & email</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-neutral-300">
              <span className="text-purple-400">🚀</span>
              <span>Submit to secure your seat</span>
            </div>
          </div>

        </div>
      )}
      
      {/* Enhanced Help Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center text-white transition-all duration-300 hover:scale-110 active:scale-95 group"
      >
        {/* Pulsing ring */}
        <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20"></div>
        
        {/* Button content */}
        <div className="relative flex items-center justify-center">
          {isOpen ? (
            <span className="text-lg font-bold">✕</span>
          ) : (
            <div className="flex flex-col items-center">
              <span className="text-lg font-bold">?</span>
              <span className="text-xs font-semibold -mt-1">Help</span>
            </div>
          )}
        </div>
        
        {/* Notification dot */}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold">!</span>
        </div>
      </button>
    </div>
  );
}

// Background Elements Component
function BackgroundElements() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<Array<{x: number, y: number, delay: number, duration: number}>>([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Generate particles with random positions
    const generateParticles = () => {
      const newParticles = [...Array(25)].map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 4,
      }));
      setParticles(newParticles);
    };

    // Keyboard shortcuts
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'Enter') {
        // Focus on submit button when Ctrl+Enter is pressed
        const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement;
        submitButton?.focus();
      }
    };

    generateParticles();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyPress);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0">
        {particles.map((particle, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/40 rounded-full animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced Geometric Shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 border border-orange-500/15 rounded-full animate-spin" style={{ animationDuration: '20s' }} />
      <div className="absolute top-40 right-20 w-24 h-24 border border-orange-500/15 rotate-45 animate-pulse" />
      <div className="absolute bottom-32 left-20 w-16 h-16 bg-gradient-to-br from-orange-500/10 to-transparent rounded-lg animate-bounce" style={{ animationDuration: '3s' }} />
      <div className="absolute top-60 right-40 w-20 h-20 border-2 border-orange-500/10 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
      
      {/* Additional floating elements */}
      <div className="absolute top-1/4 right-1/6 w-8 h-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full animate-bounce-subtle" />
      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 border border-yellow-500/10 rounded-lg animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-3/4 left-1/6 w-6 h-6 bg-gradient-to-r from-green-500/15 to-blue-500/15 rounded-full animate-bounce" style={{ animationDuration: '4s', animationDelay: '2s' }} />
      
      {/* Interactive Glow Effect */}
      <div
        className="absolute w-96 h-96 bg-gradient-radial from-orange-500/8 via-orange-500/3 to-transparent rounded-full pointer-events-none transition-all duration-500 ease-out"
        style={{
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Bitcoin B Symbols - Clean placement in specific locations - Hidden on mobile */}
      {/* Right side symbols */}
      <div className="absolute top-20 right-20 text-5xl text-orange-500/8 font-bold select-none pointer-events-none animate-float mobile-hidden" style={{ animationDelay: '1s' }}>
        ₿
      </div>
      <div className="absolute top-1/2 right-8 text-4xl text-orange-500/6 font-bold select-none pointer-events-none animate-pulse mobile-hidden" style={{ animationDelay: '2s' }}>
        ₿
      </div>
      <div className="absolute bottom-20 right-20 text-6xl text-orange-500/7 font-bold select-none pointer-events-none animate-float mobile-hidden" style={{ animationDelay: '3s' }}>
        ₿
      </div>
      <div className="absolute bottom-32 left-20 text-5xl text-orange-500/5 font-bold select-none pointer-events-none animate-pulse mobile-hidden" style={{ animationDelay: '4s' }}>
        ₿
      </div>
      
      {/* Left side symbols for balance */}
      <div className="absolute top-20 left-20 text-4xl text-orange-500/7 font-bold select-none pointer-events-none animate-pulse mobile-hidden" style={{ animationDelay: '1.5s' }}>
        ₿
      </div>
      <div className="absolute top-1/3 left-8 text-5xl text-orange-500/6 font-bold select-none pointer-events-none animate-float mobile-hidden" style={{ animationDelay: '2.5s' }}>
        ₿
      </div>
      <div className="absolute top-2/3 left-12 text-6xl text-orange-500/5 font-bold select-none pointer-events-none animate-pulse mobile-hidden" style={{ animationDelay: '3.5s' }}>
        ₿
      </div>
      
      {/* Enhanced Gradient Orbs */}
      <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-gradient-to-br from-orange-500/10 via-orange-500/3 to-transparent rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-gradient-to-br from-orange-500/8 via-transparent to-transparent rounded-full blur-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </div>
  );
}

function twInput(hasError?: string, extra = "") {
  const base =
    "w-full rounded-xl border bg-white/10 backdrop-blur-sm text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-orange-500/60 focus:border-orange-500/40 disabled:opacity-60 px-4 py-3 text-sm border-white/15 transition-all duration-300 hover:bg-white/15 hover:border-white/25";
  const err = hasError ? " border-red-400/40 focus:ring-red-500/60 focus:border-red-500/40" : "";
  return [base, err, extra].filter(Boolean).join(" ");
}
