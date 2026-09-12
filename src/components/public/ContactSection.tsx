import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { MapPin, Phone, MessageSquare, Clock, Send, CheckCircle2, Navigation } from 'lucide-react';
import { ClassLevel } from '../../types';

export const ContactSection: React.FC = () => {
  const { addEnquiry } = useData();

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(10);
  const [phone, setPhone] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [preferredBatch, setPreferredBatch] = useState('Evening Batch');
  const [preferredTiming, setPreferredTiming] = useState('05:00 PM - 06:15 PM');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !parentName.trim()) return;

    addEnquiry({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      classLevel,
      phone: phone.trim(),
      whatsApp: whatsApp.trim() || phone.trim(),
      preferredBatch,
      preferredTiming,
      message: message.trim(),
    });

    setIsSuccess(true);
  };

  return (
    <section id="contact" className="py-20 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100/70 border border-blue-200 px-3.5 py-1.5 rounded-full">
            CONNECT WITH US
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-4 font-sans">
            Visit Our Offline Centre or Get In Touch
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3 leading-relaxed">
            Conveniently located in Bahadrabad. Parents and students are welcome to visit our classroom for personalized academic counseling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Details & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold">
                  OFFLINE CENTRE
                </span>
                <h3 className="text-2xl font-black text-white mt-1 font-sans">
                  AVNEET MATHS HUB
                </h3>
                <p className="text-xs text-slate-400 mt-1 italic">
                  “Empowering Minds, Building Futures!”
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-300">
                <div className="flex items-start gap-3.5">
                  <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Address:</strong>
                    <span>Rohalki Kishanpur, Bahadrabad</span>
                    <span className="block text-slate-400 text-xs">PIN: 249402, Haridwar, Uttarakhand</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <Phone className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-white block font-semibold">Phone / WhatsApp:</strong>
                    <a href="tel:+919528665136" className="text-emerald-400 font-bold hover:underline">
                      +91 9528665136
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block font-semibold">Class & Office Timings:</strong>
                    <span>Monday – Saturday: 03:00 PM – 09:30 PM</span>
                    <span className="block text-slate-400 text-xs">Sunday: Special Mock Tests & Doubts</span>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col gap-2.5">
                <a
                  id="contact-whatsapp-direct"
                  href="https://wa.me/919528665136?text=Hello%20Avneet%20Sir,%20I%20am%20interested%20in%20visiting%20Avneet%20Maths%20Hub%20in%20Bahadrabad."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Direct WhatsApp Message</span>
                </a>

                <a
                  id="contact-call-direct"
                  href="tel:+919528665136"
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 border border-slate-700 transition-all"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call Mr. Avneet Chauhan (+91 9528665136)</span>
                </a>
              </div>
            </div>

            {/* Offline Location Map simulation block */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-slate-900">Rohalki Kishanpur Landmark</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Located near Bahadrabad, easily accessible for students from local schools and residential areas.
                </p>
              </div>
              <div className="p-3 bg-blue-100 text-blue-800 rounded-xl shrink-0">
                <Navigation className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
              {isSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-sans">
                    Enquiry Received Successfully!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you, <strong>{parentName}</strong>. Your enquiry for <strong>{studentName}</strong> (Class {classLevel}) has been logged in our coaching admissions CRM.
                  </p>
                  <p className="text-xs text-slate-500">
                    Mr. Avneet Chauhan will follow up at <strong>{phone}</strong> shortly.
                  </p>
                  <button
                    id="reset-enquiry-form-btn"
                    onClick={() => {
                      setIsSuccess(false);
                      setStudentName('');
                      setParentName('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-200/80 pb-3 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 font-sans">
                      Send an Admission Inquiry
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Share your details to check seat availability and receive full batch information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        id="enq-student-name"
                        type="text"
                        required
                        placeholder="e.g. Priya Verma"
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        id="enq-parent-name"
                        type="text"
                        required
                        placeholder="e.g. Dr. S. K. Verma"
                        value={parentName}
                        onChange={e => setParentName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Target Class *
                      </label>
                      <select
                        id="enq-class-level"
                        value={classLevel}
                        onChange={e => setClassLevel(Number(e.target.value) as ClassLevel)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white font-medium"
                      >
                        <option value={7}>Class 7th Mathematics</option>
                        <option value={8}>Class 8th Mathematics</option>
                        <option value={9}>Class 9th Mathematics</option>
                        <option value={10}>Class 10th Mathematics (Board)</option>
                        <option value={11}>Class 11th Mathematics</option>
                        <option value={12}>Class 12th Mathematics (Board)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Phone / Contact Number *
                      </label>
                      <input
                        id="enq-phone"
                        type="tel"
                        required
                        placeholder="e.g. +91 9528665136"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        WhatsApp Number (Optional)
                      </label>
                      <input
                        id="enq-whatsapp"
                        type="tel"
                        placeholder="Leave blank if same as phone"
                        value={whatsApp}
                        onChange={e => setWhatsApp(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred Batch Timing
                      </label>
                      <input
                        id="enq-timing"
                        type="text"
                        placeholder="e.g. After 05:00 PM"
                        value={preferredTiming}
                        onChange={e => setPreferredTiming(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Questions or Current Mathematics Difficulty
                    </label>
                    <textarea
                      id="enq-message"
                      rows={3}
                      placeholder="Tell us about the student's current school, syllabus, or topics where they need extra clarity..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-enquiry-btn"
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
