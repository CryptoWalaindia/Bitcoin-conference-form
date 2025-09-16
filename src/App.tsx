import React, { useMemo, useState, useEffect } from "react";
import logoSvg from "../poioi.png";
import { submitRegistration, type RegistrationData } from "./lib/supabase";

// Single-file React page for a clean, modern registration form with interactive background
// Tailwind CSS is assumed to be available. Default export renders the whole page.

export default function BitcoinConferenceIndiaForm() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    age: "",
    gender: "",
    state: "",
    purpose: "",
  });

  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Calculate form completion percentage
  const completionPercentage = useMemo(() => {
    const fields = Object.values(form);
    const filledFields = fields.filter((field: string) => field.trim() !== "").length;
    return Math.round((filledFields / fields.length) * 100);
  }, [form]);

  const states = useMemo(
    () => [
      // States
      "Andhra Pradesh",
      "Arunachal Pradesh",
      "Assam",
      "Bihar",
      "Chhattisgarh",
      "Goa",
      "Gujarat",
      "Haryana",
      "Himachal Pradesh",
      "Jharkhand",
      "Karnataka",
      "Kerala",
      "Madhya Pradesh",
      "Maharashtra",
      "Manipur",
      "Meghalaya",
      "Mizoram",
      "Nagaland",
      "Odisha",
      "Punjab",
      "Rajasthan",
      "Sikkim",
      "Tamil Nadu",
      "Telangana",
      "Tripura",
      "Uttar Pradesh",
      "Uttarakhand",
      "West Bengal",
      // Union Territories
      "Andaman and Nicobar Islands",
      "Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi",
      "Jammu and Kashmir",
      "Ladakh",
      "Lakshadweep",
      "Puducherry",
    ],
    []
  );

  function updateField(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e: Record<string, string | undefined> = {};

    if (!form.firstName.trim()) e.firstName = "Please enter your first name";
    if (!form.lastName.trim()) e.lastName = "Please enter your last name";

    // Basic India-friendly phone rule: 10 to 15 digits
    if (!/^\d{10,15}$/.test(form.phone.trim())) {
      e.phone = "Enter a valid phone number (10 to 15 digits)";
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

    if (!form.state) e.state = "Select your state";

    if (!form.purpose.trim()) e.purpose = "Tell us your purpose of visit";

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
        phone: form.phone.trim(),
        email: form.email.trim().toLowerCase(),
        age: parseInt(form.age.trim()),
        gender: form.gender as 'Male' | 'Female' | 'Others',
        state: form.state,
        purpose: form.purpose.trim(),
      };

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
      setForm({ firstName: "", lastName: "", phone: "", email: "", age: "", gender: "", state: "", purpose: "" });
    } catch (err: any) {
      setServerMessage(err.message || "Could not submit right now. Please try again.");
      console.error("Error submitting form:", err);
    } finally {
      setSubmitting(false);
    }
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
      
      <header className="relative z-10 max-w-4xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6 animate-float">
            {/* Logo with enhanced glow */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl animate-pulse"></div>
              <img 
                src={logoSvg} 
                alt="Bitcoin Logo" 
                className="relative h-24 w-24 object-contain filter drop-shadow-lg hover:drop-shadow-xl transition-all duration-300 hover:scale-110"
                onError={(e) => {
                  // Fallback to Bitcoin symbol if logo fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = document.createElement('span');
                  fallback.textContent = '₿';
                  fallback.className = 'text-4xl text-orange-400 font-bold flex items-center justify-center w-full h-full';
                  target.parentElement?.appendChild(fallback);
                }}
              />
            </div>
            
            {/* Title and subtitle with enhanced styling */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                Bitcoin Conference India
              </h1>
              {/* ✅ AUTO-DEPLOYMENT ACTIVE - Changes pushed to main branch go live automatically! Mobile status hidden via CSS. */}
              <div className="flex items-center gap-2 mt-2">
                <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-full animate-pulse">
                  🔥 LIMITED SEATS
                </span>
                <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-semibold rounded-full">
                  ✨ EARLY BIRD
                </span>
              </div>
            </div>
          </div>
          
          {/* Enhanced Status Indicator with countdown - Hidden on mobile */}
          <div className="flex flex-col items-end gap-2 mobile-hidden">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Registration Live</span>
            </div>
            <div className="text-xs text-orange-400 font-semibold animate-pulse">
              ⏰ Closing Soon!
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 pb-24">
        <div className="max-w-4xl mx-auto">
          {/* Compelling announcement banner */}
          <div className="mb-6 p-4 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 border border-orange-500/30 rounded-xl text-center animate-pulse-glow">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-2xl animate-bounce">🔥</span>
              <h3 className="text-lg font-bold text-orange-300">EXCLUSIVE EARLY BIRD OFFER</h3>
              <span className="text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>🔥</span>
            </div>
            <p className="text-sm text-white mb-2">
              Register in the next <span className="font-bold text-orange-400">24 hours</span> and get:
            </p>
            <div className="flex items-center justify-center gap-6 text-sm text-neutral-300">
              <span className="flex items-center gap-1">
                <span className="text-green-400 text-lg">✓</span>
                <span className="font-bold text-white">FREE Conference Pass</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-400 text-lg">✓</span>
                <span className="font-bold text-white">VIP Networking Access</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="text-purple-400 text-lg">✓</span>
                <span className="font-bold text-white">Exclusive Swag Kit</span>
              </span>
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
            
            <div className="relative p-6 sm:p-10">
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
                      {completionPercentage < 50 ? "🔥 You're doing great! Keep going..." : "🎉 Almost there! Just a few more fields..."}
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
                    placeholder="e.g., Abrar"
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
                    placeholder="e.g., Khan"
                    className={twInput(errors.lastName, focusedField === "lastName" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName}</p>}
                </div>

                {/* Phone */}
                <div className="group">
                  <label htmlFor="phone" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">Phone number</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 select-none">+91</span>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="\d{10,15}"
                      maxLength={15}
                      value={form.phone}
                      onChange={(e) => updateField("phone", e.target.value.replace(/[^\d]/g, ""))}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="9876543210"
                      className={twInput(errors.phone, `pl-12 ${focusedField === "phone" ? "ring-2 ring-orange-500/60 border-orange-500/40" : ""}`)}
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

                {/* State */}
                <div className="group">
                  <label htmlFor="state" className="block text-sm mb-2 text-neutral-300 group-hover:text-orange-300 transition-colors duration-300">State / UT</label>
                  <select
                    id="state"
                    name="state"
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    onFocus={() => setFocusedField("state")}
                    onBlur={() => setFocusedField(null)}
                    className={twInput(errors.state, focusedField === "state" ? "ring-2 ring-orange-500/60 border-orange-500/40" : "")}
                  >
                    <option value="" className="text-neutral-900 bg-white">Select</option>
                    {states.map((s) => (
                      <option key={s} value={s} className="text-neutral-900 bg-white">{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-400">{errors.state}</p>}
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

                {/* Enhanced Submit Section */}
                <div className="sm:col-span-2 mt-6">
                  {/* Urgency banner above submit */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-red-500/10 via-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl text-center">
                    <p className="text-sm text-orange-300 font-semibold flex items-center justify-center gap-2">
                      <span className="animate-pulse">⚡</span>
                      <span>Only 50 seats left! Register now to secure your spot</span>
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
                    
                    <button
                      type="button"
                      className="rounded-xl px-4 py-4 text-sm border border-white/15 hover:bg-white/5 hover:border-white/25 transition-all duration-300 hover:scale-105 active:scale-95"
                      onClick={() => {
                        setForm({ firstName: "", lastName: "", phone: "", email: "", age: "", gender: "", state: "", purpose: "" });
                        setErrors({});
                        setServerMessage("");
                        setSubmitted(false);
                      }}
                    >
                      🔄 Reset
                    </button>
                  </div>
                  
                  {/* Additional motivation text */}
                  {completionPercentage < 100 && (
                    <p className="text-xs text-neutral-500 mt-2 text-center">
                      💡 Fill all fields to unlock the registration button
                    </p>
                  )}
                </div>

                {serverMessage && (
                  <div className="sm:col-span-2 mt-4 text-sm text-neutral-200">
                    {serverMessage}
                  </div>
                )}

                {submitted && (
                  <div className="sm:col-span-2 mt-4 rounded-xl border border-green-400/30 bg-gradient-to-r from-green-400/10 via-emerald-400/10 to-green-400/10 p-6 text-sm animate-fade-in shadow-lg shadow-green-500/20">
                    <div className="text-center">
                      <div className="text-4xl mb-2 animate-bounce">🎉</div>
                      <h3 className="text-lg font-bold text-green-400 mb-2">
                        🚀 Registration Successful!
                      </h3>
                      <p className="text-neutral-200 mb-3">
                        Congratulations! You've secured your spot at Bitcoin Conference India.
                      </p>
                      <div className="flex items-center justify-center gap-4 text-xs text-neutral-400">
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                          <span>Confirmation sent</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>📧</span>
                          <span>Check your email</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🎫</span>
                          <span>Ticket details coming</span>
                        </div>
                      </div>
                    </div>
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
    <div className="max-w-4xl mx-auto">
      <div className="px-2 sm:px-0">
        {/* Enhanced testimonials/social proof section */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-white/5 via-white/10 to-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-all duration-300">
          <div className="text-center mb-4">
            <h3 className="text-sm font-semibold text-orange-300 mb-2">🌟 Join Industry Leaders</h3>
            <div className="flex items-center justify-center gap-6 text-xs text-neutral-400">
              <div className="flex items-center gap-1">
                <span className="text-blue-400">💼</span>
                <span>CEOs & Founders</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-400">🏦</span>
                <span>Banking Executives</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-purple-400">🚀</span>
                <span>Crypto Innovators</span>
              </div>
            </div>
          </div>
          
          {/* Main footer content */}
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs text-neutral-400">
              By registering, you agree to receive event updates. We respect your privacy.
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-neutral-400">256-bit Encrypted</span>
            </div>
          </div>
          
          {/* Enhanced social proof indicators */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-neutral-500">
              <div className="flex items-center gap-1 hover:text-green-400 transition-colors duration-300">
                <span>🔒</span>
                <span>Bank-Grade Security</span>
              </div>
              <div className="flex items-center gap-1 hover:text-blue-400 transition-colors duration-300">
                <span>⚡</span>
                <span>Instant Confirmation</span>
              </div>
              <div className="flex items-center gap-1 hover:text-purple-400 transition-colors duration-300">
                <span>🎯</span>
                <span>Zero Spam Guarantee</span>
              </div>
              <div className="flex items-center gap-1 hover:text-orange-400 transition-colors duration-300">
                <span>🏆</span>
                <span>Premium Experience</span>
              </div>
            </div>
            
            {/* Footer logo with enhanced styling */}
            <div className="flex items-center gap-2">
              <div className="logo-container w-6 h-6 opacity-60 hover:opacity-100 transition-opacity duration-300">
                <img 
                  src={logoSvg} 
                  alt="Bitcoin Conference India" 
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-xs text-neutral-500 hover:text-orange-400 transition-colors duration-300">Bitcoin Conference India</span>
            </div>
          </div>
          
          {/* Additional trust indicators */}
          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-center gap-6 text-xs text-neutral-600">
            <span className="flex items-center gap-1">
              <span className="text-yellow-400">⭐</span>
              <span>Rated 4.9/5 by attendees</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-red-400">❤️</span>
              <span>Loved by 1000+ participants</span>
            </span>
          </div>
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
          
          <div className="border-t border-white/10 pt-3">
            <p className="text-xs text-neutral-400 mb-2 font-semibold">Need assistance?</p>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-neutral-400 hover:text-orange-300 transition-colors duration-300">
                <span>📧</span>
                <span>support@bitcoinconference.in</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 hover:text-orange-300 transition-colors duration-300">
                <span>📞</span>
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 hover:text-orange-300 transition-colors duration-300">
                <span>💬</span>
                <span>Live chat available 24/7</span>
              </div>
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

      {/* Bitcoin B Symbols - Clean placement in specific locations */}
      {/* Right side symbols */}
      <div className="absolute top-20 right-20 text-5xl text-orange-500/8 font-bold select-none pointer-events-none animate-float" style={{ animationDelay: '1s' }}>
        ₿
      </div>
      <div className="absolute top-1/2 right-8 text-4xl text-orange-500/6 font-bold select-none pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}>
        ₿
      </div>
      <div className="absolute bottom-20 right-20 text-6xl text-orange-500/7 font-bold select-none pointer-events-none animate-float" style={{ animationDelay: '3s' }}>
        ₿
      </div>
      <div className="absolute bottom-32 left-20 text-5xl text-orange-500/5 font-bold select-none pointer-events-none animate-pulse" style={{ animationDelay: '4s' }}>
        ₿
      </div>
      
      {/* Left side symbols for balance */}
      <div className="absolute top-20 left-20 text-4xl text-orange-500/7 font-bold select-none pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}>
        ₿
      </div>
      <div className="absolute top-1/3 left-8 text-5xl text-orange-500/6 font-bold select-none pointer-events-none animate-float" style={{ animationDelay: '2.5s' }}>
        ₿
      </div>
      <div className="absolute top-2/3 left-12 text-6xl text-orange-500/5 font-bold select-none pointer-events-none animate-pulse" style={{ animationDelay: '3.5s' }}>
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
