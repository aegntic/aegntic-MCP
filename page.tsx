"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  // Animation effect on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observer.unobserve(entry.target);
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    const sections = document.querySelectorAll('.animate-on-scroll');

    for (const section of sections) {
      observer.observe(section);
    }

    return () => {
      for (const section of sections) {
        observer.unobserve(section);
      }
    };
  }, []);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
    }, 5000);
  };

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <section className="pt-16 md:pt-24 pb-8 md:pb-12">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-humane text-6xl md:text-7xl lg:text-9xl font-medium tracking-wide leading-none mb-6 animate-on-scroll opacity-0">
              g3t 1n t0uch
            </h1>
            <p className="text-base md:text-lg text-[#666] max-w-2xl mx-auto animate-on-scroll opacity-0">
              pl34s3 c0nt4ct m3 w1th 4ny qu3r13s, r3qu3sts f0r 1nf0rm4t10n 0r s1mply t0 sh4r3 y0ur v1s10n. 1 l00k f0rw4rd t0 c0ll4b0r4t1ng w1th y0u 4nd br1ng1ng y0ur 1d34s t0 l1f3.
            </p>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-wrap justify-center gap-6 animate-on-scroll opacity-0">
              <a
                href="https://x.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-black hover:text-black/70 transition-colors"
                aria-label="Twitter"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.55 2H14.7L9.97 7.5L15.5 14H11.3L7.86 10.06L3.92 14H1.76L6.83 8.11L1.5 2H5.81L8.92 5.56L12.55 2ZM11.77 12.8H12.9L5.31 3.16H4.11L11.77 12.8Z" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-black hover:text-black/70 transition-colors"
                aria-label="Instagram"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1.44144C10.1366 1.44144 10.3894 1.44144 11.1914 1.48807C13.1673 1.56466 14.4353 2.8327 14.5119 4.80856C14.5586 5.6106 14.5586 5.8634 14.5586 8.00001C14.5586 10.1367 14.5586 10.3895 14.5119 11.1915C14.4353 13.1674 13.1673 14.4354 11.1914 14.512C10.3894 14.5586 10.1366 14.5586 8 14.5586C5.86338 14.5586 5.61058 14.5586 4.80854 14.512C2.8327 14.4354 1.56466 13.1674 1.48807 11.1915C1.44144 10.3895 1.44144 10.1367 1.44144 8.00001C1.44144 5.8634 1.44144 5.6106 1.48807 4.80856C1.56466 2.8327 2.8327 1.56466 4.80854 1.48807C5.61058 1.44144 5.86338 1.44144 8 1.44144ZM8 0C5.82772 0 5.55485 0 4.76682 0.046636C1.84038 0.14658 0.14658 1.84038 0.046636 4.76682C0 5.55486 0 5.82772 0 8C0 10.1723 0 10.4452 0.046636 11.2332C0.14658 14.1596 1.84038 15.8534 4.76682 15.9534C5.55485 16 5.82772 16 8 16C10.1723 16 10.4451 16 11.2332 15.9534C14.1596 15.8534 15.8534 14.1596 15.9534 11.2332C16 10.4452 16 10.1723 16 8C16 5.82772 16 5.55486 15.9534 4.76682C15.8534 1.84038 14.1596 0.14658 11.2332 0.046636C10.4451 0 10.1723 0 8 0ZM8 3.89194C5.73111 3.89194 3.89194 5.73111 3.89194 8C3.89194 10.2689 5.73111 12.1081 8 12.1081C10.2689 12.1081 12.1081 10.2689 12.1081 8C12.1081 5.73111 10.2689 3.89194 8 3.89194ZM8 10.6667C6.52724 10.6667 5.33333 9.47276 5.33333 8C5.33333 6.52724 6.52724 5.33333 8 5.33333C9.47276 5.33333 10.6667 6.52724 10.6667 8C10.6667 9.47276 9.47276 10.6667 8 10.6667ZM12.2705 3.72954C12.2705 4.25982 11.8403 4.68991 11.3101 4.68991C10.7798 4.68991 10.3497 4.25982 10.3497 3.72954C10.3497 3.19926 10.7798 2.76917 11.3101 2.76917C11.8403 2.76917 12.2705 3.19926 12.2705 3.72954Z" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-black hover:text-black/70 transition-colors"
                aria-label="LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.8189 0H1.18111C0.529111 0 0 0.517333 0 1.15378V14.8462C0 15.4827 0.529111 16 1.18111 16H14.8189C15.4709 16 16 15.4827 16 14.8462V1.15378C16 0.517333 15.4709 0 14.8189 0ZM4.74844 13.6324H2.37156V5.99911H4.74844V13.6324ZM3.56 4.95467C2.8 4.95467 2.18311 4.33244 2.18311 3.57733C2.18311 2.82222 2.8 2.2 3.56 2.2C4.32 2.2 4.93689 2.82222 4.93689 3.57733C4.93689 4.33244 4.32 4.95467 3.56 4.95467ZM13.6324 13.6324H11.2596V9.92C11.2596 9.03689 11.2418 7.89778 10.0204 7.89778C8.78133 7.89778 8.59289 8.85689 8.59289 9.85244V13.6324H6.22311V5.99911H8.50133V7.04356H8.53689C8.85689 6.44267 9.63644 5.81333 10.7876 5.81333C13.1893 5.81333 13.6324 7.39022 13.6324 9.44889V13.6324Z" fill="currentColor"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center text-black hover:text-black/70 transition-colors"
                aria-label="Facebook"
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 11.993 2.92547 15.3027 6.75 15.9028V10.3125H4.71875V8H6.75V6.2375C6.75 4.2325 7.94438 3.125 9.77172 3.125C10.6467 3.125 11.5625 3.28125 11.5625 3.28125V5.25H10.5538C9.56 5.25 9.25 5.86672 9.25 6.5V8H11.4688L11.1141 10.3125H9.25V15.9028C13.0745 15.3027 16 11.993 16 8Z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white p-8 border border-[#e0e0e0] animate-on-scroll opacity-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Form Success Message */}
              {submitted && (
                <div className="p-4 bg-green-50 text-green-700 rounded-md mb-6 animate-fade-in">
                  th4nk y0u! y0ur m3ss4g3 h4s b33n r3c31v3d.
                </div>
              )}

              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  n4m3
                </label>
                <input
                  type="text"
                  id="name"
                  {...register("name", { required: true })}
                  className={`w-full p-3 border ${errors.name ? 'border-red-500' : 'border-[#e0e0e0]'} focus:outline-none focus:ring-2 focus:ring-black/20`}
                />
                {errors.name && <span className="text-xs text-red-500 mt-1">th1s f13ld 1s r3qu1r3d</span>}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  3m41l 4ddr3ss
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", {
                    required: true,
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                  })}
                  className={`w-full p-3 border ${errors.email ? 'border-red-500' : 'border-[#e0e0e0]'} focus:outline-none focus:ring-2 focus:ring-black/20`}
                />
                {errors.email?.type === 'required' && <span className="text-xs text-red-500 mt-1">th1s f13ld 1s r3qu1r3d</span>}
                {errors.email?.type === 'pattern' && <span className="text-xs text-red-500 mt-1">pl34s3 3nt3r 4 v4l1d 3m41l 4ddr3ss</span>}
              </div>

              {/* Subject Field */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  subj3ct
                </label>
                <input
                  type="text"
                  id="subject"
                  {...register("subject", { required: true })}
                  className={`w-full p-3 border ${errors.subject ? 'border-red-500' : 'border-[#e0e0e0]'} focus:outline-none focus:ring-2 focus:ring-black/20`}
                />
                {errors.subject && <span className="text-xs text-red-500 mt-1">th1s f13ld 1s r3qu1r3d</span>}
              </div>

              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  m3ss4g3
                </label>
                <textarea
                  id="message"
                  rows={6}
                  {...register("message", { required: true })}
                  className={`w-full p-3 border ${errors.message ? 'border-red-500' : 'border-[#e0e0e0]'} focus:outline-none focus:ring-2 focus:ring-black/20`}
                />
                {errors.message && <span className="text-xs text-red-500 mt-1">th1s f13ld 1s r3qu1r3d</span>}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 px-6 transition-colors hover:bg-black/80 font-plus-jakarta uppercase text-sm tracking-wider"
                >
                  s3nd m3ss4g3
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-8 pb-24">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="animate-on-scroll opacity-0">
              <p className="text-[#777] text-sm mb-2">3m41l:</p>
              <a href="mailto:hello@aegntic.com" className="text-lg hover:underline">
                h3ll0@ӕӔ.c0m
              </a>
            </div>
            <div className="animate-on-scroll opacity-0">
              <p className="text-[#777] text-sm mb-2">ph0n3:</p>
              <a href="tel:+44-20-3333-4444" className="text-lg hover:underline">
                +44-20-3333-4444
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-[#f8f8f8] border-t border-[#e0e0e0]">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="mb-16 animate-on-scroll opacity-0">
              <h2 className="font-humane text-5xl md:text-6xl mb-2">fr3qu3ntly 4sk3d</h2>
              <h2 className="font-humane text-5xl md:text-6xl">qu3st10ns</h2>
            </div>

            <div className="space-y-8">
              {/* FAQ Item 1 */}
              <div className="border-t border-[#e0e0e0] pt-8 animate-on-scroll opacity-0">
                <h3 className="text-xl font-medium mb-4">h0w l0ng d03s 1t typ1c4lly t4k3 t0 c0mpl3t3 4 l0g0 d3s1gn?</h3>
                <p className="text-[#777]">
                  th3 t1m3l1n3 f0r l0g0 d3s1gn c4n v4ry d3p3nd1ng 0n f4ct0rs such 4s c0mpl3x1ty, r3v1s10ns, 4nd cl13nt f33db4ck. g3n3r4lly, th3 1n1t14l c0nc3pts c4n b3 d3l1v3r3d w1th1n 1-2 w33ks, w1th 4dd1t10n4l t1m3 n33d3d f0r r3v1s10ns 4nd f1n4l1z4t10n.
                </p>
              </div>

              {/* FAQ Item 2 */}
              <div className="border-t border-[#e0e0e0] pt-8 animate-on-scroll opacity-0">
                <h3 className="text-xl font-medium mb-4">wh4t f1l3 f0rm4ts w1ll 1 r3c31v3 up0n c0mpl3t10n 0f my d3s1gn pr0j3ct?</h3>
                <p className="text-[#777]">
                  1 pr0v1d3 cust0m3rs w1th 4 c0mpr3h3ns1v3 s3t 0f f1l3 f0rm4ts su1t4bl3 f0r 4 v4r13ty 0f 4ppl1c4t10ns, 1nclud1ng v3ct0r f0rm4ts such 4s 41 (4d0b3 1llustr4t0r) 4nd 3ps f0r sc4l4b1l1ty, 4s w3ll 4s r4st3r f0rm4ts such 4s png 4nd jp3g f0r w3b 4nd pr1nt us3.
                </p>
              </div>

              {/* FAQ Item 3 */}
              <div className="border-t border-[#e0e0e0] pt-8 animate-on-scroll opacity-0">
                <h3 className="text-xl font-medium mb-4">c4n y0u 1nc0rp0r4t3 my 3x1st1ng br4nd 3l3m3nts 1nt0 4 n3w d3s1gn?</h3>
                <p className="text-[#777]">
                  4bs0lut3ly! 1 und3rst4nd th3 1mp0rt4nc3 0f m41nt41n1ng br4nd c0ns1st3ncy. 1f y0u 4lr34dy h4v3 br4nd 3l3m3nts such 4s l0g0s, c0l0r sch3m3s, 0r f0nts, 1&apos;m h4ppy t0 1nc0rp0r4t3 th3m 1nt0 y0ur n3w d3s1gn t0 3nsur3 4 c0h3s1v3 br4nd 1d3nt1ty 4cr0ss 4ll y0ur m4t3r14ls.
                </p>
              </div>

              {/* FAQ Item 4 */}
              <div className="border-t border-[#e0e0e0] pt-8 animate-on-scroll opacity-0">
                <h3 className="text-xl font-medium mb-4">h0w d0 y0u 3nsur3 my w3bs1t3 d3s1gn 1s v1su4lly 4pp34l1ng 4nd 34sy t0 us3?</h3>
                <p className="text-[#777]">
                  my w3b d3s1gn pr0c3ss pr10r1t1z3s 43sth3t1cs 4nd funct10n4l1ty. 1 c0nduct th0r0ugh r3s34rch 1nt0 y0ur t4rg3t 4ud13nc3 4nd 1ndustry tr3nds t0 cr34t3 d3s1gns th4t n0t 0nly l00k gr34t but 4ls0 pr0v1d3 4n 1ntu1t1v3 us3r 3xp3r13nc3, r3sult1ng 1n gr34t3r 3ng4g3m3nt 4nd c0nv3rs10ns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
