import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, CheckCircle2, Phone, User, BookOpen, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { ClassLevel } from '../../types';

interface FreeTrialSectionProps {
  preselectedClass?: ClassLevel;
  preselectedBatch?: string;
}

export const FreeTrialSection: React.FC<FreeTrialSectionProps> = ({
  preselectedClass = 10,
  preselectedBatch = '',
}) => {
  const { addFreeTrial, batches } = useData();

  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [classLevel, setClassLevel] = useState<ClassLevel>(preselectedClass);
  const [phone, setPhone] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [preferredDate, setPreferredDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [preferredBatch, setPreferredBatch] = useState(preselectedBatch || 'Evening Batch A');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync if preselected props change
  React.useEffect(() => {
    if (preselectedClass) setClassLevel(preselectedClass);
    if (preselectedBatch) setPreferredBatch(preselectedBatch);
  }, [preselectedClass, preselectedBatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !phone.trim() || !parentName.trim()) return;

    addFreeTrial({
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      classLevel,
      phone: phone.trim(),
      whatsApp: whatsApp.trim() || phone.trim(),
      preferredDate,
      preferredBatch,
      message: message.trim(),
    });

    setIsSubmitted(true);
  };

  const availableBatchesForClass = batches.filter(b => b.classLevel === classLevel);

  return (
    <section id="free-trial" className="py-20 bg-gradient-to-b from-slate-900 to-indigo-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>100% FREE NO-RISK EXPERIENCE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white font-sans">
              Book 3-Day Free Trial Classes
            </h2>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
              We encourage every student and parent to attend <strong className="text-white">3 full classroom sessions completely free</strong>. Experience Mr. Avneet Chauhan’s interactive problem solving, see our classroom environment, and understand our concept clarity method before deciding.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Day 1: Concept Foundations</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Clear understanding of theory, algebraic definitions, and formula derivations.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Day 2: Hand-written Problem Solving</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Individual notebook checking, NCERT exercises, and Daily Practice Problems (DPP).
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/80 border border-slate-700/80">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Day 3: Doubt Session & Assessment</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Personalized feedback from Avneet Sir and academic consultation with parents.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-blue-900/30 border border-blue-500/30 text-xs text-blue-200">
              📍 <strong>Offline Centre:</strong> Rohalki Kishanpur, Bahadrabad (PIN: 249402) • Phone: +91 9528665136
            </div>
          </div>

          {/* Right form card */}
          <div className="lg:col-span-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 text-slate-900 shadow-2xl border border-slate-100">
              {isSubmitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 font-sans">
                    3-Day Trial Booked Successfully!
                  </h3>
                  <p className="text-slate-600 text-sm max-w-md mx-auto">
                    Thank you, <strong>{parentName}</strong>! We have registered <strong>{studentName}</strong> for Class {classLevel}th trial starting on <strong>{preferredDate}</strong>.
                  </p>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 text-left space-y-1">
                    <p><strong>Student:</strong> {studentName} (Class {classLevel})</p>
                    <p><strong>Offline Centre:</strong> Rohalki Kishanpur, Bahadrabad</p>
                    <p><strong>Teacher:</strong> Mr. Avneet Chauhan (+91 9528665136)</p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Avneet Sir will call/WhatsApp you at <strong>{phone}</strong> to confirm your exact batch timing.
                  </p>
                  <button
                    id="book-another-trial-btn"
                    onClick={() => {
                      setIsSubmitted(false);
                      setStudentName('');
                      setParentName('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-5 py-2.5 bg-blue-700 text-white rounded-xl font-bold text-xs hover:bg-blue-800 transition-colors"
                  >
                    Register Another Student
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h3 className="text-xl font-bold text-slate-900 font-sans">
                      Reserve Your 3-Day Trial Seat
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Fill in the details below to join the upcoming trial batch at our Bahadrabad offline center.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Student Full Name *
                      </label>
                      <input
                        id="trial-student-name"
                        type="text"
                        required
                        placeholder="e.g. Aarav Sharma"
                        value={studentName}
                        onChange={e => setStudentName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        id="trial-parent-name"
                        type="text"
                        required
                        placeholder="e.g. Mr. Rajesh Sharma"
                        value={parentName}
                        onChange={e => setParentName(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Class / Grade *
                      </label>
                      <select
                        id="trial-class-level"
                        value={classLevel}
                        onChange={e => setClassLevel(Number(e.target.value) as ClassLevel)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white font-semibold"
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
                        Phone / Mobile Number *
                      </label>
                      <input
                        id="trial-phone"
                        type="tel"
                        required
                        placeholder="e.g. +91 9528665136"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred Start Date
                      </label>
                      <input
                        id="trial-preferred-date"
                        type="date"
                        value={preferredDate}
                        onChange={e => setPreferredDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Preferred Batch / Slot
                      </label>
                      <select
                        id="trial-preferred-batch"
                        value={preferredBatch}
                        onChange={e => setPreferredBatch(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden bg-white"
                      >
                        {availableBatchesForClass.length > 0 ? (
                          availableBatchesForClass.map(b => (
                            <option key={b.id} value={b.name}>
                              {b.name} ({b.timeSlot})
                            </option>
                          ))
                        ) : (
                          <>
                            <option value="Evening Regular Batch">Evening Regular Batch</option>
                            <option value="Weekend Intensive Batch">Weekend Intensive Batch</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Message / Mathematics Topics Needing Attention (Optional)
                    </label>
                    <textarea
                      id="trial-message"
                      rows={2}
                      placeholder="e.g. Weak in Trigonometry or Quadratic Equations; need strong concept base."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
                    />
                  </div>

                  <button
                    type="submit"
                    id="submit-trial-form-btn"
                    className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>Submit 3-Day Free Trial Booking</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-[11px] text-center text-slate-400">
                    No payment required. Free admission assessment & materials provided.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
