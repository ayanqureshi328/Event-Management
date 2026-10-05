import { useEffect, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Instagram, Menu, Play, Sparkles, Ticket, X } from 'lucide-react';

const events = [
  {
    title: 'Afterglow',
    type: 'LIVE MUSIC · NEW YORK',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1100&q=85',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    className: 'event-card--wide',
  },
  {
    title: 'Good Company',
    type: 'FOOD & CULTURE · BROOKLYN',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=900&q=85',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    className: '',
  },
  {
    title: 'The Other Side',
    type: 'NIGHTLIFE · LOS ANGELES',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=900&q=85',
    video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    className: '',
  },
];

const services = [
  ['01', 'Experiences with a pulse', 'Festivals, launches, intimate gatherings. If it brings people together, we bring it to life.'],
  ['02', 'The beautiful details', 'The right room. The unexpected set. A lighting cue that gives everyone goosebumps.'],
  ['03', 'All the moving parts', 'Artists, production, ticketing, run-of-show. Consider every detail handled.'],
];
const NEXT_EVENT_DATE = new Date('2026-11-14T19:00:00');

function useCountdown(targetDate) {
  const getTimeLeft = () => {
    const difference = Math.max(0, targetDate.getTime() - Date.now());
    return {
      days: Math.floor(difference / 86400000),
      hours: Math.floor((difference / 3600000) % 24),
      minutes: Math.floor((difference / 60000) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };
  const [time, setTime] = useState(getTimeLeft);

  useEffect(() => {
    const interval = window.setInterval(() => setTime(getTimeLeft()), 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  return time;
}

function CountdownUnit({ value, label }) {
  const formatted = String(value).padStart(2, '0');
  return (
    <div className="countdown-unit" aria-label={`${value} ${label}`}>
      <div className="countdown-number" key={formatted}>{formatted}</div>
      <span>{label}</span>
    </div>
  );
}

function EventCard({ event }) {
  return (
    <article className={`event-card ${event.className}`}>
      <img src={event.image} alt={`${event.title} event`} loading="lazy" />
      <video className="event-video" src={event.video} muted loop playsInline preload="none" aria-hidden="true" />
      <span className="event-play" aria-hidden="true"><Play size={17} fill="currentColor" /></span>
      <div className="event-caption">
        <span>{event.type}</span>
        <h3>{event.title}</h3>
      </div>
      <button
        className="event-hitarea"
        aria-label={`Preview ${event.title}`}
        onMouseEnter={(e) => e.currentTarget.parentElement.querySelector('video').play().catch(() => {})}
        onMouseLeave={(e) => {
          const video = e.currentTarget.parentElement.querySelector('video');
          video.pause();
          video.currentTime = 0;
        }}
        onFocus={(e) => e.currentTarget.parentElement.querySelector('video').play().catch(() => {})}
        onBlur={(e) => e.currentTarget.parentElement.querySelector('video').pause()}
      />
    </article>
  );
}

function App() {
  const countdown = useCountdown(NEXT_EVENT_DATE);
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState('idle');

  useEffect(() => {
    const moveSpotlight = (event) => {
      document.documentElement.style.setProperty('--spot-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--spot-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', moveSpotlight, { passive: true });
    return () => window.removeEventListener('pointermove', moveSpotlight);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setFormState('sending');
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const inquiry = Object.fromEntries(form.entries());

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inquiry),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Something went wrong. Please try again.');
      setFormState('sent');
      formElement.reset();
    } catch (error) {
      setFormState('error');
      setTimeout(() => setFormState((current) => current === 'error' ? 'idle' : current), 5000);
    }
  }

  const statusMessage = formState === 'sent'
    ? 'You’re on the list. We’ll be in touch shortly.'
    : formState === 'error'
      ? 'We couldn’t send that just yet. Please try again.'
      : '';

  return (
    <main>
      <div className="spotlight" />
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Eventra home">eventra<span>.</span></a>
        <button className="menu-toggle" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#events" onClick={closeMenu}>Our nights</a>
          <a href="#about" onClick={closeMenu}>What we do</a>
          <a href="#voices" onClick={closeMenu}>Kind words</a>
          <a className="nav-cta" href="#tickets" onClick={closeMenu}>Get on the list <ArrowUpRight size={14} /></a>
        </nav>
      </header>

      <section className="hero" id="top">
        <img className="hero-image" src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=2400&q=90" alt="A packed live music venue glowing in the lights" />
        <div className="hero-shade" />
        <div className="hero-content">
          <p className="eyebrow hero-eyebrow"><span /> NEW YORK · NOVEMBER 14, 2026</p>
          <h1>Make a<br /><em>night</em> of it.</h1>
          <p className="hero-copy">The kind of night you’re still talking about<br className="desktop-break" /> on the way home.</p>
          <a href="#tickets" className="button button--pink">Find your people <ArrowRight size={17} /></a>
        </div>
        <div className="countdown" aria-label="Countdown to the next event">
          <span className="countdown-label">THE NEXT ONE IN</span>
          <div className="countdown-grid">
            <CountdownUnit value={countdown.days} label="DAYS" />
            <CountdownUnit value={countdown.hours} label="HRS" />
            <CountdownUnit value={countdown.minutes} label="MIN" />
            <CountdownUnit value={countdown.seconds} label="SEC" />
          </div>
          <a href="#tickets" className="countdown-link">Save your spot <ArrowDown size={13} /></a>
        </div>
        <div className="hero-side-note">GOOD PEOPLE. GREAT STORIES. <span>EST. 2018</span></div>
        <a className="scroll-cue" href="#events" aria-label="Scroll to past events"><ArrowDown size={18} /></a>
      </section>

      <section className="events section-wrap" id="events">
        <div className="section-heading">
          <div><p className="eyebrow"><span /> A FEW RECENT FAVORITES</p><h2>We had a <em>feeling</em><br />you’d ask.</h2></div>
          <a className="text-link" href="#tickets">More nights ahead <ArrowUpRight size={17} /></a>
        </div>
        <div className="events-grid">{events.map((event) => <EventCard event={event} key={event.title} />)}</div>
      </section>

      <section className="manifesto" id="about">
        <div className="manifesto-orbit" aria-hidden="true"><Sparkles size={19} /></div>
        <p className="eyebrow"><span /> IT’S NEVER JUST AN EVENT</p>
        <h2>It’s the moment<br />you <em>meet your people.</em></h2>
        <p className="manifesto-copy">We make room for the unexpected. For first songs, long conversations, and that little voice on the ride home saying, “we should do that again.”</p>
        <a className="text-link text-link--light" href="#services">A little more about us <ArrowDown size={16} /></a>
        <div className="manifesto-stamp">LESS SCROLLING<br />MORE STORIES</div>
      </section>

      <section className="services section-wrap" id="services">
        <div className="section-heading services-heading">
          <div><p className="eyebrow"><span /> FROM SPARK TO LAST CALL</p><h2>Good nights don’t<br />happen <em>by accident.</em></h2></div>
          <p className="services-intro">We dream it up, figure it out, and make the whole thing feel easy. That’s the plan.</p>
        </div>
        <div className="service-list">
          {services.map(([number, title, description]) => (
            <article className="service-row" key={number}>
              <span className="service-number">{number}</span>
              <h3>{title}</h3>
              <p>{description}</p>
              <ArrowUpRight className="service-arrow" size={19} />
            </article>
          ))}
        </div>
      </section>

      <section className="testimonial" id="voices">
        <div className="quote-mark">“</div>
        <blockquote>It felt like our kind of people had built a night just for us. Somehow, they had.</blockquote>
        <div className="quote-byline"><span className="quote-avatar">A</span><span><strong>Alex Rivera</strong><small>Afterglow guest · 2025</small></span></div>
        <div className="quote-count">01 <span>/</span> 03</div>
      </section>

      <section className="ticket-section" id="tickets">
        <div className="ticket-copy">
          <p className="eyebrow"><span /> YOUR NEXT GOOD STORY</p>
          <h2>Come as<br />you <em>are.</em></h2>
          <p>Bring your favorite people, or come meet some new ones. Either way, there’s room for you here.</p>
          <div className="ticket-note"><Ticket size={17} /><span>No pressure. Just first dibs<br />on the nights worth leaving home for.</span></div>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-heading"><h3>Save your spot</h3><span>TAKES 30 SECONDS</span></div>
          <label>Your name<input name="name" placeholder="The name your friends use" autoComplete="name" required /></label>
          <label>Email address<input name="email" type="email" placeholder="you@somewhere.com" autoComplete="email" required /></label>
          <label>Pick your night<select name="event" defaultValue="" required><option value="" disabled>There’s always something good coming up</option><option>Afterglow · New York · Nov 14</option><option>Good Company · Brooklyn · Coming soon</option><option>The Other Side · Los Angeles · Coming soon</option></select></label>
          <label>Bringing a crew?<select name="guests" defaultValue="1"><option value="1">Just me</option><option value="2">Two of us</option><option value="3">Three of us</option><option value="4">Four or more</option></select></label>
          <label className="message-label">Anything we should know?<textarea name="message" rows="2" placeholder="A little note (optional)" /></label>
          <button className="button button--pink submit-button" type="submit" disabled={formState === 'sending'}>
            {formState === 'sending' ? 'Saving your spot…' : formState === 'sent' ? 'You’re on the list' : 'I’m in'}
            {formState === 'sent' ? <Check size={17} /> : <ArrowRight size={17} />}
          </button>
          <p className={`form-status ${formState}`} role="status">{statusMessage}</p>
        </form>
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#top">eventra<span>.</span></a>
        <span>MADE FOR THE WAY WE FEEL TOGETHER.</span>
        <a className="social-link" href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Eventra on Instagram"><Instagram size={17} /></a>
        <small>© 2026 Eventra Studio</small>
      </footer>
    </main>
  );
}

export default App;