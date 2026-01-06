import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { isAuthenticated } = useAuth();
  const heroRef = useRef(null);
  const cardsRef = useRef(null);
  const featuresRef = useRef(null);
  const floatingKeysRef = useRef([]);

  useEffect(() => {
    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 0.6,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Update ScrollTrigger on Lenis scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Hero animations
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    
    heroTl
      .fromTo(
        heroRef.current.querySelector('h1'),
        { y: 100, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 1 }
      )
      .fromTo(
        heroRef.current.querySelector('p'),
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        '-=0.5'
      )
      .fromTo(
        heroRef.current.querySelectorAll('.hero-btn'),
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, stagger: 0.15 },
        '-=0.4'
      );

    // Floating keyboard keys animation
    floatingKeysRef.current.forEach((key, i) => {
      if (key) {
        gsap.to(key, {
          y: gsap.utils.random(-20, 20),
          x: gsap.utils.random(-10, 10),
          rotation: gsap.utils.random(-15, 15),
          duration: gsap.utils.random(2, 4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2,
        });
      }
    });

    // Cards scroll animation
    const cards = cardsRef.current?.querySelectorAll('.feature-card');
    if (cards) {
      gsap.fromTo(
        cards,
        { y: 100, opacity: 0, rotateX: -15 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Features section animation
    const featureItems = featuresRef.current?.querySelectorAll('.feature-item');
    if (featureItems) {
      gsap.fromTo(
        featureItems,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // Cleanup
    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const floatingKeys = ['W', 'P', 'M', '⌨', '🚀', '⚡'];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <div
        ref={heroRef}
        className="relative container mx-auto px-4 py-20 min-h-[80vh] flex flex-col justify-center items-center"
      >
        {/* Floating keyboard keys background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {floatingKeys.map((key, i) => (
            <div
              key={i}
              ref={(el) => (floatingKeysRef.current[i] = el)}
              className="absolute text-6xl opacity-10 dark:opacity-5 font-bold select-none"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
            >
              {key}
            </div>
          ))}
        </div>

        <div className="text-center relative z-10">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            <span className="inline-block bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto] drop-shadow-lg">
              Type Faster.
            </span>
            <br />
            <span className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-reverse bg-[length:200%_auto] drop-shadow-lg">
              Win Bigger.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto font-medium">
            From <span className="text-primary-500 font-bold">beginner</span> to <span className="text-green-500 font-bold">keyboard ninja</span> — 
            crush your limits in <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent font-bold">thrilling multiplayer races!</span>
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/register"
                className="hero-btn group relative px-10 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">🚀 Start Free</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/login"
                className="hero-btn px-10 py-4 bg-gray-800 dark:bg-white dark:text-gray-900 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-gray-500/30 transition-all duration-300 hover:scale-105"
              >
                Login
              </Link>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/test/normal"
                className="hero-btn group relative px-10 py-4 bg-gradient-to-r from-primary-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105 overflow-hidden"
              >
                <span className="relative z-10">Start Practicing</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/race"
                className="hero-btn px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105"
              >
                🏁 Join a Race
              </Link>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-gray-400 dark:bg-gray-600 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Feature Cards Section */}
      <div ref={cardsRef} className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="feature-card group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
              ⌨️
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              Speed Training
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Build muscle memory with 10,000+ words. Watch your WPM skyrocket in days, not months!
            </p>
            <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-primary-500 to-purple-500 transition-all duration-500 rounded-full"></div>
          </div>

          <div className="feature-card group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
              💻
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
              Code Like a Pro
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              JavaScript, Python, C++ & more — type real syntax and become a 10x developer!
            </p>
            <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-500 rounded-full"></div>
          </div>

          <div className="feature-card group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
              🏁
            </div>
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-pink-500 to-rose-600 bg-clip-text text-transparent">
              Race & Dominate
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              Challenge players worldwide! Outtype your rivals and claim the #1 spot on the leaderboard.
            </p>
            <div className="mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all duration-500 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-10 md:p-16 shadow-2xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            <span className="text-gray-900 dark:text-white">Why Choose </span>
            <span className="bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">TypeRacer</span>
            <span className="text-gray-900 dark:text-white">?</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="feature-item flex items-start gap-5 p-6 bg-white dark:bg-white/5 rounded-xl shadow-md dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors duration-300 border border-gray-100 dark:border-transparent">
              <span className="text-4xl">📊</span>
              <div>
                <h4 className="font-bold text-xl mb-2 bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">Your Stats, Visualized</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Watch your growth with stunning charts. Every keystroke counts towards your legacy!
                </p>
              </div>
            </div>
            <div className="feature-item flex items-start gap-5 p-6 bg-white dark:bg-white/5 rounded-xl shadow-md dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors duration-300 border border-gray-100 dark:border-transparent">
              <span className="text-4xl">🏆</span>
              <div>
                <h4 className="font-bold text-xl mb-2 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Global Rankings</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Daily, weekly & all-time leaderboards. Can you break into the Top 100?
                </p>
              </div>
            </div>
            <div className="feature-item flex items-start gap-5 p-6 bg-white dark:bg-white/5 rounded-xl shadow-md dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors duration-300 border border-gray-100 dark:border-transparent">
              <span className="text-4xl">🔥</span>
              <div>
                <h4 className="font-bold text-xl mb-2 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Daily Streaks 🔥</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Don't break the chain! Keep your streak alive and unlock exclusive badges.
                </p>
              </div>
            </div>
            <div className="feature-item flex items-start gap-5 p-6 bg-white dark:bg-white/5 rounded-xl shadow-md dark:shadow-none hover:bg-gray-50 dark:hover:bg-white/10 transition-colors duration-300 border border-gray-100 dark:border-transparent">
              <span className="text-4xl">🌙</span>
              <div>
                <h4 className="font-bold text-xl mb-2 bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">Night Owl Mode</h4>
                <p className="text-gray-600 dark:text-gray-400">
                  Practice at 3 AM without burning your eyes. Your retinas will thank you!
                </p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
              Join <span className="text-gray-900 dark:text-white font-bold">50,000+</span> typists already crushing it
            </p>
            <Link
              to={isAuthenticated ? '/test/normal' : '/register'}
              className="inline-block px-12 py-5 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-primary-500/50 transition-all duration-300 hover:scale-105 animate-pulse hover:animate-none"
            >
              {isAuthenticated ? 'Let\'s Race! 🏎️' : 'Start Your Journey →'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
